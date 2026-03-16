const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { updatePrices } = require('../utils/pricingScheduler');
const Product = require('../models/Product');

const adminOnly = [protect, authorizeRoles('admin')];

// GET /api/pricing/status — pricing overview for admin dashboard
router.get('/status', adminOnly, async (req, res) => {
  try {
    const [total, enabled, recentlyUpdated, risingCount, fallingCount] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ dynamicPricingEnabled: true, isActive: true }),
      Product.countDocuments({ lastPriceUpdate: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) } }),
      Product.countDocuments({ priceChangePercent: { $gt: 2 } }),
      Product.countDocuments({ priceChangePercent: { $lt: -2 } }),
    ]);

    // Top price changes
    const topRising = await Product.find({ priceChangePercent: { $gt: 0 } })
      .sort({ priceChangePercent: -1 }).limit(5)
      .select('name category price basePrice priceChangePercent lastPriceUpdate');

    const topFalling = await Product.find({ priceChangePercent: { $lt: 0 } })
      .sort({ priceChangePercent: 1 }).limit(5)
      .select('name category price basePrice priceChangePercent lastPriceUpdate');

    res.json({
      total, enabled, disabled: total - enabled,
      recentlyUpdated, risingCount, fallingCount,
      topRising, topFalling,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/pricing/run — manually trigger pricing update
router.post('/run', adminOnly, async (req, res) => {
  try {
    const { category } = req.body;
    console.log(`🔧 Manual pricing trigger by admin${category ? ` for ${category}` : ' for ALL'}`);
    const result = await updatePrices(category || null, false);
    res.json({ message: 'Pricing update complete', ...result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/pricing/toggle/:productId — enable/disable dynamic pricing for one product
router.put('/toggle/:productId', adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.dynamicPricingEnabled = !product.dynamicPricingEnabled;
    await product.save();
    res.json({ message: `Dynamic pricing ${product.dynamicPricingEnabled ? 'enabled' : 'disabled'}`, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/pricing/toggle-category — enable/disable for entire category
router.put('/toggle-category', adminOnly, async (req, res) => {
  try {
    const { category, enabled } = req.body;
    const result = await Product.updateMany({ category }, { dynamicPricingEnabled: enabled });
    res.json({ message: `Dynamic pricing ${enabled ? 'enabled' : 'disabled'} for ${category}`, modified: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/pricing/history/:productId — price history for a product
router.get('/history/:productId', adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select('+priceHistory');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({
      name: product.name,
      currentPrice: product.price,
      basePrice: product.basePrice,
      priceChangePercent: product.priceChangePercent,
      history: product.priceHistory.slice(-30).reverse(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/pricing/track-view/:productId — track product view (affects demand score)
router.post('/track-view/:productId', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.productId, {
      $inc: { viewCount: 1 },
    });
    // Update demand score asynchronously
    updateDemandScore(req.params.productId);
    res.json({ ok: true });
  } catch (_) {
    res.json({ ok: false });
  }
});

// POST /api/pricing/track-cart/:productId — track add-to-cart (high demand signal)
router.post('/track-cart/:productId', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.productId, {
      $inc: { addToCartCount: 1 },
    });
    updateDemandScore(req.params.productId);
    res.json({ ok: true });
  } catch (_) {
    res.json({ ok: false });
  }
});

// Recalculate demand score based on views + cart adds
const updateDemandScore = async (productId) => {
  try {
    const p = await Product.findById(productId).select('viewCount addToCartCount demandScore');
    if (!p) return;
    // Cart adds count 5x more than views
    const raw = (p.viewCount || 0) + (p.addToCartCount || 0) * 5;
    // Normalize to 0-100 using log scale
    const score = Math.min(100, Math.round(Math.log1p(raw) * 12));
    await Product.findByIdAndUpdate(productId, { demandScore: score });
  } catch (_) {}
};

module.exports = router;