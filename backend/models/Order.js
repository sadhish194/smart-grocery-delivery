// const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//   name: { type: String, required: true },
//   image: { type: String },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true, min: 1 },
// });

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: [orderItemSchema],
//   totalPrice: { type: Number, required: true },
//   deliveryCharge: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },
//   couponCode: { type: String, default: '' },
//   address: {
//     street: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     zipCode: { type: String, required: true },
//     phone: { type: String, required: true },
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['UPI', 'Card', 'COD', 'NetBanking'],
//     default: 'COD',
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['Pending', 'Paid', 'Failed'],
//     default: 'Pending',
//   },
//   orderStatus: {
//     type: String,
//     enum: ['Pending', 'Assigned', 'Accepted', 'OutForDelivery', 'Delivered', 'Cancelled'],
//     default: 'Pending',
//   },
//   deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//   statusHistory: [
//     {
//       status: String,
//       timestamp: { type: Date, default: Date.now },
//       note: String,
//     },
//   ],
//   estimatedDelivery: { type: Date },
//   deliveredAt: { type: Date },
//   notes: { type: String, default: '' },
// }, { timestamps: true });

// // Auto-push status changes to history
// orderSchema.pre('save', function (next) {
//   if (this.isModified('orderStatus')) {
//     this.statusHistory.push({ status: this.orderStatus, timestamp: new Date() });
//     if (this.orderStatus === 'Delivered') {
//       this.deliveredAt = new Date();
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('Order', orderSchema);


const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Card', 'COD', 'NetBanking', 'Wallet'],
    default: 'COD',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  stripePaymentIntentId: { type: String, default: '' },
  razorpayOrderId:       { type: String, default: '' },
  razorpayPaymentId:     { type: String, default: '' },
  razorpaySignature:     { type: String, default: '' },
  paidAt:                { type: Date, default: null },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Assigned', 'Accepted', 'OutForDelivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
    },
  ],
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  notes: { type: String, default: '' },
}, { timestamps: true });

// Auto-push status changes to history
orderSchema.pre('save', function (next) {
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({ status: this.orderStatus, timestamp: new Date() });
    if (this.orderStatus === 'Delivered') {
      this.deliveredAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);