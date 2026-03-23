// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true, minlength: 6 },
//   phone: { type: String, default: '' },
//   address: {
//     street: { type: String, default: '' },
//     city: { type: String, default: '' },
//     state: { type: String, default: '' },
//     zipCode: { type: String, default: '' },
//   },
//   role: { type: String, enum: ['customer', 'admin', 'delivery'], default: 'customer' },
//   avatar: { type: String, default: '' },
//   isActive: { type: Boolean, default: true },
// }, { timestamps: true });

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// };

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone:    { type: String, default: '' },
  address: {
    street:  { type: String, default: '' },
    city:    { type: String, default: '' },
    state:   { type: String, default: '' },
    zipCode: { type: String, default: '' },
  },
  role:     { type: String, enum: ['customer', 'admin', 'delivery'], default: 'customer' },
  avatar:   { type: String, default: '' },
  isActive: { type: Boolean, default: true },

  // ── Loyalty Points ──────────────────────────────────────────────────────
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyTier:   { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
  totalEarned:   { type: Number, default: 0 }, // lifetime points earned

  // ── Referral System ─────────────────────────────────────────────────────
  referralCode:      { type: String, unique: true, sparse: true },
  referredBy:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralCount:     { type: Number, default: 0 },
  referralEarnings:  { type: Number, default: 0 },

  // ── Notifications ────────────────────────────────────────────────────────
  fcmToken:          { type: String, default: '' }, // for push notifications
  notifPreferences:  {
    orderUpdates:    { type: Boolean, default: true },
    promotions:      { type: Boolean, default: true },
    flashSales:      { type: Boolean, default: true },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Auto-generate referral code
userSchema.pre('save', function (next) {
  if (!this.referralCode && this.role === 'customer') {
    this.referralCode = 'REF' + this.name.replace(/\s+/g, '').toUpperCase().slice(0, 4) +
      Math.random().toString(36).slice(2, 6).toUpperCase();
  }
  // Update loyalty tier based on total earned
  if (this.totalEarned >= 5000)      this.loyaltyTier = 'Platinum';
  else if (this.totalEarned >= 2000) this.loyaltyTier = 'Gold';
  else if (this.totalEarned >= 500)  this.loyaltyTier = 'Silver';
  else                                this.loyaltyTier = 'Bronze';
  next();
});

userSchema.methods.matchPassword = async function (p) {
  return await bcrypt.compare(p, this.password);
};
userSchema.methods.toJSON = function () {
  const obj = this.toObject(); delete obj.password; return obj;
};

module.exports = mongoose.model('User', userSchema);