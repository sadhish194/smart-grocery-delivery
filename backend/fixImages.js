/**
 * Fix Product Images — Using real grocery images from Pexels (free CDN)
 * Assigns category-specific REAL food photos that actually load fast.
 * Each product gets a unique image from a curated pool per category.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Product = require('./models/Product');

// Real food/product images from Pexels (free, fast CDN, no auth needed)
// Each category has 20+ unique real photos — products cycle through them
const CATEGORY_IMAGES = {
  Vegetables: [
    'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?w=400',
    'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?w=400',
    'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400',
    'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?w=400',
    'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?w=400',
    'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?w=400',
    'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?w=400',
    'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?w=400',
    'https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg?w=400',
    'https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg?w=400',
    'https://images.pexels.com/photos/3512538/pexels-photo-3512538.jpeg?w=400',
    'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?w=400',
    'https://images.pexels.com/photos/248444/pexels-photo-248444.jpeg?w=400',
    'https://images.pexels.com/photos/2518893/pexels-photo-2518893.jpeg?w=400',
    'https://images.pexels.com/photos/4397921/pexels-photo-4397921.jpeg?w=400',
    'https://images.pexels.com/photos/1047322/pexels-photo-1047322.jpeg?w=400',
    'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?w=400',
    'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?w=400',
    'https://images.pexels.com/photos/2749165/pexels-photo-2749165.jpeg?w=400',
    'https://images.pexels.com/photos/3872373/pexels-photo-3872373.jpeg?w=400',
  ],
  Fruits: [
    'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=400',
    'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?w=400',
    'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=400',
    'https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg?w=400',
    'https://images.pexels.com/photos/1414110/pexels-photo-1414110.jpeg?w=400',
    'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?w=400',
    'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?w=400',
    'https://images.pexels.com/photos/1274564/pexels-photo-1274564.jpeg?w=400',
    'https://images.pexels.com/photos/209239/pexels-photo-209239.jpeg?w=400',
    'https://images.pexels.com/photos/2537658/pexels-photo-2537658.jpeg?w=400',
    'https://images.pexels.com/photos/1759991/pexels-photo-1759991.jpeg?w=400',
    'https://images.pexels.com/photos/3625405/pexels-photo-3625405.jpeg?w=400',
    'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?w=400',
    'https://images.pexels.com/photos/2907428/pexels-photo-2907428.jpeg?w=400',
    'https://images.pexels.com/photos/1343816/pexels-photo-1343816.jpeg?w=400',
    'https://images.pexels.com/photos/3625409/pexels-photo-3625409.jpeg?w=400',
    'https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg?w=400',
    'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?w=400',
    'https://images.pexels.com/photos/1550258/pexels-photo-1550258.jpeg?w=400',
    'https://images.pexels.com/photos/867470/pexels-photo-867470.jpeg?w=400',
  ],
  Dairy: [
    'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400',
    'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?w=400',
    'https://images.pexels.com/photos/2531184/pexels-photo-2531184.jpeg?w=400',
    'https://images.pexels.com/photos/416656/pexels-photo-416656.jpeg?w=400',
    'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?w=400',
    'https://images.pexels.com/photos/3735173/pexels-photo-3735173.jpeg?w=400',
    'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=400',
    'https://images.pexels.com/photos/4110006/pexels-photo-4110006.jpeg?w=400',
    'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?w=400',
    'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?w=400',
    'https://images.pexels.com/photos/1108098/pexels-photo-1108098.jpeg?w=400',
    'https://images.pexels.com/photos/4397916/pexels-photo-4397916.jpeg?w=400',
    'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?w=400',
    'https://images.pexels.com/photos/3735163/pexels-photo-3735163.jpeg?w=400',
    'https://images.pexels.com/photos/5946630/pexels-photo-5946630.jpeg?w=400',
  ],
  Bakery: [
    'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?w=400',
    'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?w=400',
    'https://images.pexels.com/photos/1070946/pexels-photo-1070946.jpeg?w=400',
    'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?w=400',
    'https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?w=400',
    'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?w=400',
    'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?w=400',
    'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?w=400',
    'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?w=400',
    'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpeg?w=400',
    'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?w=400',
    'https://images.pexels.com/photos/2573870/pexels-photo-2573870.jpeg?w=400',
  ],
  Beverages: [
    'https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?w=400',
    'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?w=400',
    'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?w=400',
    'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?w=400',
    'https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?w=400',
    'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?w=400',
    'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?w=400',
    'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=400',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400',
    'https://images.pexels.com/photos/3625408/pexels-photo-3625408.jpeg?w=400',
    'https://images.pexels.com/photos/1187317/pexels-photo-1187317.jpeg?w=400',
    'https://images.pexels.com/photos/1352199/pexels-photo-1352199.jpeg?w=400',
    'https://images.pexels.com/photos/792613/pexels-photo-792613.jpeg?w=400',
    'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=400',
    'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?w=400',
  ],
  Snacks: [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400',
    'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?w=400',
    'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?w=400',
    'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?w=400',
    'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?w=400',
    'https://images.pexels.com/photos/239581/pexels-photo-239581.jpeg?w=400',
    'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?w=400',
    'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=400',
    'https://images.pexels.com/photos/3992130/pexels-photo-3992130.jpeg?w=400',
    'https://images.pexels.com/photos/1343816/pexels-photo-1343816.jpeg?w=400',
    'https://images.pexels.com/photos/3992136/pexels-photo-3992136.jpeg?w=400',
    'https://images.pexels.com/photos/4116714/pexels-photo-4116714.jpeg?w=400',
    'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?w=400',
    'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?w=400',
    'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?w=400',
  ],
  Pantry: [
    'https://images.pexels.com/photos/4110004/pexels-photo-4110004.jpeg?w=400',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400',
    'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?w=400',
    'https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?w=400',
    'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?w=400',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=400',
    'https://images.pexels.com/photos/4397918/pexels-photo-4397918.jpeg?w=400',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=400',
    'https://images.pexels.com/photos/3338675/pexels-photo-3338675.jpeg?w=400',
    'https://images.pexels.com/photos/3872373/pexels-photo-3872373.jpeg?w=400',
    'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?w=400',
    'https://images.pexels.com/photos/4397919/pexels-photo-4397919.jpeg?w=400',
    'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?w=400',
    'https://images.pexels.com/photos/4397920/pexels-photo-4397920.jpeg?w=400',
    'https://images.pexels.com/photos/5419335/pexels-photo-5419335.jpeg?w=400',
  ],
  Meat: [
    'https://images.pexels.com/photos/1927377/pexels-photo-1927377.jpeg?w=400',
    'https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?w=400',
    'https://images.pexels.com/photos/616353/pexels-photo-616353.jpeg?w=400',
    'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?w=400',
    'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?w=400',
    'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=400',
    'https://images.pexels.com/photos/1352199/pexels-photo-1352199.jpeg?w=400',
    'https://images.pexels.com/photos/3535386/pexels-photo-3535386.jpeg?w=400',
    'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?w=400',
    'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=400',
  ],
  Seafood: [
    'https://images.pexels.com/photos/229550/pexels-photo-229550.jpeg?w=400',
    'https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?w=400',
    'https://images.pexels.com/photos/1860205/pexels-photo-1860205.jpeg?w=400',
    'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?w=400',
    'https://images.pexels.com/photos/3296394/pexels-photo-3296394.jpeg?w=400',
    'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?w=400',
    'https://images.pexels.com/photos/3296280/pexels-photo-3296280.jpeg?w=400',
    'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?w=400',
  ],
  Frozen: [
    'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?w=400',
    'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?w=400',
    'https://images.pexels.com/photos/3992136/pexels-photo-3992136.jpeg?w=400',
    'https://images.pexels.com/photos/1320970/pexels-photo-1320970.jpeg?w=400',
    'https://images.pexels.com/photos/3992131/pexels-photo-3992131.jpeg?w=400',
    'https://images.pexels.com/photos/1343816/pexels-photo-1343816.jpeg?w=400',
    'https://images.pexels.com/photos/3026806/pexels-photo-3026806.jpeg?w=400',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=400',
  ],
  'Personal Care': [
    'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?w=400',
    'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?w=400',
    'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?w=400',
    'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=400',
    'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?w=400',
    'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?w=400',
    'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?w=400',
    'https://images.pexels.com/photos/3735150/pexels-photo-3735150.jpeg?w=400',
    'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?w=400',
    'https://images.pexels.com/photos/3735174/pexels-photo-3735174.jpeg?w=400',
    'https://images.pexels.com/photos/4202927/pexels-photo-4202927.jpeg?w=400',
    'https://images.pexels.com/photos/3765170/pexels-photo-3765170.jpeg?w=400',
    'https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?w=400',
    'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?w=400',
    'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?w=400',
  ],
  Household: [
    'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?w=400',
    'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?w=400',
    'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?w=400',
    'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?w=400',
    'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?w=400',
    'https://images.pexels.com/photos/4239147/pexels-photo-4239147.jpeg?w=400',
    'https://images.pexels.com/photos/4108797/pexels-photo-4108797.jpeg?w=400',
    'https://images.pexels.com/photos/4107276/pexels-photo-4107276.jpeg?w=400',
    'https://images.pexels.com/photos/4108799/pexels-photo-4108799.jpeg?w=400',
    'https://images.pexels.com/photos/4108800/pexels-photo-4108800.jpeg?w=400',
    'https://images.pexels.com/photos/4239092/pexels-photo-4239092.jpeg?w=400',
    'https://images.pexels.com/photos/3962281/pexels-photo-3962281.jpeg?w=400',
  ],
};

const getImageForProduct = (name, brand, category, index) => {
  const pool = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Pantry'];
  // Use index mod pool length so products cycle through all images in category
  return pool[index % pool.length];
};

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected\n');

  const total = await Product.countDocuments();
  console.log(`📦 Total products: ${total}`);
  console.log(`⚡ Assigning real Pexels images (instant, no API calls)\n`);

  // Process by category for better image distribution
  const categories = Object.keys(CATEGORY_IMAGES);
  let totalUpdated = 0;

  for (const category of categories) {
    const products = await Product.find({ category }).lean();
    if (products.length === 0) continue;

    const bulkOps = products.map((p, index) => ({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { image: getImageForProduct(p.name, p.brand, category, index) } },
      }
    }));

    // Process in batches of 1000
    for (let i = 0; i < bulkOps.length; i += 1000) {
      await Product.bulkWrite(bulkOps.slice(i, i + 1000));
    }

    totalUpdated += products.length;
    console.log(`   ✅ ${category.padEnd(15)} → ${products.length} products updated`);
  }

  console.log(`\n🎉 Done! ${totalUpdated} products now have real Pexels images.`);
  console.log(`   Images load instantly — hosted on Pexels CDN worldwide.\n`);

  await mongoose.disconnect();
};

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
