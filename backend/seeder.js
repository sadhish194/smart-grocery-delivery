const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

const users = [
  { name: 'Admin User', email: 'admin@demo.com', password: 'admin123', role: 'admin', phone: '9876543210' },
  { name: 'John Customer', email: 'customer@demo.com', password: 'cust123', role: 'customer', phone: '9876543211' },
  { name: 'David Miller', email: 'delivery@demo.com', password: 'del123', role: 'delivery', phone: '9876543212' },
  { name: 'Sarah Jones', email: 'delivery2@demo.com', password: 'del123', role: 'delivery', phone: '9876543213' },
];

const products = [
  // Vegetables
  { name: 'Fresh Spinach', price: 29, originalPrice: 40, category: 'Vegetables', description: 'Crisp fresh spinach leaves, packed with iron and vitamins.', stock: 100, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', unit: '250g bunch', isOrganic: true, isFeatured: true, discount: 28 },
  { name: 'Tomatoes', price: 35, originalPrice: 45, category: 'Vegetables', description: 'Farm fresh ripe tomatoes perfect for salads and cooking.', stock: 150, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', unit: '500g', isFeatured: true },
  { name: 'Broccoli', price: 55, originalPrice: 70, category: 'Vegetables', description: 'Tender green broccoli florets, rich in nutrients.', stock: 80, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', unit: '500g', isOrganic: true },
  { name: 'Carrots', price: 25, category: 'Vegetables', description: 'Crunchy farm carrots, great for juicing and cooking.', stock: 200, image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400', unit: '500g', isFeatured: true },
  { name: 'Capsicum (Bell Pepper)', price: 60, originalPrice: 80, category: 'Vegetables', description: 'Colorful bell peppers, sweet and crunchy.', stock: 120, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', unit: '3 pieces', discount: 25 },
  { name: 'Onions', price: 40, category: 'Vegetables', description: 'Fresh red onions, a kitchen essential.', stock: 300, image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400', unit: '1 kg' },
  // Fruits
  { name: 'Alphonso Mangoes', price: 199, originalPrice: 249, category: 'Fruits', description: 'Premium Alphonso mangoes from Ratnagiri, sweet and juicy.', stock: 50, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', unit: '1 kg (4-5 pcs)', isFeatured: true, discount: 20 },
  { name: 'Strawberries', price: 120, originalPrice: 150, category: 'Fruits', description: 'Fresh strawberries, perfect for desserts and smoothies.', stock: 60, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', unit: '250g punnet', isOrganic: true },
  { name: 'Bananas', price: 45, category: 'Fruits', description: 'Ripe yellow bananas, energy packed.', stock: 200, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', unit: '6 pieces', isFeatured: true },
  { name: 'Watermelon', price: 89, category: 'Fruits', description: 'Sweet and refreshing watermelon, perfect for summer.', stock: 30, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', unit: '1 piece (~2kg)' },
  // Dairy
  { name: 'Full Cream Milk', price: 62, category: 'Dairy', description: 'Fresh full cream pasteurized milk from local farms.', stock: 100, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', unit: '1 Litre', isFeatured: true },
  { name: 'Cheddar Cheese', price: 180, originalPrice: 220, category: 'Dairy', description: 'Aged cheddar cheese with rich flavor.', stock: 40, image: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=400', unit: '200g block', discount: 18 },
  { name: 'Greek Yogurt', price: 75, category: 'Dairy', description: 'Thick and creamy Greek yogurt, high in protein.', stock: 80, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', unit: '400g tub', isOrganic: true, isFeatured: true },
  { name: 'Butter (Salted)', price: 55, category: 'Dairy', description: 'Creamy salted butter for cooking and baking.', stock: 90, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', unit: '100g pack' },
  // Bakery
  { name: 'Whole Wheat Bread', price: 45, category: 'Bakery', description: 'Freshly baked whole wheat bread, soft and nutritious.', stock: 60, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', unit: '400g loaf', isFeatured: true },
  { name: 'Croissants', price: 85, originalPrice: 110, category: 'Bakery', description: 'Buttery flaky croissants baked fresh every morning.', stock: 30, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', unit: 'Pack of 4', discount: 23 },
  // Snacks
  { name: 'Mixed Nuts', price: 299, originalPrice: 350, category: 'Snacks', description: 'Premium blend of cashews, almonds, pistachios and walnuts.', stock: 50, image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400', unit: '250g pack', isFeatured: true },
  { name: 'Potato Chips (Classic)', price: 35, category: 'Snacks', description: 'Crispy salted potato chips, perfect snack for any time.', stock: 150, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', unit: '75g pack' },
  // Beverages
  { name: 'Orange Juice (Fresh)', price: 89, originalPrice: 110, category: 'Beverages', description: 'Cold-pressed fresh orange juice, no added sugar.', stock: 40, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', unit: '500ml bottle', isOrganic: true, isFeatured: true },
  { name: 'Green Tea', price: 145, category: 'Beverages', description: 'Premium Darjeeling green tea with natural antioxidants.', stock: 70, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', unit: '25 tea bags' },
  // Pantry
  { name: 'Basmati Rice', price: 159, category: 'Pantry', description: 'Long grain aged basmati rice, aromatic and fluffy.', stock: 100, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', unit: '1 kg' },
  { name: 'Extra Virgin Olive Oil', price: 399, originalPrice: 450, category: 'Pantry', description: 'Cold-pressed extra virgin olive oil from Italy.', stock: 30, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', unit: '500ml bottle', isFeatured: true },
];

const coupons = [
  { code: 'FRESH20', discount: 20, discountType: 'percentage', minOrderAmount: 200, maxDiscount: 100, usageLimit: 500, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  { code: 'SAVE50', discount: 50, discountType: 'fixed', minOrderAmount: 500, usageLimit: 200, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
  { code: 'NEWUSER', discount: 15, discountType: 'percentage', minOrderAmount: 100, maxDiscount: 75, usageLimit: 1000, expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) },
];

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    console.log('Seeding users...');
    const createdUsers = await User.create(users);
    console.log(`✓ ${createdUsers.length} users created`);
    createdUsers.forEach(u => console.log(`  ${u.role}: ${u.email} / ${users.find(u2 => u2.email === u.email).password}`));

    console.log('Seeding products...');
    const createdProducts = await Product.create(products);
    console.log(`✓ ${createdProducts.length} products created`);

    console.log('Seeding coupons...');
    const createdCoupons = await Coupon.create(coupons);
    console.log(`✓ ${createdCoupons.length} coupons created`);
    createdCoupons.forEach(c => console.log(`  ${c.code}: ${c.discount}${c.discountType === 'percentage' ? '%' : '₹'} OFF`));

    console.log('\n✅ Seed complete!');
    console.log('\nDemo Login Credentials:');
    console.log('  Admin:    admin@demo.com    / admin123');
    console.log('  Customer: customer@demo.com / cust123');
    console.log('  Delivery: delivery@demo.com / del123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
