/**
 * BigBasket CSV Importer (chinmayshanbhag dataset)
 * Columns: ProductName, Brand, Price, DiscountPrice, Image_Url, Quantity, Category, SubCategory
 *
 * Usage:
 *   node importBigBasket.js "BigBasket.csv"
 *   node importBigBasket.js "BigBasket.csv" --clear   ← wipe existing products first
 */

// const mongoose = require('mongoose');
// const fs = require('fs');
// const dotenv = require('dotenv');
// dotenv.config();
// const Product = require('./models/Product');

// const FILE  = process.argv[2];
// const CLEAR = process.argv.includes('--clear');

// if (!FILE) { console.error('Usage: node importBigBasket.js "BigBasket.csv"'); process.exit(1); }
// if (!fs.existsSync(FILE)) { console.error(`File not found: ${FILE}`); process.exit(1); }

// // ── Map BigBasket categories → our schema ─────────────────────────────────────
// const CAT_MAP = {
//   'Fruits & Vegetables':     (sub) => {
//     const s = sub.toLowerCase();
//     if (s.includes('fruit') || s.includes('dry fruit') || s.includes('dates')) return 'Fruits';
//     return 'Vegetables';
//   },
//   'Bakery, Cakes & Dairy':   (sub) => {
//     const s = sub.toLowerCase();
//     if (s.includes('milk') || s.includes('curd') || s.includes('paneer') || s.includes('cheese') || s.includes('butter') || s.includes('egg')) return 'Dairy';
//     return 'Bakery';
//   },
//   'Eggs, Meat & Fish':       (sub) => {
//     const s = sub.toLowerCase();
//     if (s.includes('fish') || s.includes('prawn') || s.includes('seafood')) return 'Seafood';
//     return 'Meat';
//   },
//   'Beverages':               () => 'Beverages',
//   'Snacks & Branded Foods':  () => 'Snacks',
//   'Foodgrains, Oil & Masala':() => 'Pantry',
//   'Gourmet & World Food':    () => 'Pantry',
//   'Cleaning & Household':    () => 'Household',
//   'Beauty & Hygiene':        () => 'Personal Care',
//   'Baby Care':               () => 'Personal Care',
//   'Kitchen, Garden & Pets':  () => 'Household',
// };

// const mapCategory = (category, subCategory) => {
//   const fn = CAT_MAP[category.trim()];
//   if (fn) return fn(subCategory || '');
//   return 'Pantry';
// };

// // ── Proper CSV parser (handles quoted fields with commas) ─────────────────────
// const parseCSV = (content) => {
//   const rows = [];
//   const lines = content.split('\n');
//   const headers = [];
//   let headerParsed = false;

//   for (const line of lines) {
//     if (!line.trim()) continue;
//     const fields = [];
//     let cur = '', inQ = false;
//     for (let i = 0; i < line.length; i++) {
//       const ch = line[i];
//       if (ch === '"') { inQ = !inQ; continue; }
//       if (ch === ',' && !inQ) { fields.push(cur.trim()); cur = ''; continue; }
//       cur += ch;
//     }
//     fields.push(cur.trim());

//     if (!headerParsed) {
//       headers.push(...fields);
//       headerParsed = true;
//       continue;
//     }
//     const obj = {};
//     headers.forEach((h, i) => obj[h] = (fields[i] || '').trim());
//     rows.push(obj);
//   }
//   return rows;
// };

// // ── Main ──────────────────────────────────────────────────────────────────────
// const main = async () => {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log('✅ MongoDB connected\n');

//   if (CLEAR) {
//     await Product.deleteMany({});
//     console.log('🗑️  Cleared all existing products\n');
//   }

//   const content = fs.readFileSync(FILE, 'utf-8');
//   const rows = parseCSV(content);
//   console.log(`📋 Found ${rows.length} products in CSV`);
//   console.log(`🖼️  All have real BigBasket image URLs\n`);

//   // Category preview
//   const catCount = {};
//   rows.forEach(r => {
//     const cat = mapCategory(r.Category || '', r.SubCategory || '');
//     catCount[cat] = (catCount[cat] || 0) + 1;
//   });
//   console.log('📊 Category breakdown:');
//   Object.entries(catCount).sort((a,b) => b[1]-a[1]).forEach(([c,n]) => {
//     console.log(`   ${c.padEnd(18)} ${n}`);
//   });

//   console.log('\n💾 Importing...\n');

//   const bulkOps = [];
//   let skipped = 0;

//   for (const row of rows) {
//     const name = (row.ProductName || '').trim();
//     if (!name) { skipped++; continue; }

//     const price        = parseFloat(row.DiscountPrice || row.Price || '0') || 10;
//     const originalPrice = parseFloat(row.Price || '0') || 0;
//     const category     = mapCategory(row.Category || '', row.SubCategory || '');
//     const image        = (row.Image_Url || '').trim();
//     const brand        = (row.Brand || '').trim();
//     const unit         = (row.Quantity || '').trim();
//     const discount     = originalPrice > price
//       ? Math.min(80, Math.round((1 - price / originalPrice) * 100)) : 0;

//     bulkOps.push({
//       insertOne: {
//         document: {
//           name,
//           brand,
//           price:         Math.round(price * 100) / 100,
//           originalPrice: Math.round(originalPrice * 100) / 100,
//           category,
//           description:   `${brand ? brand + ' — ' : ''}${name}${unit ? ' (' + unit + ')' : ''}. Fresh and quality-checked, delivered to your doorstep.`,
//           stock:         Math.floor(Math.random() * 150) + 20,
//           image,
//           unit,
//           isOrganic:     /organic|natural/i.test(name + brand),
//           isFeatured:    false,
//           discount,
//           rating:        parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
//           numReviews:    Math.floor(Math.random() * 200) + 5,
//           isActive:      true,
//         }
//       }
//     });
//   }

//   // Execute in batches of 500
//   let saved = 0;
//   for (let i = 0; i < bulkOps.length; i += 500) {
//     const result = await Product.bulkWrite(bulkOps.slice(i, i + 500));
//     saved += result.insertedCount;
//     const pct = Math.round(Math.min(i + 500, bulkOps.length) / bulkOps.length * 100);
//     process.stdout.write(`\r   Progress: ${Math.min(i+500, bulkOps.length)}/${bulkOps.length} (${pct}%)`);
//   }

//   console.log(`\n\n✅ Import complete!`);
//   console.log(`   ✔ Saved:   ${saved} new products`);
//   console.log(`   ⏭ Skipped: ${bulkOps.length - saved} (already existed)`);
//   console.log(`   ✖ Blank:   ${skipped} (empty rows)`);
//   console.log(`\n🎉 ${saved} real BigBasket products with images added to your store!\n`);

//   await mongoose.disconnect();
// };

// main().catch(err => { console.error('\n❌', err.message); process.exit(1); });


/**
 * BigBasket CSV Importer — uses exact CSV category names
 * Usage: node importBigBasket.js "BigBasket.csv"
 */

const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const Product = require('./models/Product');

const FILE = process.argv[2];
if (!FILE) { console.error('Usage: node importBigBasket.js "BigBasket.csv"'); process.exit(1); }
if (!fs.existsSync(FILE)) { console.error(`File not found: ${FILE}`); process.exit(1); }

const VALID_CATS = new Set([
  'Fruits & Vegetables', 'Bakery, Cakes & Dairy', 'Beverages',
  'Beauty & Hygiene', 'Cleaning & Household', 'Eggs, Meat & Fish',
  'Foodgrains, Oil & Masala', 'Gourmet & World Food',
  'Kitchen, Garden & Pets', 'Snacks & Branded Foods', 'Baby Care',
]);

const mapCategory = (cat) => {
  const c = (cat || '').trim();
  return VALID_CATS.has(c) ? c : 'Gourmet & World Food';
};

const parseCSV = (content) => {
  const rows = [];
  const lines = content.split('\n');
  let headers = [], headerDone = false;
  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { fields.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    fields.push(cur.trim());
    if (!headerDone) { headers = fields; headerDone = true; continue; }
    const obj = {};
    headers.forEach((h, i) => obj[h] = (fields[i] || '').trim());
    rows.push(obj);
  }
  return rows;
};

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected\n');

  // Clear existing products
  const before = await Product.countDocuments();
  if (before > 0) {
    await Product.deleteMany({});
    console.log(`🗑️  Cleared ${before} existing products\n`);
  }

  const content = fs.readFileSync(FILE, 'utf-8');
  const rows = parseCSV(content);
  console.log(`📋 Found ${rows.length} products in CSV\n`);

  // Category count preview
  const catCount = {};
  rows.forEach(r => {
    const c = mapCategory(r.Category);
    catCount[c] = (catCount[c] || 0) + 1;
  });
  console.log('📊 Category breakdown:');
  Object.entries(catCount).sort((a,b) => b[1]-a[1]).forEach(([c,n]) => {
    console.log(`   ${c.padEnd(28)} ${n}`);
  });
  console.log();

  const bulkOps = [];
  let skipped = 0;

  for (const row of rows) {
    const name = (row.ProductName || '').trim();
    if (!name) { skipped++; continue; }

    const price         = parseFloat(row.DiscountPrice || row.Price || '0') || 10;
    const originalPrice = parseFloat(row.Price || '0') || 0;
    const category      = mapCategory(row.Category);
    const image         = (row.Image_Url || '').trim();
    const brand         = (row.Brand || '').trim();
    const unit          = (row.Quantity || '').trim();
    const discount      = originalPrice > price
      ? Math.min(80, Math.round((1 - price / originalPrice) * 100)) : 0;

    bulkOps.push({
      insertOne: {
        document: {
          name,
          brand,
          price:         Math.round(price * 100) / 100,
          originalPrice: Math.round(originalPrice * 100) / 100,
          category,
          description:   `${brand ? brand + ' — ' : ''}${name}${unit ? ' (' + unit + ')' : ''}. Fresh and quality-checked, delivered to your doorstep.`,
          stock:         Math.floor(Math.random() * 150) + 20,
          image:         image.startsWith('http') ? image : '',
          unit,
          isOrganic:     /organic|natural/i.test(name + brand),
          isFeatured:    Math.random() < 0.1,
          discount,
          rating:        parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
          numReviews:    Math.floor(Math.random() * 200) + 5,
          isActive:      true,
        }
      }
    });
  }

  let saved = 0;
  for (let i = 0; i < bulkOps.length; i += 500) {
    const result = await Product.bulkWrite(bulkOps.slice(i, i + 500));
    saved += result.insertedCount;
    const pct = Math.round(Math.min(i + 500, bulkOps.length) / bulkOps.length * 100);
    process.stdout.write(`\r   💾 Progress: ${Math.min(i+500,bulkOps.length)}/${bulkOps.length} (${pct}%)`);
  }

  console.log(`\n\n✅ Import complete!`);
  console.log(`   ✔ Saved:   ${saved} products with real images`);
  console.log(`   ✖ Skipped: ${skipped} blank rows`);
  console.log(`\n🎉 Your store now has ${saved} real BigBasket products!\n`);

  await mongoose.disconnect();
};

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });