const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const crypto = require('crypto');

const getRazorpay = () => {
  const Razorpay = require('razorpay');
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET not set in .env');
  }
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// ── GET /api/payment/config ─────────────────────────────────────────────────
router.get('/config', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) return res.status(500).json({ message: 'Razorpay not configured' });
  res.json({ keyId });
});

// ── POST /api/payment/create-order ─────────────────────────────────────────
// Creates Razorpay order + pending DB order
router.post('/create-order', protect, async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const { address, paymentMethod, couponCode, notes } = req.body;

    // Load cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map(item => {
      subtotal += item.product.price * item.quantity;
      return {
        product:  item.product._id,
        name:     item.product.name,
        image:    item.product.image,
        price:    item.product.price,
        quantity: item.quantity,
      };
    });

    // Apply coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date() < coupon.expiresAt && coupon.usedCount < coupon.usageLimit && subtotal >= coupon.minOrderAmount) {
        discount = coupon.discountType === 'percentage'
          ? Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount || Infinity)
          : coupon.discount;
      }
    }

    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const totalPrice     = Math.round((subtotal - discount + deliveryCharge) * 100) / 100;
    const amountInPaise  = Math.round(totalPrice * 100); // Razorpay uses paise

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
      notes: {
        userId:    req.user._id.toString(),
        userName:  req.user.name,
        userEmail: req.user.email,
      },
    });

    // Create pending DB order
    const order = await Order.create({
      user:             req.user._id,
      items:            orderItems,
      totalPrice,
      deliveryCharge,
      discount,
      couponCode:       couponCode || '',
      address,
      paymentMethod:    paymentMethod || 'Card',
      paymentStatus:    'Pending',
      razorpayOrderId:  razorpayOrder.id,
      notes:            notes || '',
      orderStatus:      'Pending',
      statusHistory:    [{ status: 'Pending', timestamp: new Date() }],
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      orderId:         order._id,
      amount:          totalPrice,
      amountInPaise,
      currency:        'INR',
      keyId:           process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/payment/verify ────────────────────────────────────────────────
// Verifies Razorpay payment signature and confirms order
router.post('/verify', protect, async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature (HMAC SHA256)
    const body      = razorpayOrderId + '|' + razorpayPaymentId;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed — invalid signature' });
    }

    // Mark order as paid
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentStatus      = 'Paid';
    order.paidAt             = new Date();
    order.razorpayPaymentId  = razorpayPaymentId;
    order.razorpaySignature  = razorpaySignature;
    await order.save();

    // Deduct stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Increment coupon usage
    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: order.couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    console.log(`✅ Payment verified: Order ${order._id} | Payment ${razorpayPaymentId}`);
    res.json({ success: true, orderId: order._id });

  } catch (err) {
    console.error('Verify error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/payment/webhook ────────────────────────────────────────────────
// Razorpay sends events here (configure in Razorpay Dashboard → Webhooks)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret    = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

  try {
    const body     = req.body.toString();
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (expected !== signature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(body);
    console.log('📦 Razorpay webhook:', event.event);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const order   = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (order && order.paymentStatus !== 'Paid') {
        order.paymentStatus     = 'Paid';
        order.paidAt            = new Date();
        order.razorpayPaymentId = payment.id;
        await order.save();
        console.log(`✅ Webhook: Order ${order._id} marked Paid`);
      }
    }

    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const order   = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (order) {
        order.paymentStatus = 'Failed';
        await order.save();
        console.log(`❌ Webhook: Order ${order._id} payment failed`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;