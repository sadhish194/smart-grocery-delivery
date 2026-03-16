// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   price: { type: Number, required: true, min: 0 },
//   originalPrice: { type: Number, default: 0 },
//   category: {
//     type: String,
//     required: true,
//     enum: ['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Meat', 'Seafood', 'Beverages', 'Snacks', 'Frozen', 'Pantry', 'Personal Care', 'Household'],
//   },
//   description: { type: String, default: '' },
//   stock: { type: Number, required: true, default: 0, min: 0 },
//   image: { type: String, default: '' },
//   unit: { type: String, default: 'piece' },
//   brand: { type: String, default: '' },
//   isOrganic: { type: Boolean, default: false },
//   isFeatured: { type: Boolean, default: false },
//   discount: { type: Number, default: 0, min: 0, max: 100 },
//   rating: { type: Number, default: 0, min: 0, max: 5 },
//   numReviews: { type: Number, default: 0 },
//   isActive: { type: Boolean, default: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);

// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   price: { type: Number, required: true, min: 0 },
//   originalPrice: { type: Number, default: 0 },
//   category: {
//     type: String,
//     required: true,
//     enum: [
//       'Fruits & Vegetables',
//       'Bakery, Cakes & Dairy',
//       'Beverages',
//       'Beauty & Hygiene',
//       'Cleaning & Household',
//       'Eggs, Meat & Fish',
//       'Foodgrains, Oil & Masala',
//       'Gourmet & World Food',
//       'Kitchen, Garden & Pets',
//       'Snacks & Branded Foods',
//       'Baby Care',
//     ],
//   },
//   description: { type: String, default: '' },
//   stock: { type: Number, required: true, default: 0, min: 0 },
//   image: { type: String, default: '' },
//   unit: { type: String, default: 'piece' },
//   brand: { type: String, default: '' },
//   isOrganic: { type: Boolean, default: false },
//   isFeatured: { type: Boolean, default: false },
//   discount: { type: Number, default: 0, min: 0, max: 100 },
//   rating: { type: Number, default: 0, min: 0, max: 5 },
//   numReviews: { type: Number, default: 0 },
//   isActive: { type: Boolean, default: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  price:     { type: Number, required: true },
  reason:    { type: String, default: 'manual' },
  changedAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  basePrice:     { type: Number, default: 0 }, // anchor for dynamic pricing — never changes
  category: {
    type: String,
    required: true,
    enum: [
      'Fruits & Vegetables',
      'Bakery, Cakes & Dairy',
      'Beverages',
      'Beauty & Hygiene',
      'Cleaning & Household',
      'Eggs, Meat & Fish',
      'Foodgrains, Oil & Masala',
      'Gourmet & World Food',
      'Kitchen, Garden & Pets',
      'Snacks & Branded Foods',
      'Baby Care',
    ],
  },
  description:  { type: String, default: '' },
  stock:        { type: Number, required: true, default: 0, min: 0 },
  image:        { type: String, default: '' },
  unit:         { type: String, default: 'piece' },
  brand:        { type: String, default: '' },
  isOrganic:    { type: Boolean, default: false },
  isFeatured:   { type: Boolean, default: false },
  discount:     { type: Number, default: 0, min: 0, max: 100 },
  rating:       { type: Number, default: 0, min: 0, max: 5 },
  numReviews:   { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },

  // ── Dynamic Pricing ──────────────────────────────────────────────────────────
  dynamicPricingEnabled: { type: Boolean, default: true },
  priceHistory:          { type: [priceHistorySchema], default: [], select: false },
  lastPriceUpdate:       { type: Date, default: null },
  priceChangePercent:    { type: Number, default: 0 },
  demandScore:           { type: Number, default: 50, min: 0, max: 100 },
  viewCount:             { type: Number, default: 0 },
  addToCartCount:        { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ category: 1, dynamicPricingEnabled: 1 });
productSchema.index({ lastPriceUpdate: 1 });

module.exports = mongoose.model('Product', productSchema);