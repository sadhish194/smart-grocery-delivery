/**
 * Smart Grocery — Algorithm Engine
 * ─────────────────────────────────
 * 1. Product Recommendation Engine
 * 2. Smart Search Ranking
 * 3. Cart Abandonment Predictor
 * 4. Inventory Forecasting
 * 5. Delivery Route Optimizer
 * 6. Smart Coupon Targeting
 */

const Order  = require('../models/Order');
const Product = require('../models/Product');
const Cart   = require('../models/Cart');
const User   = require('../models/User');
const Coupon = require('../models/Coupon');

// ═══════════════════════════════════════════════════════════════════════════
// 1. PRODUCT RECOMMENDATION ENGINE
// Uses collaborative filtering + content-based signals
// ═══════════════════════════════════════════════════════════════════════════
const getRecommendations = async (userId, productId = null, limit = 8) => {
  try {
    const scores = {};

    // Signal 1: Co-purchase (users who bought X also bought Y)
    if (productId) {
      const ordersWithProduct = await Order.find({
        'items.product': productId,
        paymentStatus: 'Paid',
      }).select('items').limit(200).lean();

      for (const order of ordersWithProduct) {
        for (const item of order.items) {
          const id = item.product?.toString();
          if (id && id !== productId.toString()) {
            scores[id] = (scores[id] || 0) + 3; // high weight
          }
        }
      }
    }

    // Signal 2: User's own purchase history (same categories)
    if (userId) {
      const userOrders = await Order.find({ user: userId, paymentStatus: 'Paid' })
        .select('items').sort('-createdAt').limit(10).lean();

      const boughtIds = new Set();
      const boughtCategories = {};

      for (const order of userOrders) {
        for (const item of order.items) {
          boughtIds.add(item.product?.toString());
          boughtCategories[item.product?.toString()] = true;
        }
      }

      // Boost products in same categories the user likes
      if (boughtIds.size > 0) {
        const boughtProducts = await Product.find({
          _id: { $in: [...boughtIds] }
        }).select('category').lean();

        const likedCategories = [...new Set(boughtProducts.map(p => p.category))];

        const similarProducts = await Product.find({
          category: { $in: likedCategories },
          _id: { $nin: [...boughtIds] },
          isActive: true,
          stock: { $gt: 0 },
        }).select('_id rating numReviews').limit(100).lean();

        for (const p of similarProducts) {
          const id = p._id.toString();
          scores[id] = (scores[id] || 0) + 1 + (p.rating * 0.5);
        }
      }
    }

    // Signal 3: Trending products (most ordered in last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const trending = await Order.aggregate([
      { $match: { createdAt: { $gte: weekAgo }, paymentStatus: 'Paid' } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    for (const t of trending) {
      const id = t._id?.toString();
      if (id) scores[id] = (scores[id] || 0) + Math.log(t.count + 1);
    }

    // Sort by score, fetch top products
    const topIds = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit * 2)
      .map(([id]) => id);

    if (topIds.length === 0) {
      // Fallback: return featured/top-rated products
      return await Product.find({ isActive: true, stock: { $gt: 0 } })
        .sort('-rating -numReviews').limit(limit).lean();
    }

    const products = await Product.find({
      _id: { $in: topIds },
      isActive: true,
      stock: { $gt: 0 },
    }).limit(limit).lean();

    // Re-sort by original score order
    return products.sort((a, b) => {
      return (scores[b._id.toString()] || 0) - (scores[a._id.toString()] || 0);
    });

  } catch (err) {
    console.error('Recommendation error:', err.message);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. SMART SEARCH RANKING
// Boosts results by: purchase frequency, rating, stock, personalization
// ═══════════════════════════════════════════════════════════════════════════
const rankSearchResults = async (products, userId = null, keyword = '') => {
  try {
    // Get purchase frequency for these products (last 30 days)
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const productIds = products.map(p => p._id);

    const purchaseFreq = await Order.aggregate([
      { $match: { createdAt: { $gte: monthAgo }, paymentStatus: 'Paid' } },
      { $unwind: '$items' },
      { $match: { 'items.product': { $in: productIds } } },
      { $group: { _id: '$items.product', count: { $sum: 1 } } },
    ]);

    const freqMap = {};
    for (const p of purchaseFreq) freqMap[p._id.toString()] = p.count;

    // User's previously bought products (personalization boost)
    const userBought = new Set();
    if (userId) {
      const orders = await Order.find({ user: userId }).select('items').limit(20).lean();
      for (const o of orders) for (const i of o.items) userBought.add(i.product?.toString());
    }

    // Score each product
    const scored = products.map(p => {
      const id = p._id.toString();
      let score = 0;

      // Purchase frequency (0-10)
      score += Math.min(10, (freqMap[id] || 0) * 0.5);

      // Rating boost (0-5)
      score += (p.rating || 0);

      // Stock availability boost
      if (p.stock > 50) score += 2;
      else if (p.stock > 10) score += 1;
      else if (p.stock <= 0) score -= 5;

      // Featured boost
      if (p.isFeatured) score += 3;

      // Personalization: user bought this before = boost
      if (userBought.has(id)) score += 4;

      // Exact name match boost
      if (keyword && p.name.toLowerCase().includes(keyword.toLowerCase())) score += 5;

      // Discount boost (on-sale products rank higher)
      if (p.discount > 0) score += Math.min(3, p.discount * 0.1);

      return { ...p, _score: score };
    });

    return scored.sort((a, b) => b._score - a._score);
  } catch (err) {
    console.error('Search ranking error:', err.message);
    return products;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. CART ABANDONMENT PREDICTOR
// Returns users who added to cart but haven't ordered in X hours
// ═══════════════════════════════════════════════════════════════════════════
const getAbandonedCarts = async (hoursThreshold = 2) => {
  try {
    const cutoff = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);

    // Find carts updated before cutoff with items
    const carts = await Cart.find({
      updatedAt: { $lte: cutoff },
      'items.0': { $exists: true },
    }).populate('user', 'name email phone').populate('items.product', 'name price image').lean();

    const abandoned = [];

    for (const cart of carts) {
      // Check if user placed an order after cart was last updated
      const recentOrder = await Order.findOne({
        user: cart.user?._id,
        createdAt: { $gte: cart.updatedAt },
      }).lean();

      if (!recentOrder) {
        const cartValue = cart.items.reduce(
          (sum, i) => sum + (i.product?.price || 0) * i.quantity, 0
        );
        abandoned.push({
          userId:    cart.user?._id,
          userName:  cart.user?.name,
          userEmail: cart.user?.email,
          cartValue: Math.round(cartValue),
          itemCount: cart.items.length,
          items:     cart.items.slice(0, 3),
          abandonedAt: cart.updatedAt,
          hoursAgo:  Math.round((Date.now() - new Date(cart.updatedAt)) / 3600000 * 10) / 10,
        });
      }
    }

    // Sort by cart value descending (high-value carts first)
    return abandoned.sort((a, b) => b.cartValue - a.cartValue);
  } catch (err) {
    console.error('Cart abandonment error:', err.message);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. INVENTORY FORECASTING
// Predicts days until stockout based on recent order velocity
// ═══════════════════════════════════════════════════════════════════════════
const forecastInventory = async (daysAhead = 7) => {
  try {
    const lookback = 14; // analyse last 14 days of sales
    const since = new Date(Date.now() - lookback * 24 * 60 * 60 * 1000);

    // Get sales velocity per product
    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, paymentStatus: 'Paid' } },
      { $unwind: '$items' },
      { $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        orderCount: { $sum: 1 },
      }},
      { $sort: { totalSold: -1 } },
    ]);

    const forecasts = [];

    for (const s of sales) {
      const product = await Product.findById(s._id).select('name category stock image price').lean();
      if (!product) continue;

      const dailyVelocity = s.totalSold / lookback;
      const daysUntilStockout = dailyVelocity > 0 ? product.stock / dailyVelocity : 999;
      const projectedStock = Math.max(0, product.stock - (dailyVelocity * daysAhead));
      const risk = daysUntilStockout <= 3 ? 'critical' :
                   daysUntilStockout <= 7 ? 'high' :
                   daysUntilStockout <= 14 ? 'medium' : 'low';

      if (risk !== 'low') {
        forecasts.push({
          product:          { _id: product._id, name: product.name, image: product.image, category: product.category, price: product.price },
          currentStock:     product.stock,
          dailyVelocity:    Math.round(dailyVelocity * 10) / 10,
          daysUntilStockout: Math.round(daysUntilStockout * 10) / 10,
          projectedStock:   Math.round(projectedStock),
          suggestedReorder: Math.ceil(dailyVelocity * 30), // 30-day supply
          risk,
        });
      }
    }

    return forecasts.sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
  } catch (err) {
    console.error('Inventory forecast error:', err.message);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 5. DELIVERY ROUTE OPTIMIZER
// Assigns orders to nearest delivery person using Haversine distance
// ═══════════════════════════════════════════════════════════════════════════

// Haversine formula — distance between two lat/lng points in km
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

// Geocode city name to approximate coordinates (Indian cities lookup)
const CITY_COORDS = {
  'chennai': [13.0827, 80.2707], 'mumbai': [19.0760, 72.8777],
  'delhi': [28.6139, 77.2090], 'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946], 'hyderabad': [17.3850, 78.4867],
  'pune': [18.5204, 73.8567], 'kolkata': [22.5726, 88.3639],
  'ahmedabad': [23.0225, 72.5714], 'jaipur': [26.9124, 75.7873],
  'surat': [21.1702, 72.8311], 'lucknow': [26.8467, 80.9462],
  'kanpur': [26.4499, 80.3319], 'nagpur': [21.1458, 79.0882],
  'indore': [22.7196, 75.8577], 'coimbatore': [11.0168, 76.9558],
  'puducherry': [11.9416, 79.8083], 'madurai': [9.9252, 78.1198],
  'default': [20.5937, 78.9629], // India center
};

const getCityCoords = (city = '') => {
  const key = city.toLowerCase().trim();
  return CITY_COORDS[key] || CITY_COORDS['default'];
};

const optimizeDeliveryRoutes = async (pendingOrders, deliveryPersons) => {
  try {
    if (!pendingOrders?.length || !deliveryPersons?.length) return [];

    const assignments = [];
    const personLoad = {};
    deliveryPersons.forEach(p => { personLoad[p._id.toString()] = 0; });

    for (const order of pendingOrders) {
      const [destLat, destLng] = getCityCoords(order.address?.city);

      let bestPerson = null;
      let bestScore  = Infinity;

      for (const person of deliveryPersons) {
        const [pLat, pLng] = getCityCoords(person.address?.city || 'default');
        const distance = haversine(pLat, pLng, destLat, destLng);
        const load     = personLoad[person._id.toString()] || 0;
        // Score = distance + penalty for already-loaded persons
        const score = distance + load * 2;

        if (score < bestScore) {
          bestScore  = score;
          bestPerson = person;
        }
      }

      if (bestPerson) {
        personLoad[bestPerson._id.toString()]++;
        assignments.push({
          orderId:        order._id,
          orderAddress:   order.address,
          customerName:   order.user?.name,
          deliveryPerson: { _id: bestPerson._id, name: bestPerson.name, phone: bestPerson.phone },
          estimatedDistanceKm: Math.round(bestScore * 10) / 10,
          estimatedMinutes:    Math.round(bestScore * 3 + 10), // ~3 min/km + 10 base
        });
      }
    }

    return assignments;
  } catch (err) {
    console.error('Route optimizer error:', err.message);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 6. SMART COUPON TARGETING
// Identifies who needs a coupon vs who doesn't (saves budget)
// ═══════════════════════════════════════════════════════════════════════════
const getSmartCouponTargets = async () => {
  try {
    const now = new Date();
    const users = await User.find({ role: 'customer', isActive: true }).lean();
    const targets = [];

    for (const user of users) {
      const orders = await Order.find({
        user: user._id,
        paymentStatus: 'Paid',
        createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) },
      }).sort('-createdAt').lean();

      if (orders.length === 0) {
        // Never ordered — strong acquisition target
        targets.push({
          userId:       user._id,
          userName:     user.name,
          userEmail:    user.email,
          segment:      'never_ordered',
          label:        'New User',
          reason:       'Never placed an order',
          suggestedDiscount: 20,
          suggestedCode: 'NEWUSER',
          priority:     'high',
        });
        continue;
      }

      const lastOrder     = orders[0];
      const daysSinceLast = (now - new Date(lastOrder.createdAt)) / (1000 * 60 * 60 * 24);
      const totalRevenue  = orders.reduce((s, o) => s + o.totalPrice, 0);
      const avgOrderValue = totalRevenue / orders.length;
      const orderFreq     = orders.length / 90; // orders per day

      // Segment logic
      if (daysSinceLast > 30 && orders.length >= 3) {
        // Was a good customer, now gone — win-back
        targets.push({
          userId: user._id, userName: user.name, userEmail: user.email,
          segment: 'churned',
          label: 'Win Back',
          reason: `Was active, last order ${Math.round(daysSinceLast)} days ago`,
          suggestedDiscount: 15,
          suggestedCode: 'COMEBACK15',
          priority: 'high',
          stats: { orders: orders.length, avgOrderValue: Math.round(avgOrderValue), daysSinceLast: Math.round(daysSinceLast) },
        });
      } else if (daysSinceLast > 14 && daysSinceLast <= 30) {
        // Drifting — nudge them back
        targets.push({
          userId: user._id, userName: user.name, userEmail: user.email,
          segment: 'at_risk',
          label: 'At Risk',
          reason: `No order in ${Math.round(daysSinceLast)} days`,
          suggestedDiscount: 10,
          suggestedCode: 'MISSYOU10',
          priority: 'medium',
          stats: { orders: orders.length, avgOrderValue: Math.round(avgOrderValue), daysSinceLast: Math.round(daysSinceLast) },
        });
      } else if (avgOrderValue < 300 && orders.length >= 2) {
        // Low spender — incentivise bigger basket
        targets.push({
          userId: user._id, userName: user.name, userEmail: user.email,
          segment: 'low_value',
          label: 'Upsell',
          reason: `Avg order ₹${Math.round(avgOrderValue)} — offer free delivery threshold`,
          suggestedDiscount: 0,
          suggestedCode: 'FREEDELIVERY',
          priority: 'low',
          stats: { orders: orders.length, avgOrderValue: Math.round(avgOrderValue), daysSinceLast: Math.round(daysSinceLast) },
        });
      }
      // Loyal + recent = no coupon needed (save budget)
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return targets.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } catch (err) {
    console.error('Coupon targeting error:', err.message);
    return [];
  }
};

module.exports = {
  getRecommendations,
  rankSearchResults,
  getAbandonedCarts,
  forecastInventory,
  optimizeDeliveryRoutes,
  getSmartCouponTargets,
};