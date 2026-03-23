const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  products:    [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, default: 1 } }],
  discount:    { type: Number, required: true, min: 1, max: 80 }, // % off total
  image:       { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },
}, { timestamps: true });

// Virtual: calculate bundle price
bundleSchema.virtual('totalPrice').get(function () { return 0; });

module.exports = mongoose.model('Bundle', bundleSchema);