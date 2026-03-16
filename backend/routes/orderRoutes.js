const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, validateCoupon } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.post('/coupon', protect, validateCoupon);
router.get('/:id', protect, getOrderById);

module.exports = router;
