const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:       [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, default: 1 } }],
  frequency:   { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'], default: 'weekly' },
  deliveryDay: { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], default: 'Mon' },
  timeSlot:    { type: String, enum: ['6-9 AM','9-12 PM','12-3 PM','3-6 PM','6-9 PM'], default: '9-12 PM' },
  address:     { street: String, city: String, state: String, zipCode: String, phone: String },
  isActive:    { type: Boolean, default: true },
  nextDelivery:{ type: Date },
  lastDelivery:{ type: Date },
  totalOrders: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);