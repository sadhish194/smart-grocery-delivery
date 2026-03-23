/**
 * Enrich all products already in MongoDB with real descriptions,
 * how-to-use instructions and storage info based on category.
 * No CSV needed — works directly from DB.
 * Run: node enrichProducts.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const Product = require('./models/Product');

// ── Descriptions by sub-keyword in product name ───────────────────────────
const NAME_KEYWORDS = [
  { words: ['shampoo','conditioner'],  desc: 'Cleanses and nourishes hair for a healthy, shiny look.' },
  { words: ['face wash','facewash'],   desc: 'Gentle face cleanser that removes dirt, oil and impurities.' },
  { words: ['moisturizer','lotion','cream'], desc: 'Deeply hydrates and nourishes skin for a soft, smooth feel.' },
  { words: ['sunscreen','spf'],        desc: 'Protects skin from harmful UV rays with broad spectrum coverage.' },
  { words: ['serum'],                  desc: 'Concentrated formula for targeted skin treatment and care.' },
  { words: ['deodorant','deo'],        desc: 'Long-lasting freshness with powerful odour protection.' },
  { words: ['perfume','eau de','edt','edp'], desc: 'Captivating fragrance crafted with premium aromatic ingredients.' },
  { words: ['lipstick','lip gloss','lip balm'], desc: 'Enriched lip formula for smooth, hydrated and beautiful lips.' },
  { words: ['kajal','eyeliner','mascara','eyeshadow'], desc: 'Precision eye product for enhanced look and long-lasting wear.' },
  { words: ['nail polish','nail colour'], desc: 'Vibrant, chip-resistant colour for beautiful nails.' },
  { words: ['protein','whey','supplement'], desc: 'High-quality nutritional supplement to support health and fitness goals.' },
  { words: ['vitamin','capsule','tablet'], desc: 'Essential nutritional supplement for daily health and wellness.' },
  { words: ['toilet cleaner','harpic','lysol'], desc: 'Powerful disinfectant formula that kills 99.9% germs for hygienic cleaning.' },
  { words: ['detergent','washing powder','surf','ariel'], desc: 'Effective formula to remove tough stains and keep clothes fresh.' },
  { words: ['dishwash','dish wash','vim','pril'], desc: 'Cuts through grease and grime for sparkling clean dishes.' },
  { words: ['floor cleaner','phenyl','lizol'], desc: 'Disinfectant cleaner that cleans and freshens floors.' },
  { words: ['container','box','dabba'],  desc: 'Durable, airtight container for safe and organised food storage.' },
  { words: ['bottle','water bottle'],    desc: 'BPA-free bottle designed for safe and hygienic hydration.' },
  { words: ['pan','kadai','tawa','cooker'], desc: 'Premium quality cookware for efficient and healthy cooking.' },
  { words: ['knife','peeler','grater'],  desc: 'Ergonomic kitchen tool for efficient and safe food preparation.' },
  { words: ['diaper','pampers'],         desc: 'Ultra-soft, high-absorbency diaper for all-day comfort and dryness.' },
  { words: ['baby oil','baby lotion','baby wash'], desc: 'Gentle, paediatrician-tested formula safe for delicate baby skin.' },
  { words: ['onion','potato','tomato','garlic'], desc: 'Farm-fresh vegetables sourced directly from local farms.' },
  { words: ['apple','banana','mango','orange','fruit'], desc: 'Naturally grown fresh fruit packed with vitamins and nutrients.' },
  { words: ['milk','paneer','curd','butter','ghee'], desc: 'Pure and fresh dairy product for everyday nutrition.' },
  { words: ['bread','bun','toast'],      desc: 'Freshly baked with quality ingredients for a wholesome taste.' },
  { words: ['chips','crisps','lays','kurkure'], desc: 'Crispy, flavourful snack perfect for any time of the day.' },
  { words: ['biscuit','cookie','parle','britannia'], desc: 'Delicious baked snack made with quality ingredients.' },
  { words: ['chocolate','kitkat','dairy milk'], desc: 'Indulgent chocolate treat crafted with premium cocoa.' },
  { words: ['rice','basmati'],           desc: 'Premium quality aromatic rice for perfect everyday meals.' },
  { words: ['dal','lentil','moong','masoor'], desc: 'High-protein pulses sourced from the finest farms.' },
  { words: ['oil','mustard oil','sunflower oil','olive oil'], desc: 'Pure cooking oil for healthy and delicious meals.' },
  { words: ['masala','spice','turmeric','cumin','coriander'], desc: 'Authentic spice blend to add rich flavour to every dish.' },
  { words: ['atta','flour','maida'],     desc: 'Finely milled flour for soft rotis, bread and baked goods.' },
  { words: ['juice','drink','beverage'], desc: 'Refreshing drink crafted from quality ingredients.' },
  { words: ['tea','chai'],               desc: 'Premium tea blend for a refreshing and aromatic cup.' },
  { words: ['coffee','nescafe','bru'],   desc: 'Rich, aromatic coffee for a perfect brew every time.' },
  { words: ['chicken','mutton','fish','prawn'], desc: 'Farm-fresh, hygienically packed protein-rich meat.' },
  { words: ['egg'],                      desc: 'Farm-fresh eggs rich in protein and essential nutrients.' },
  { words: ['pasta','noodle','maggi'],   desc: 'Quick-cooking pasta/noodles made with quality wheat flour.' },
  { words: ['sauce','ketchup','pickle'], desc: 'Flavourful condiment to enhance the taste of every meal.' },
];

// ── Category-based how-to-use ─────────────────────────────────────────────
const HOW_TO_USE = {
  'Beauty & Hygiene': [
    'Apply a small amount to the affected area',
    'Massage gently in circular motions until fully absorbed',
    'Use twice daily — morning and night — for best results',
    'Avoid direct contact with eyes; rinse immediately if contact occurs',
    'Patch test recommended for sensitive skin before full use',
  ],
  'Cleaning & Household': [
    'Dilute as per instructions on the label before use',
    'Apply to the surface and scrub with a brush or cloth',
    'Leave for 2-3 minutes for tough stains then rinse',
    'Rinse thoroughly with clean water after cleaning',
    'Wear gloves when using concentrated product',
  ],
  'Kitchen, Garden & Pets': [
    'Read the instruction leaflet before first use',
    'Wash with mild soap and water before first use',
    'Clean after each use and dry thoroughly before storing',
    'Do not use abrasive cleaners — use a soft cloth only',
    'Store in a dry place away from direct sunlight',
  ],
  'Baby Care': [
    'Use only as directed on the label for infants',
    'Apply gently — avoid contact with eyes and mouth',
    'Discontinue immediately if any irritation or rash occurs',
    'Consult a paediatrician before use on newborns under 3 months',
    'For external use only',
  ],
  'Fruits & Vegetables': [
    'Wash thoroughly under running water before use',
    'Peel or chop as required for your recipe',
    'Can be consumed raw, steamed, boiled or cooked',
    'Refrigerate cut vegetables in an airtight container',
    'Best consumed fresh for maximum nutrients',
  ],
  'Bakery, Cakes & Dairy': [
    'Consume directly or as part of your recipe',
    'Refrigerate immediately after opening',
    'Check expiry date before consumption',
    'Do not consume if the seal is broken upon delivery',
  ],
  'Beverages': [
    'Shake well before opening if required',
    'Serve chilled for the best taste',
    'Once opened, refrigerate and consume within 1-2 days',
    'Do not add to boiling water directly',
  ],
  'Snacks & Branded Foods': [
    'Open the pack and serve immediately for best freshness',
    'Best enjoyed at room temperature',
    'Once opened, transfer to an airtight container',
    'Do not consume if the pack is damaged or swollen',
  ],
  'Foodgrains, Oil & Masala': [
    'Wash before cooking as required',
    'Use a dry, clean spoon each time to prevent moisture',
    'Add to cooking as per your recipe requirement',
    'Store unused portion in an airtight container',
  ],
  'Eggs, Meat & Fish': [
    'Wash hands thoroughly before and after handling',
    'Cook thoroughly to a safe internal temperature',
    'Do not consume raw unless specified as safe',
    'Marinate in the refrigerator — never at room temperature',
  ],
  'Gourmet & World Food': [
    'Follow the preparation instructions on the packaging',
    'Best served fresh after preparation',
    'Refrigerate any leftovers in an airtight container',
    'Pair with appropriate accompaniments for best taste',
  ],
};

// ── Category-based storage info ───────────────────────────────────────────
const STORAGE = {
  'Beauty & Hygiene': [
    'Store in a cool, dry place away from direct sunlight',
    'Keep the cap tightly closed when not in use',
    'Do not store above 30°C or in humid conditions',
    'Keep away from children',
    'Do not use after the expiry date printed on the pack',
  ],
  'Cleaning & Household': [
    'Store in original container with lid tightly sealed',
    'Keep away from food, beverages and children',
    'Store away from heat sources and direct sunlight',
    'Do not store above 45°C',
    'In case of spillage, clean immediately with water',
  ],
  'Kitchen, Garden & Pets': [
    'Store in a clean, dry place at room temperature',
    'Keep away from sharp objects that may cause damage',
    'Do not expose to extreme heat or direct sunlight',
    'Ensure fully dry before storing to prevent rusting',
  ],
  'Baby Care': [
    'Store at room temperature between 15–30°C',
    'Keep away from direct sunlight and moisture',
    'Seal tightly after each use',
    'Store out of reach of children',
  ],
  'Fruits & Vegetables': [
    'Refrigerate at 4–8°C for best freshness',
    'Best consumed within 5–7 days of delivery',
    'Store away from strong-smelling foods in the fridge',
    'Do not store cut vegetables uncovered',
  ],
  'Bakery, Cakes & Dairy': [
    'Refrigerate immediately — do not leave at room temperature',
    'Consume by the date printed on the packaging',
    'Do not freeze unless clearly indicated on the pack',
    'Keep away from direct sunlight',
  ],
  'Beverages': [
    'Store in a cool, dry place before opening',
    'Refrigerate after opening and consume within 24–48 hours',
    'Best served chilled at 4–6°C',
    'Do not expose to direct sunlight',
  ],
  'Snacks & Branded Foods': [
    'Store in a cool, dry place away from sunlight',
    'Best before date is printed on the package',
    'Once opened, store in an airtight container',
    'Avoid storing near strong odours',
  ],
  'Foodgrains, Oil & Masala': [
    'Store in an airtight container after opening',
    'Keep in a cool, dry, dark place',
    'Always use a dry spoon to prevent moisture entry',
    'Check the best before date before consuming',
  ],
  'Eggs, Meat & Fish': [
    'Refrigerate immediately at 0–4°C upon delivery',
    'Consume within 1–2 days for maximum freshness',
    'Keep wrapped and away from other foods in the fridge',
    'Do not refreeze once thawed',
  ],
  'Gourmet & World Food': [
    'Store in a cool, dry place away from sunlight',
    'Refrigerate after opening and use within recommended time',
    'Check best before date before consumption',
    'Keep container tightly sealed after use',
  ],
};

const getDescription = (name, brand, category) => {
  const lower = (name + ' ' + (brand || '')).toLowerCase();
  for (const { words, desc } of NAME_KEYWORDS) {
    if (words.some(w => lower.includes(w))) {
      return brand ? `${brand} ${name} — ${desc}` : `${name} — ${desc}`;
    }
  }
  // Generic fallback
  const generic = {
    'Beauty & Hygiene':         'A trusted beauty & personal care product for daily use.',
    'Cleaning & Household':     'Effective household solution for a spotless, hygienic home.',
    'Kitchen, Garden & Pets':   'Quality kitchen & home essential for everyday convenience.',
    'Baby Care':                'Safe and gentle product specially formulated for babies.',
    'Fruits & Vegetables':      'Farm-fresh, naturally grown produce delivered to your doorstep.',
    'Bakery, Cakes & Dairy':    'Fresh and wholesome dairy & bakery product.',
    'Beverages':                'Refreshing beverage for every occasion.',
    'Snacks & Branded Foods':   'Delicious snack made with quality ingredients.',
    'Foodgrains, Oil & Masala': 'Premium quality staple ingredient for your kitchen.',
    'Eggs, Meat & Fish':        'Fresh, hygienically packed protein-rich food.',
    'Gourmet & World Food':     'Premium gourmet product for an elevated culinary experience.',
  };
  const g = generic[category] || 'Quality product for everyday use.';
  return brand ? `${brand} ${name} — ${g}` : `${name} — ${g}`;
};

const main = async () => {
  console.log('✅ Connected to MongoDB\n');
  const total = await Product.countDocuments({});
  console.log(`📦 Total products: ${total}\n`);

  const products = await Product.find({}).select('_id name brand category description howToUse storage').lean();
  const bulkOps = [];

  for (const p of products) {
    // Skip if already enriched
    if (p.description && p.description.length > 30 && p.howToUse?.length > 0) continue;

    const description = getDescription(p.name, p.brand, p.category);
    const howToUse    = HOW_TO_USE[p.category]  || HOW_TO_USE['Beauty & Hygiene'];
    const storage     = STORAGE[p.category]      || STORAGE['Foodgrains, Oil & Masala'];

    bulkOps.push({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { description, howToUse, storage } },
      }
    });
  }

  console.log(`📝 Products to enrich: ${bulkOps.length}`);
  if (bulkOps.length === 0) {
    console.log('✅ All products already enriched!');
    await mongoose.disconnect(); return;
  }

  for (let i = 0; i < bulkOps.length; i += 1000) {
    await Product.bulkWrite(bulkOps.slice(i, i + 1000));
    const done = Math.min(i + 1000, bulkOps.length);
    process.stdout.write(`\r  Progress: ${done}/${bulkOps.length} (${Math.round(done/bulkOps.length*100)}%)`);
  }

  console.log(`\n\n✅ Done! ${bulkOps.length} products enriched with:`);
  console.log('   ✓ Smart descriptions based on product name keywords');
  console.log('   ✓ How-to-use instructions by category');
  console.log('   ✓ Storage & shelf life info by category');
  await mongoose.disconnect();
};

main().catch(err => { console.error('❌', err.message); process.exit(1); });