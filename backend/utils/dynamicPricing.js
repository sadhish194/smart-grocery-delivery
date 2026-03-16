/**
 * Dynamic Pricing Engine
 * ──────────────────────
 * Adjusts product prices based on:
 *  1. Real commodity market data (via free APIs)
 *  2. Demand signals (views, add-to-cart, orders)
 *  3. Stock levels (low stock = price up)
 *  4. Time-of-day (morning fresh discount, evening clearance)
 *  5. Seasonal patterns (monsoon veggies cheaper, mango season etc.)
 *  6. Category-specific rules
 */

// ── Market data fetchers (free APIs, no key needed) ───────────────────────────

// Commodity prices from commodities-api.com (free tier) / fallback to simulation
const fetchCommodityPrices = async () => {
  try {
    // Try Open Exchange Rates for general inflation index
    const res = await fetch(
      'https://api.exchangerate-api.com/v4/latest/INR',
      { signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const data = await res.json();
      // Use USD/INR rate as proxy for inflation pressure
      const usdRate = data.rates?.USD || 0.012;
      const baseRate = 0.012; // baseline USD/INR ~83
      const inflationFactor = baseRate / usdRate; // >1 means rupee weakened
      return { inflationFactor, source: 'exchange-rate' };
    }
  } catch (_) {}
  return { inflationFactor: 1.0, source: 'fallback' };
};

// Weather impact on vegetable/fruit prices (simulated based on month + season)
const getSeasonalFactor = (category) => {
  const month = new Date().getMonth(); // 0=Jan, 11=Dec
  const hour  = new Date().getHours();

  const factors = {
    'Fruits & Vegetables': (() => {
      // Monsoon (Jun-Sep): flooding raises prices
      if (month >= 5 && month <= 8) return 1.15;
      // Winter (Nov-Feb): good harvest, lower prices
      if (month >= 10 || month <= 1) return 0.90;
      // Summer (Mar-May): heat stress, moderate rise
      return 1.05;
    })(),
    'Fruits & Vegetables': (() => {
      // Mango season (Apr-Jun): mangoes cheaper
      if (month >= 3 && month <= 5) return 0.85;
      // Winter fruits (Oct-Jan): apples, oranges cheaper
      if (month >= 9 || month <= 0) return 0.88;
      return 1.0;
    })(),
    'Bakery, Cakes & Dairy': (() => {
      // Summer: milk production drops, prices rise
      if (month >= 3 && month <= 5) return 1.08;
      return 1.0;
    })(),
  };

  // Time-of-day factor
  let timeFactor = 1.0;
  if (hour >= 6 && hour <= 9) timeFactor = 0.97;   // Morning: fresh discount
  if (hour >= 20 && hour <= 23) timeFactor = 0.94;  // Evening: clearance deals

  return (factors[category] || 1.0) * timeFactor;
};

// ── Demand-based pricing ──────────────────────────────────────────────────────
const getDemandFactor = (product) => {
  const score = product.demandScore || 50;
  // score 0-30: low demand → discount up to 15%
  // score 30-70: normal → no change
  // score 70-100: high demand → premium up to 20%
  if (score < 30) return 0.85 + (score / 30) * 0.15; // 0.85 → 1.00
  if (score > 70) return 1.0 + ((score - 70) / 30) * 0.20; // 1.00 → 1.20
  return 1.0;
};

// ── Stock-based pricing ───────────────────────────────────────────────────────
const getStockFactor = (stock) => {
  if (stock <= 0)  return 1.0;   // out of stock — no change
  if (stock <= 5)  return 1.18;  // critically low: +18%
  if (stock <= 15) return 1.10;  // low: +10%
  if (stock <= 30) return 1.05;  // moderate: +5%
  if (stock >= 200) return 0.93; // overstock: -7% to move inventory
  return 1.0;
};

// ── Category-specific price floors and ceilings ───────────────────────────────
const CATEGORY_RULES = {
  'Fruits & Vegetables':    { minFactor: 0.70, maxFactor: 1.50, volatility: 'high' },
  'Fruits & Vegetables':        { minFactor: 0.75, maxFactor: 1.40, volatility: 'high' },
  'Bakery, Cakes & Dairy':         { minFactor: 0.85, maxFactor: 1.20, volatility: 'low' },
  'Eggs, Meat & Fish':          { minFactor: 0.80, maxFactor: 1.30, volatility: 'medium' },
  'Eggs, Meat & Fish':       { minFactor: 0.75, maxFactor: 1.45, volatility: 'high' },
  'Beverages':     { minFactor: 0.90, maxFactor: 1.15, volatility: 'low' },
  'Snacks & Branded Foods':        { minFactor: 0.88, maxFactor: 1.12, volatility: 'low' },
  'Bakery, Cakes & Dairy':        { minFactor: 0.85, maxFactor: 1.20, volatility: 'medium' },
  'Snacks & Branded Foods':        { minFactor: 0.88, maxFactor: 1.15, volatility: 'low' },
  'Foodgrains, Oil & Masala':        { minFactor: 0.85, maxFactor: 1.20, volatility: 'low' },
  'Beauty & Hygiene': { minFactor: 0.92, maxFactor: 1.10, volatility: 'very-low' },
  'Cleaning & Household':     { minFactor: 0.92, maxFactor: 1.10, volatility: 'very-low' },
};

// ── Add small realistic random noise ─────────────────────────────────────────
const addMarketNoise = (category) => {
  const volatility = CATEGORY_RULES[category]?.volatility || 'low';
  const noiseRange = { 'very-low': 0.01, 'low': 0.02, 'medium': 0.04, 'high': 0.07 };
  const range = noiseRange[volatility] || 0.02;
  return 1.0 + (Math.random() * range * 2 - range); // ±range%
};

// ── Master pricing function ───────────────────────────────────────────────────
const calculateNewPrice = async (product, marketData) => {
  const basePrice = product.basePrice || product.price;
  const rules = CATEGORY_RULES[product.category] || { minFactor: 0.85, maxFactor: 1.20 };

  // Compose all factors
  const seasonal  = getSeasonalFactor(product.category);
  const demand    = getDemandFactor(product);
  const stock     = getStockFactor(product.stock);
  const inflation = marketData?.inflationFactor || 1.0;
  const noise     = addMarketNoise(product.category);

  // Combined factor
  let totalFactor = seasonal * demand * stock * inflation * noise;

  // Clamp within category rules
  totalFactor = Math.max(rules.minFactor, Math.min(rules.maxFactor, totalFactor));

  const newPrice = Math.round(basePrice * totalFactor * 100) / 100;
  const changePercent = Math.round(((newPrice - basePrice) / basePrice) * 1000) / 10;

  // Determine primary reason for price change
  let reason = 'market';
  if (stock <= 15)        reason = 'low-stock';
  else if (demand > 70)   reason = 'high-demand';
  else if (demand < 30)   reason = 'low-demand';
  else if (seasonal > 1.1) reason = 'seasonal-high';
  else if (seasonal < 0.9) reason = 'seasonal-low';

  return { newPrice, changePercent, reason, factors: { seasonal, demand, stock, inflation, noise } };
};

module.exports = { calculateNewPrice, fetchCommodityPrices, getSeasonalFactor, getDemandFactor };