const express = require('express');
const router = express.Router();
const { getAllOrders, assignDeliveryPerson, getAllUsers, toggleUserStatus, getDeliveryPersons, getAnalytics, createCoupon, getCoupons, cancelOrder } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const adminOnly = [protect, authorizeRoles('admin')];

router.get('/analytics', ...adminOnly, getAnalytics);
router.get('/orders', ...adminOnly, getAllOrders);
router.put('/orders/:id/assign', ...adminOnly, assignDeliveryPerson);
router.put('/orders/:id/cancel', ...adminOnly, cancelOrder);
router.get('/users', ...adminOnly, getAllUsers);
router.put('/users/:id/toggle', ...adminOnly, toggleUserStatus);
router.get('/delivery-persons', ...adminOnly, getDeliveryPersons);
router.route('/coupons').get(...adminOnly, getCoupons).post(...adminOnly, createCoupon);

module.exports = router;
