/**
 * Features Routes — all 8 features
 */
const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const Order        = require('../models/Order');
const User         = require('../models/User');
const Product      = require('../models/Product');
const Notification = require('../models/Notification');
const FlashSale    = require('../models/FlashSale');
const Bundle       = require('../models/Bundle');
const Subscription = require('../models/Subscription');
const Cart         = require('../models/Cart');
const crypto       = require('crypto');

const admin    = [protect, authorizeRoles('admin')];
const customer = [protect, authorizeRoles('customer')];

// ── helper: emit socket notification ─────────────────────────────────────
const emitNotification = async (userId, { title, message, type = 'system', link = '', icon = 'notifications' }) => {
  const notif = await Notification.create({ user: userId, title, message, type, link, icon });
  if (global.io) global.io.to(userId.toString()).emit('notification', notif);
  return notif;
};

// ══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════
router.get('/notifications', protect, async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.user._id })
      .sort('-createdAt').limit(30);
    const unread = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ notifications: notifs, unread });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/notifications/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/notifications/:id', protect, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════
// LOYALTY POINTS
// ══════════════════════════════════════════════════════════════════════════
router.get('/loyalty', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('loyaltyPoints loyaltyTier totalEarned');
    const orders = await Order.find({ user: req.user._id, paymentStatus: 'Paid' })
      .select('totalPrice createdAt loyaltyPointsEarned').sort('-createdAt').limit(20);
    const tiers = [
      { name: 'Bronze',   min: 0,    max: 499,  color: 'bg-amber-700',   perks: ['1 point per ₹10 spent'] },
      { name: 'Silver',   min: 500,  max: 1999, color: 'bg-slate-400',   perks: ['1.5x points', 'Free delivery on orders > ₹300'] },
      { name: 'Gold',     min: 2000, max: 4999, color: 'bg-yellow-500',  perks: ['2x points', 'Priority support', 'Free delivery always'] },
      { name: 'Platinum', min: 5000, max: null, color: 'bg-purple-600',  perks: ['3x points', 'Exclusive deals', 'Dedicated support'] },
    ];
    res.json({ user, orders, tiers });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Redeem points at checkout
router.post('/loyalty/redeem', customer, async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findById(req.user._id);
    if (user.loyaltyPoints < points) return res.status(400).json({ message: 'Not enough points' });
    const discount = Math.floor(points / 10); // 10 points = ₹1
    res.json({ discount, pointsUsed: points });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════
// REFERRAL SYSTEM
// ══════════════════════════════════════════════════════════════════════════
router.get('/referral', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('referralCode referralCount referralEarnings');
    const referred = await User.find({ referredBy: req.user._id })
      .select('name createdAt').sort('-createdAt');
    res.json({ user, referred, referralLink: `${process.env.CLIENT_URL || 'http://localhost:5173'}/register?ref=${user.referralCode}` });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Apply referral code during register
router.post('/referral/apply', async (req, res) => {
  try {
    const { code, newUserId } = req.body;
    const referrer = await User.findOne({ referralCode: code.toUpperCase() });
    if (!referrer) return res.status(404).json({ message: 'Invalid referral code' });
    // Give referrer 200 bonus points
    referrer.loyaltyPoints  += 200;
    referrer.totalEarned    += 200;
    referrer.referralCount  += 1;
    referrer.referralEarnings += 200;
    await referrer.save();
    // Tag new user
    await User.findByIdAndUpdate(newUserId, { referredBy: referrer._id });
    // Notify referrer
    await emitNotification(referrer._id, {
      title: 'Referral Bonus! 🎉',
      message: 'Someone signed up with your referral code. You earned 200 bonus points!',
      type: 'referral', icon: 'card_giftcard',
    });
    res.json({ success: true, bonus: 200 });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════
// FLASH SALES
// ══════════════════════════════════════════════════════════════════════════
router.get('/flash-sales', async (req, res) => {
  try {
    const now = new Date();
    const sales = await FlashSale.find({
      isActive: true,
      startTime: { $lte: now },
      endTime:   { $gte: now },
    }).sort('endTime');
    res.json(sales);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/flash-sales/all', admin, async (req, res) => {
  try {
    const sales = await FlashSale.find().sort('-createdAt');
    res.json(sales);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/flash-sales', admin, async (req, res) => {
  try {
    const sale = await FlashSale.create(req.body);
    // Notify all customers
    const customers = await User.find({ role: 'customer', isActive: true }).select('_id');
    for (const c of customers.slice(0, 100)) {
      await emitNotification(c._id, {
        title: `⚡ Flash Sale: ${sale.title}`,
        message: `${sale.discount}% off! Ends in ${Math.round((new Date(sale.endTime) - new Date()) / 3600000)} hours`,
        type: 'flash_sale', icon: 'bolt', link: '/products',
      });
    }
    res.status(201).json(sale);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/flash-sales/:id', admin, async (req, res) => {
  try {
    const sale = await FlashSale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sale);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/flash-sales/:id', admin, async (req, res) => {
  try {
    await FlashSale.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════
// BUNDLE DEALS
// ══════════════════════════════════════════════════════════════════════════
router.get('/bundles', async (req, res) => {
  try {
    const bundles = await Bundle.find({ isActive: true })
      .populate('products.product', 'name price image').sort('-createdAt');
    res.json(bundles);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/bundles', admin, async (req, res) => {
  try {
    const bundle = await Bundle.create(req.body);
    res.status(201).json(bundle);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/bundles/:id', admin, async (req, res) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bundle);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/bundles/:id', admin, async (req, res) => {
  try {
    await Bundle.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Add bundle to cart
router.post('/bundles/:id/add-to-cart', customer, async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id).populate('products.product');
    if (!bundle) return res.status(404).json({ message: 'Bundle not found' });
    const cart = await Cart.findOne({ user: req.user._id }) || new Cart({ user: req.user._id, items: [] });
    for (const item of bundle.products) {
      const idx = cart.items.findIndex(i => i.product?.toString() === item.product._id.toString());
      if (idx >= 0) cart.items[idx].quantity += item.quantity;
      else cart.items.push({ product: item.product._id, quantity: item.quantity });
    }
    await cart.save();
    res.json({ success: true, message: `${bundle.name} added to cart!` });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════
// SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════════════════
router.get('/subscriptions', customer, async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user._id })
      .populate('items.product', 'name price image unit');
    res.json(subs);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/subscriptions', customer, async (req, res) => {
  try {
    const { items, frequency, deliveryDay, timeSlot, address } = req.body;
    const nextDelivery = getNextDelivery(frequency, deliveryDay);
    const sub = await Subscription.create({
      user: req.user._id, items, frequency, deliveryDay,
      timeSlot, address, nextDelivery, isActive: true,
    });
    await emitNotification(req.user._id, {
      title: 'Subscription Created! 🔄',
      message: `Your ${frequency} subscription is set. First delivery: ${nextDelivery.toLocaleDateString()}`,
      type: 'order', icon: 'autorenew',
    });
    res.status(201).json(sub);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/subscriptions/:id', customer, async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true }
    );
    res.json(sub);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/subscriptions/:id', customer, async (req, res) => {
  try {
    await Subscription.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── helper: calculate next delivery date ─────────────────────────────────
const getNextDelivery = (frequency, deliveryDay) => {
  const d = new Date();
  d.setHours(8, 0, 0, 0);
  if (frequency === 'daily')    { d.setDate(d.getDate() + 1); return d; }
  if (frequency === 'weekly')   { const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(deliveryDay || 'Mon'); const diff = (day - d.getDay() + 7) % 7 || 7; d.setDate(d.getDate() + diff); return d; }
  if (frequency === 'biweekly') { d.setDate(d.getDate() + 14); return d; }
  if (frequency === 'monthly')  { d.setMonth(d.getMonth() + 1); return d; }
  return d;
};

// ══════════════════════════════════════════════════════════════════════════
// SALES ANALYTICS
// ══════════════════════════════════════════════════════════════════════════
router.get('/analytics', admin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days  = Number(period);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [orders, allOrders, users, products] = await Promise.all([
      Order.find({ createdAt: { $gte: since }, paymentStatus: 'Paid' })
        .populate('user', 'name').sort('createdAt'),
      Order.find({ paymentStatus: 'Paid' }),
      User.find({ role: 'customer', createdAt: { $gte: since } }),
      Product.find({ isActive: true }),
    ]);

    // Revenue by day
    const revenueByDay = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      revenueByDay[d.toISOString().slice(0, 10)] = 0;
    }
    orders.forEach(o => {
      const key = o.createdAt.toISOString().slice(0, 10);
      if (revenueByDay[key] !== undefined) revenueByDay[key] += o.totalPrice;
    });

    // Top products
    const productSales = {};
    orders.forEach(o => o.items?.forEach(item => {
      const id = item.product?.toString();
      if (id) { productSales[id] = (productSales[id] || { revenue: 0, qty: 0, name: item.name }); productSales[id].revenue += item.price * item.quantity; productSales[id].qty += item.quantity; }
    }));
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 10)
      .map(([id, v]) => ({ id, ...v, revenue: Math.round(v.revenue) }));

    // Category revenue
    const catRevenue = {};
    orders.forEach(o => o.items?.forEach(item => {
      // map back to category via product name heuristics (fast, no extra DB call)
      catRevenue['All'] = (catRevenue['All'] || 0) + item.price * item.quantity;
    }));

    // Orders by status
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Payment method breakdown
    const paymentBreakdown = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue  = orders.reduce((s, o) => s + o.totalPrice, 0);
    const totalOrders   = orders.length;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    res.json({
      summary: {
        totalRevenue:   Math.round(totalRevenue),
        totalOrders,
        avgOrderValue:  Math.round(avgOrderValue),
        newCustomers:   users.length,
        totalProducts:  products.length,
        allTimeRevenue: Math.round(allOrders.reduce((s, o) => s + o.totalPrice, 0)),
      },
      revenueByDay: Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue: Math.round(revenue) })),
      topProducts,
      statusCounts,
      paymentBreakdown,
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;