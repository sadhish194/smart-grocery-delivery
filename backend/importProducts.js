/**
 * BigBasket Kaggle Product Importer
 * ───────────────────────────────────
 * Optimized for: kaggle.com/datasets/surajjha101/bigbasket-entire-product-list-28k-datapoints
 *
 * CSV Columns: index, product, category, sub_category, brand, sale_price,
 *              market_price, type, rating, description, image
 *
 * Usage:
 *   node importProducts.js "BigBasket Products.csv"
 *   node importProducts.js "BigBasket Products.csv" --limit=1000
 *   node importProducts.js "BigBasket Products.csv" --dry-run
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

const args = process.argv.slice(2);
const FILE_PATH = args.find(a => !a.startsWith('--'));
const LIMIT     = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || Infinity;
const DRY_RUN   = args.includes('--dry-run');

if (!FILE_PATH) {
  console.error('\nUsage: node importProducts.js "BigBasket Products.csv"\n');
  process.exit(1);
}

// ── Map BigBasket categories → our schema categories ─────────────────────────
const CATEGORY_MAP = {
  // Fruits & Veggies
  'fresh vegetables':          'Vegetables',
  'exotic & seasonal vegetables': 'Vegetables',
  'herbs & seasonings':        'Vegetables',
  'fresh fruits':              'Fruits',
  'exotic & seasonal fruits':  'Fruits',
  'cuts & sprouts':            'Fruits',
  // Dairy
  'dairy':                     'Dairy',
  'milk':                      'Dairy',
  'curd, yoghurt & buttermilk':'Dairy',
  'paneer & tofu':             'Dairy',
  'cheese':                    'Dairy',
  'butter & margarine':        'Dairy',
  'eggs':                      'Dairy',
  'condensed milk & cream':    'Dairy',
  'bread & buns':              'Bakery',
  'cakes & pastries':          'Bakery',
  'bakery':                    'Bakery',
  // Meat
  'chicken':                   'Meat',
  'mutton':                    'Meat',
  'pork':                      'Meat',
  'beef & pork':               'Meat',
  // Seafood
  'fish':                      'Seafood',
  'prawns & shrimps':          'Seafood',
  'other sea food':            'Seafood',
  // Beverages
  'soft drinks & juices':      'Beverages',
  'water & soda':              'Beverages',
  'juice':                     'Beverages',
  'tea & coffee':              'Beverages',
  'energy & sports drinks':    'Beverages',
  'health drinks & supplements':'Beverages',
  // Snacks
  'chips & namkeen':           'Snacks',
  'biscuits':                  'Snacks',
  'cookies':                   'Snacks',
  'chocolates & candies':      'Snacks',
  'dry fruits, nuts & seeds':  'Snacks',
  'snacks & branded foods':    'Snacks',
  'snacks':                    'Snacks',
  // Pantry
  'rice & rice products':      'Pantry',
  'dals & pulses':             'Pantry',
  'edible oils & ghee':        'Pantry',
  'masalas & spices':          'Pantry',
  'atta, flours & sooji':      'Pantry',
  'sugar, jaggery & salt':     'Pantry',
  'sauces, jams & spreads':    'Pantry',
  'breakfast cereals':         'Pantry',
  'pasta, noodles & soups':    'Pantry',
  'gourmet & world food':      'Pantry',
  'foodgrains, oil & masala':  'Pantry',
  // Frozen
  'frozen non-veg snacks':     'Frozen',
  'frozen veg snacks':         'Frozen',
  'frozen desserts':           'Frozen',
  'ice cream & frozen desserts':'Frozen',
  // Personal Care
  'skin care':                 'Personal Care',
  'hair care':                 'Personal Care',
  'oral care':                 'Personal Care',
  'bath & body':               'Personal Care',
  'beauty & hygiene':          'Personal Care',
  'feminine hygiene':          'Personal Care',
  'health & medicine':         'Personal Care',
  // Household
  'cleaning & household':      'Household',
  'home & kitchen':            'Household',
  'laundry':                   'Household',
  'fresheners & repellents':   'Household',
  'bins & bathroom ware':      'Household',
  'kitchen accessories':       'Household',
  'pooja needs':               'Household',
  'stationery':                'Household',
  'pet care':                  'Household',
};

const mapCategory = (category = '', subCategory = '') => {
  const cat = category.toLowerCase().trim();
  const sub = subCategory.toLowerCase().trim();

  // Try sub_category first (more specific)
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (sub.includes(key) || key.includes(sub)) return val;
  }
  // Then try category
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (cat.includes(key) || key.includes(cat)) return val;
  }

  // Keyword fallbacks
  if (cat.includes('vegetable') || sub.includes('vegetable')) return 'Vegetables';
  if (cat.includes('fruit') || sub.includes('fruit')) return 'Fruits';
  if (cat.includes('dairy') || sub.includes('milk') || sub.includes('cheese')) return 'Dairy';
  if (cat.includes('meat') || sub.includes('chicken') || sub.includes('mutton')) return 'Meat';
  if (cat.includes('beverage') || sub.includes('juice') || sub.includes('drink')) return 'Beverages';
  if (cat.includes('snack') || sub.includes('chips') || sub.includes('biscuit')) return 'Snacks';
  if (cat.includes('frozen')) return 'Frozen';
  if (cat.includes('beauty') || cat.includes('personal')) return 'Personal Care';
  if (cat.includes('household') || cat.includes('cleaning')) return 'Household';

  return 'Pantry'; // default
};

// ── Parse CSV properly (handles quoted fields with commas) ────────────────────
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
};

const parseCSV = (content) => {
  const lines = content.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/"/g, '').trim());
  console.log('📋 Detected columns:', headers.join(', '));

  return lines.slice(1).map(line => {
    const vals = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (vals[i] || '').replace(/^"|"$/g, '').trim();
    });
    return obj;
  });
};

// ── Convert CSV row → Product document ───────────────────────────────────────
const rowToProduct = (row) => {
  // This dataset uses: product, category, sub_category, brand,
  //                    sale_price, market_price, type, rating, description, image
  const name = row.product || row.name || row.title || '';
  if (!name || name.length < 2) return null;

  const salePrice    = parseFloat(row.sale_price || row.price || '0');
  const marketPrice  = parseFloat(row.market_price || row.mrp || '0');
  const price        = salePrice > 0 ? salePrice : (marketPrice > 0 ? marketPrice * 0.85 : Math.floor(Math.random() * 200) + 20);
  const originalPrice = marketPrice > price ? marketPrice : 0;
  const category     = mapCategory(row.category || '', row.sub_category || '');
  const brand        = row.brand || row['brand name'] || '';
  const image        = row.image || row.img || row.image_url || '';
  const description  = row.description || row.about || `${brand ? brand + ' — ' : ''}${name}`;
  const rating       = parseFloat(row.rating || '0') || parseFloat((3.5 + Math.random() * 1.4).toFixed(1));
  const unit         = row.type || row.unit || row.pack_size || 'piece';
  const isOrganic    = /organic|natural|farm.?fresh/i.test(name + ' ' + brand);
  const discount     = originalPrice > 0 && price > 0 && originalPrice > price
    ? Math.min(80, Math.round((1 - price / originalPrice) * 100))
    : 0;

  return {
    name: name.slice(0, 200),
    price: Math.round(price * 100) / 100,
    originalPrice: Math.round(originalPrice * 100) / 100,
    category,
    description: description.slice(0, 500),
    stock: Math.floor(Math.random() * 150) + 20,
    image: image.startsWith('http') ? image : '',
    unit: unit.slice(0, 50),
    brand: brand.slice(0, 100),
    isOrganic,
    isFeatured: rating >= 4.5 && Math.random() < 0.3,
    discount,
    rating: Math.min(5, Math.max(0, rating)),
    numReviews: Math.floor(Math.random() * 300) + 10,
    isActive: true,
  };
};

// ── Main ──────────────────────────────────────────────────────────────────────
const main = async () => {
  if (!fs.existsSync(FILE_PATH)) {
    console.error(`\n❌ File not found: ${FILE_PATH}`);
    console.error('Make sure the CSV is in the backend/ folder\n');
    process.exit(1);
  }

  console.log(`\n📂 Reading: ${FILE_PATH}`);
  const content = fs.readFileSync(FILE_PATH, 'utf-8');
  const rows = parseCSV(content);
  const limited = rows.slice(0, LIMIT === Infinity ? rows.length : LIMIT);

  console.log(`📦 Total rows: ${rows.length}${LIMIT !== Infinity ? ` (importing first ${LIMIT})` : ''}`);

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN — showing first 10 products:\n');
    limited.slice(0, 10).forEach((row, i) => {
      const p = rowToProduct(row);
      if (p) console.log(`  ${i+1}. [${p.category}] ${p.name} — ₹${p.price} (${p.brand})`);
    });
    console.log('\n✅ Dry run done. Run without --dry-run to import to DB.');
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected\n');

  // Category preview
  const catCount = {};
  limited.forEach(row => {
    const p = rowToProduct(row);
    if (p) catCount[p.category] = (catCount[p.category] || 0) + 1;
  });
  console.log('📊 Category breakdown:');
  Object.entries(catCount).sort((a,b) => b[1]-a[1]).forEach(([cat, count]) => {
    console.log(`   ${cat.padEnd(20)} ${count} products`);
  });

  console.log('\n💾 Importing to MongoDB...\n');

  let saved = 0, skipped = 0, failed = 0;
  const BATCH = 100;

  for (let i = 0; i < limited.length; i++) {
    const product = rowToProduct(limited[i]);
    if (!product) { skipped++; continue; }

    try {
      // Use updateOne with upsert to avoid duplicates efficiently
      await Product.updateOne(
        { name: product.name },
        { $setOnInsert: product },
        { upsert: true }
      );
      saved++;
    } catch (err) {
      failed++;
      if (failed <= 3) console.warn(`  ⚠️  "${product?.name}": ${err.message}`);
    }

    // Progress every 500 rows
    if ((i + 1) % 500 === 0) {
      const pct = Math.round(((i + 1) / limited.length) * 100);
      process.stdout.write(`\r   Progress: ${i+1}/${limited.length} (${pct}%) — saved: ${saved}`);
    }
  }

  console.log(`\n\n✅ Import complete!`);
  console.log(`   ✔ Saved:   ${saved}`);
  console.log(`   ⏭ Skipped: ${skipped} (blank rows)`);
  console.log(`   ✖ Failed:  ${failed}`);
  console.log(`\n🎉 Your store now has ${saved} real BigBasket products!\n`);

  await mongoose.disconnect();
};

main().catch(err => { console.error('\n❌ Error:', err.message); process.exit(1); });

