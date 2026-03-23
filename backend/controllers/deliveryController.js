// const Order = require('../models/Order');

// // @desc Get assigned orders for delivery person
// // @route GET /api/delivery/orders
// const getAssignedOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       deliveryPerson: req.user._id,
//       orderStatus: { $in: ['Assigned', 'Accepted', 'OutForDelivery'] },
//     })
//       .populate('user', 'name phone address')
//       .sort('-updatedAt');
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Get completed deliveries
// // @route GET /api/delivery/completed
// const getCompletedDeliveries = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       deliveryPerson: req.user._id,
//       orderStatus: 'Delivered',
//     })
//       .populate('user', 'name phone')
//       .sort('-deliveredAt');
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Accept order
// // @route PUT /api/delivery/orders/:id/accept
// const acceptOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({ _id: req.params.id, deliveryPerson: req.user._id });
//     if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });
//     if (order.orderStatus !== 'Assigned') return res.status(400).json({ message: 'Order cannot be accepted at this stage' });

//     order.orderStatus = 'Accepted';
//     await order.save();
//     await order.populate('user', 'name phone address');
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Mark order out for delivery
// // @route PUT /api/delivery/orders/:id/out-for-delivery
// const outForDelivery = async (req, res) => {
//   try {
//     const order = await Order.findOne({ _id: req.params.id, deliveryPerson: req.user._id });
//     if (!order) return res.status(404).json({ message: 'Order not found' });
//     if (order.orderStatus !== 'Accepted') return res.status(400).json({ message: 'Order must be accepted first' });

//     order.orderStatus = 'OutForDelivery';
//     await order.save();
//     await order.populate('user', 'name phone address');
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Mark order delivered
// // @route PUT /api/delivery/orders/:id/delivered
// const markDelivered = async (req, res) => {
//   try {
//     const order = await Order.findOne({ _id: req.params.id, deliveryPerson: req.user._id });
//     if (!order) return res.status(404).json({ message: 'Order not found' });
//     if (order.orderStatus !== 'OutForDelivery') return res.status(400).json({ message: 'Order must be out for delivery first' });

//     order.orderStatus = 'Delivered';
//     order.paymentStatus = 'Paid';
//     await order.save();
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Get delivery stats
// // @route GET /api/delivery/stats
// const getDeliveryStats = async (req, res) => {
//   try {
//     const today = new Date(); today.setHours(0, 0, 0, 0);
//     const [totalDelivered, todayDelivered, pending, active] = await Promise.all([
//       Order.countDocuments({ deliveryPerson: req.user._id, orderStatus: 'Delivered' }),
//       Order.countDocuments({ deliveryPerson: req.user._id, orderStatus: 'Delivered', deliveredAt: { $gte: today } }),
//       Order.countDocuments({ deliveryPerson: req.user._id, orderStatus: 'Assigned' }),
//       Order.countDocuments({ deliveryPerson: req.user._id, orderStatus: { $in: ['Accepted', 'OutForDelivery'] } }),
//     ]);
//     res.json({ totalDelivered, todayDelivered, pending, active });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getAssignedOrders, getCompletedDeliveries, acceptOrder, outForDelivery, markDelivered, getDeliveryStats };

const Order = require('../models/Order');
const Notification = require('../models/Notification');

const notify = async (userId, title, message, type = 'order', link = '', icon = 'notifications') => {
  try {
    await Notification.create({ user: userId, title, message, type, link, icon });
    if (global.io) global.io.to(userId.toString()).emit('notification', { title, message, type });
  } catch (_) {}
};

const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPerson: req.user._id,
      orderStatus: { $in: ['Assigned', 'Accepted', 'OutForDelivery'] },
    }).populate('user', 'name phone address').sort('-updatedAt');
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getCompletedDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPerson: req.user._id, orderStatus: 'Delivered' })
      .populate('user', 'name phone').sort('-deliveredAt');
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, deliveryPerson: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderStatus !== 'Assigned') return res.status(400).json({ message: 'Order cannot be accepted now' });

    order.orderStatus = 'Accepted';
    await order.save();
    await order.populate('user', 'name phone address');

    // Notify customer
    await notify(order.user._id,
      '✅ Rider Accepted Your Order',
      `Your order #${order._id.toString().slice(-6).toUpperCase()} has been accepted and is being prepared for pickup.`,
      'order', `/orders/${order._id}`, 'check_circle'
    );

    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const outForDelivery = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, deliveryPerson: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderStatus !== 'Accepted') return res.status(400).json({ message: 'Order must be accepted first' });

    order.orderStatus = 'OutForDelivery';
    await order.save();
    await order.populate('user', 'name phone address');

    // Notify customer — this is the most exciting one!
    await notify(order.user._id,
      '🚴 Your Order is On the Way!',
      `Your order #${order._id.toString().slice(-6).toUpperCase()} is out for delivery. Expected in 20-30 minutes!`,
      'order', `/orders/${order._id}`, 'delivery_dining'
    );

    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const markDelivered = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, deliveryPerson: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderStatus !== 'OutForDelivery') return res.status(400).json({ message: 'Order must be out for delivery first' });

    order.orderStatus = 'Delivered';
    order.paymentStatus = 'Paid';
    await order.save();
    await order.populate('user', 'name');

    // Notify customer
    await notify(order.user._id,
      '🎉 Order Delivered!',
      `Your order #${order._id.toString().slice(-6).toUpperCase()} has been delivered. Enjoy your groceries! Rate your experience.`,
      'order', `/orders/${order._id}`, 'done_all'
    );

    // Add loyalty points — 1 pt per ₹10
    const User = require('../models/User');
    const pts = Math.floor(order.totalPrice / 10);
    if (pts > 0) {
      await User.findByIdAndUpdate(order.user._id, {
        $inc: { loyaltyPoints: pts, totalEarned: pts }
      });
      await notify(order.user._id,
        `⭐ You Earned ${pts} Loyalty Points!`,
        `₹${order.totalPrice} order = ${pts} points added to your account.`,
        'loyalty', '/loyalty', 'stars'
      );
    }

    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getDeliveryStats = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [totalDelivered, todayDelivered, pending, active] = await Promise.all([
      Order.countDocuments({ deliveryPerson: req.user._id, orderStatus: 'Delivered' }),
      Order.countDocuments({ deliveryPerson: req.user._id, orderStatus: 'Delivered', deliveredAt: { $gte: today } }),
      Order.countDocuments({ deliveryPerson: req.user._id, orderStatus: 'Assigned' }),
      Order.countDocuments({ deliveryPerson: req.user._id, orderStatus: { $in: ['Accepted', 'OutForDelivery'] } }),
    ]);
    res.json({ totalDelivered, todayDelivered, pending, active });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getAssignedOrders, getCompletedDeliveries, acceptOrder, outForDelivery, markDelivered, getDeliveryStats };