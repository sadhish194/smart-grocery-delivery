const express = require('express');
const router = express.Router();
const { getAssignedOrders, getCompletedDeliveries, acceptOrder, outForDelivery, markDelivered, getDeliveryStats } = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const deliveryOnly = [protect, authorizeRoles('delivery')];

router.get('/orders', ...deliveryOnly, getAssignedOrders);
router.get('/completed', ...deliveryOnly, getCompletedDeliveries);
router.get('/stats', ...deliveryOnly, getDeliveryStats);
router.put('/orders/:id/accept', ...deliveryOnly, acceptOrder);
router.put('/orders/:id/out-for-delivery', ...deliveryOnly, outForDelivery);
router.put('/orders/:id/delivered', ...deliveryOnly, markDelivered);

module.exports = router;
