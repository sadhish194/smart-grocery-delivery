/**
 * Pricing Scheduler
 * ─────────────────
 * Runs dynamic pricing updates automatically on a schedule.
 * No external cron library needed — uses setInterval.
 *
 * Schedule:
 *   - Every 6 hours: update ALL products
 *   - Every 30 mins: update Vegetables & Fruits (most volatile)
 *   - On demand: via admin API
 */

const Product = require('../models/Product');
const { calculateNewPrice, fetchCommodityPrices } = require('./dynamicPricing');

let isRunning = false;

const updatePrices = async (categoryFilter = null, silent = false) => {
  if (isRunning) {
    if (!silent) console.log('⏳ Pricing update already running, skipping...');
    return { updated: 0, skipped: 0, message: 'Already running' };
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    if (!silent) console.log(`\n📊 Dynamic Pricing Update${categoryFilter ? ` [${categoryFilter}]` : ' [ALL]'} — ${new Date().toLocaleString()}`);

    // Fetch market data once for this batch
    const marketData = await fetchCommodityPrices();
    if (!silent) console.log(`   Market data: inflation factor = ${marketData.inflationFactor.toFixed(4)} (${marketData.source})`);

    // Build query
    const query = { dynamicPricingEnabled: true, isActive: true };
    if (categoryFilter) query.category = categoryFilter;

    const products = await Product.find(query).select('+priceHistory').lean();
    if (!silent) console.log(`   Products to update: ${products.length}`);

    const bulkOps = [];
    let updated = 0, unchanged = 0;

    for (const product of products) {
      // Set basePrice if not set yet
      const basePrice = product.basePrice || product.price;
      const { newPrice, changePercent, reason, factors } = await calculateNewPrice(
        { ...product, basePrice },
        marketData
      );

      // Only update if price changed by more than 0.5%
      const priceDiff = Math.abs(newPrice - product.price) / product.price;
      if (priceDiff < 0.005) { unchanged++; continue; }

      const newDiscount = product.originalPrice > newPrice
        ? Math.round((1 - newPrice / product.originalPrice) * 100)
        : 0;

      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              price:             newPrice,
              basePrice,
              discount:          Math.max(0, newDiscount),
              priceChangePercent: changePercent,
              lastPriceUpdate:   new Date(),
            },
            $push: {
              priceHistory: {
                $each: [{ price: newPrice, reason, changedAt: new Date() }],
                $slice: -30, // keep last 30 entries
              }
            }
          }
        }
      });
      updated++;
    }

    // Execute bulk update
    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    if (!silent) {
      console.log(`   ✅ Updated: ${updated} | Unchanged: ${unchanged} | Time: ${elapsed}s\n`);
    }

    return { updated, skipped: unchanged, elapsed, marketData };

  } catch (err) {
    console.error('❌ Pricing update error:', err.message);
    return { updated: 0, skipped: 0, error: err.message };
  } finally {
    isRunning = false;
  }
};

// ── Start scheduler ───────────────────────────────────────────────────────────
const startScheduler = () => {
  console.log('🕐 Dynamic Pricing Scheduler started');

  // Run immediately on startup (after 10s delay to let DB connect)
  setTimeout(() => updatePrices(null, true), 10000);

  // Every 30 minutes: update volatile categories
  setInterval(() => {
    updatePrices('Vegetables', true);
    setTimeout(() => updatePrices('Fruits', true), 5000);
    setTimeout(() => updatePrices('Seafood', true), 10000);
  }, 30 * 60 * 1000);

  // Every 6 hours: update all categories
  setInterval(() => updatePrices(null, false), 6 * 60 * 60 * 1000);

  console.log('   📅 Schedule: Vegetables/Fruits/Seafood every 30min | All categories every 6h');
};

module.exports = { updatePrices, startScheduler };