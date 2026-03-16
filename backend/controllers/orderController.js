const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc Create order
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { address, paymentMethod, couponCode, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let subtotal = 0;
    const orderItems = cart.items.map(item => {
      subtotal += item.product.price * item.quantity;
      return {
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      };
    });

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date() < coupon.expiresAt && coupon.usedCount < coupon.usageLimit) {
        if (subtotal >= coupon.minOrderAmount) {
          discount = coupon.discountType === 'percentage'
            ? Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount || Infinity)
            : coupon.discount;
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const totalPrice = subtotal - discount + deliveryCharge;

    // Update stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      deliveryCharge,
      discount,
      couponCode,
      address,
      paymentMethod: paymentMethod || 'COD',
      notes,
      statusHistory: [{ status: 'Pending', timestamp: new Date() }],
    });

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get my orders
// @route GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('deliveryPerson', 'name phone');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single order
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('deliveryPerson', 'name phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only allow order owner, admin, or assigned delivery person
    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user._id.toString() &&
      (!order.deliveryPerson || order.deliveryPerson._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Validate coupon
// @route POST /api/orders/coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (new Date() > coupon.expiresAt) return res.status(400).json({ message: 'Coupon expired' });
    if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (amount < coupon.minOrderAmount) return res.status(400).json({ message: `Minimum order amount is ₹${coupon.minOrderAmount}` });

    const discount = coupon.discountType === 'percentage'
      ? Math.min((amount * coupon.discount) / 100, coupon.maxDiscount || Infinity)
      : coupon.discount;

    res.json({ valid: true, discount, coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, validateCoupon };
