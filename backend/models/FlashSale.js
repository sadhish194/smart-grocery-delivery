const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  discount:    { type: Number, required: true, min: 1, max: 90 }, // percentage
  startTime:   { type: Date, required: true },
  endTime:     { type: Date, required: true },
  categories:  [{ type: String }], // apply to these categories
  products:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // or specific products
  isActive:    { type: Boolean, default: true },
  maxUses:     { type: Number, default: 0 }, // 0 = unlimited
  usedCount:   { type: Number, default: 0 },
  bannerColor: { type: String, default: '#6e3dff' },
}, { timestamps: true });

module.exports = mongoose.model('FlashSale', flashSaleSchema);