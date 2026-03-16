/**
 * Fix originalPrice = 0 in database
 * Run once: node fixOriginalPrice.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Product = require('./models/Product');

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected\n');

  // Set originalPrice to 0 where it equals price or is less than price (invalid)
  // This stops the strikethrough from showing
  const result = await Product.updateMany(
    { $or: [{ originalPrice: 0 }, { originalPrice: { $lte: 0 } }] },
    { $set: { originalPrice: 0 } } // ensure it's exactly 0, condition in UI handles hiding
  );
  console.log(`Fixed ${result.modifiedCount} products with invalid originalPrice`);

  // Also fix where originalPrice somehow equals price exactly (no real discount)
  const result2 = await Product.updateMany(
    { $expr: { $eq: ['$originalPrice', '$price'] } },
    [{ $set: { originalPrice: 0 } }]
  );
  console.log(`Fixed ${result2.modifiedCount} products where originalPrice === price`);

  console.log('\n✅ Done! Restart your frontend to see the fix.');
  await mongoose.disconnect();
};

main().catch(console.error);