const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const Order   = require('../models/Order');
const User    = require('../models/User');
const {
  getRecommendations,
  rankSearchResults,
  getAbandonedCarts,
  forecastInventory,
  optimizeDeliveryRoutes,
  getSmartCouponTargets,
} = require('../utils/algorithms');
const Product = require('../models/Product');

const adminOnly = [protect, authorizeRoles('admin')];

// ── GET /api/algo/recommendations ─────────────────────────────────────────
// Personalized recommendations for logged-in user
router.get('/recommendations', protect, async (req, res) => {
  try {
    const { productId, limit = 8 } = req.query;
    const products = await getRecommendations(req.user._id, productId, Number(limit));
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET /api/algo/recommendations/public ─────────────────────────────────
// Trending recommendations for non-logged-in users
router.get('/recommendations/public', async (req, res) => {
  try {
    const { productId, limit = 8 } = req.query;
    const products = await getRecommendations(null, productId, Number(limit));
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET /api/algo/search ──────────────────────────────────────────────────
// Smart ranked search — replaces basic search
router.get('/search', async (req, res) => {
  try {
    const { keyword = '', category = '', sort, page = 1, limit = 12 } = req.query;
    const userId = req.headers.authorization ? req.user?._id : null;

    const query = { isActive: true };
    if (keyword)  query.name = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;

    const raw = await Product.find(query).limit(Number(limit) * 3).lean();
    const ranked = await rankSearchResults(raw, userId, keyword);
    const paginated = ranked.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

    res.json({
      products: paginated,
      total:    ranked.length,
      pages:    Math.ceil(ranked.length / Number(limit)),
      page:     Number(page),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET /api/algo/abandoned-carts ─────────────────────────────────────────
router.get('/abandoned-carts', adminOnly, async (req, res) => {
  try {
    const { hours = 2 } = req.query;
    const carts = await getAbandonedCarts(Number(hours));
    res.json({ count: carts.length, carts });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET /api/algo/inventory-forecast ──────────────────────────────────────
router.get('/inventory-forecast', adminOnly, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const forecast = await forecastInventory(Number(days));
    res.json({
      forecast,
      summary: {
        critical: forecast.filter(f => f.risk === 'critical').length,
        high:     forecast.filter(f => f.risk === 'high').length,
        medium:   forecast.filter(f => f.risk === 'medium').length,
      }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── POST /api/algo/optimize-routes ────────────────────────────────────────
router.post('/optimize-routes', adminOnly, async (req, res) => {
  try {
    // Fetch pending orders + available delivery persons
    const pendingOrders = await Order.find({ orderStatus: 'Pending' })
      .populate('user', 'name phone').limit(20).lean();
    const deliveryPersons = await User.find({ role: 'delivery', isActive: true }).lean();

    const assignments = await optimizeDeliveryRoutes(pendingOrders, deliveryPersons);
    res.json({ assignments, totalOrders: pendingOrders.length, totalPersons: deliveryPersons.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── POST /api/algo/optimize-routes/apply ──────────────────────────────────
// Actually assign the suggested routes
router.post('/optimize-routes/apply', adminOnly, async (req, res) => {
  try {
    const { assignments } = req.body;
    let applied = 0;
    for (const a of (assignments || [])) {
      await Order.findByIdAndUpdate(a.orderId, {
        deliveryPerson: a.deliveryPerson._id,
        orderStatus: 'Assigned',
        $push: { statusHistory: { status: 'Assigned', timestamp: new Date(), note: 'Auto-assigned by route optimizer' } },
      });
      applied++;
    }
    res.json({ applied, message: `${applied} orders assigned to delivery persons` });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET /api/algo/coupon-targets ──────────────────────────────────────────
router.get('/coupon-targets', adminOnly, async (req, res) => {
  try {
    const targets = await getSmartCouponTargets();
    res.json({
      targets,
      summary: {
        total:        targets.length,
        never_ordered: targets.filter(t => t.segment === 'never_ordered').length,
        churned:       targets.filter(t => t.segment === 'churned').length,
        at_risk:       targets.filter(t => t.segment === 'at_risk').length,
        low_value:     targets.filter(t => t.segment === 'low_value').length,
      }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;