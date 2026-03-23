// const Product = require('../models/Product');
// const Review = require('../models/Review');

// // @desc Get all products with filtering/search/pagination
// // @route GET /api/products
// const getProducts = async (req, res) => {
//   try {
//     const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
//     const query = { isActive: true };

//     if (keyword) query.name = { $regex: keyword, $options: 'i' };
//     if (category) query.category = category;
//     if (minPrice || maxPrice) {
//       query.price = {};
//       if (minPrice) query.price.$gte = Number(minPrice);
//       if (maxPrice) query.price.$lte = Number(maxPrice);
//     }

//     const sortOptions = {
//       'price-asc': { price: 1 },
//       'price-desc': { price: -1 },
//       'rating': { rating: -1 },
//       'newest': { createdAt: -1 },
//     };
//     const sortBy = sortOptions[sort] || { createdAt: -1 };

//     const count = await Product.countDocuments(query);
//     const products = await Product.find(query)
//       .sort(sortBy)
//       .limit(Number(limit))
//       .skip((Number(page) - 1) * Number(limit));

//     res.json({ products, page: Number(page), pages: Math.ceil(count / Number(limit)), total: count });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Get featured products
// // @route GET /api/products/featured
// const getFeaturedProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ isActive: true, isFeatured: true }).limit(8);
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Get single product
// // @route GET /api/products/:id
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });

//     const reviews = await Review.find({ product: product._id }).populate('user', 'name avatar').sort('-createdAt');
//     res.json({ ...product.toObject(), reviews });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Create product review
// // @route POST /api/products/:id/reviews
// const createReview = async (req, res) => {
//   try {
//     const { rating, comment } = req.body;
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     const alreadyReviewed = await Review.findOne({ user: req.user._id, product: product._id });
//     if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

//     const review = await Review.create({ user: req.user._id, product: product._id, rating: Number(rating), comment });

//     // Update product rating
//     const reviews = await Review.find({ product: product._id });
//     product.numReviews = reviews.length;
//     product.rating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
//     await product.save();

//     res.status(201).json({ message: 'Review added', review });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Admin: Create product
// // @route POST /api/products
// const createProduct = async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Admin: Update product
// // @route PUT /api/products/:id
// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Admin: Delete product (soft delete)
// // @route DELETE /api/products/:id
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.json({ message: 'Product removed' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getProducts, getFeaturedProducts, getProductById, createReview, createProduct, updateProduct, deleteProduct };


const Product   = require('../models/Product');
const Review    = require('../models/Review');
const FlashSale = require('../models/FlashSale');

// Helper: get active flash sale discount for a category/product
const getActiveSaleDiscount = async (category, productId) => {
  try {
    const now = new Date();
    const sale = await FlashSale.findOne({
      isActive: true,
      startTime: { $lte: now },
      endTime:   { $gte: now },
      $or: [
        { categories: category },
        { products: productId },
        { categories: [], products: [] }, // applies to all
      ],
    }).sort('endTime').lean();
    return sale ? { discount: sale.discount, saleId: sale._id, saleTitle: sale.title, saleEndTime: sale.endTime } : null;
  } catch { return null; }
};

// Apply flash sale to a product object
const applyFlashSale = (product, saleInfo) => {
  if (!saleInfo) return product;
  const salePrice = Math.round(product.price * (1 - saleInfo.discount / 100) * 100) / 100;
  return {
    ...product,
    originalPrice: product.originalPrice > 0 ? product.originalPrice : product.price,
    price: salePrice,
    flashSale: {
      active:    true,
      discount:  saleInfo.discount,
      saleId:    saleInfo.saleId,
      title:     saleInfo.saleTitle,
      endTime:   saleInfo.saleEndTime,
    },
  };
};

// @desc Get all products with flash sale prices applied
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (keyword)  query.name     = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
      'rating':     { rating: -1 },
      'newest':     { createdAt: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const count    = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortBy)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    // Get active flash sales once (not per product)
    const now = new Date();
    const activeSales = await FlashSale.find({
      isActive: true,
      startTime: { $lte: now },
      endTime:   { $gte: now },
    }).lean();

    // Apply flash sale discount to matching products
    const enriched = products.map(product => {
      const sale = activeSales.find(s =>
        s.categories.includes(product.category) ||
        s.products.map(id => id.toString()).includes(product._id.toString()) ||
        (s.categories.length === 0 && s.products.length === 0)
      );
      if (!sale) return product;
      const salePrice = Math.round(product.price * (1 - sale.discount / 100) * 100) / 100;
      return {
        ...product,
        originalPrice: product.originalPrice > 0 ? product.originalPrice : product.price,
        price: salePrice,
        flashSale: {
          active:   true,
          discount: sale.discount,
          saleId:   sale._id,
          title:    sale.title,
          endTime:  sale.endTime,
        },
      };
    });

    res.json({ products: enriched, page: Number(page), pages: Math.ceil(count / Number(limit)), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get featured products (with flash sale)
// @route GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true }).limit(8).lean();
    const now = new Date();
    const activeSales = await FlashSale.find({ isActive: true, startTime: { $lte: now }, endTime: { $gte: now } }).lean();

    const enriched = products.map(product => {
      const sale = activeSales.find(s =>
        s.categories.includes(product.category) ||
        s.products.map(id => id.toString()).includes(product._id.toString())
      );
      if (!sale) return product;
      return {
        ...product,
        originalPrice: product.originalPrice > 0 ? product.originalPrice : product.price,
        price: Math.round(product.price * (1 - sale.discount / 100) * 100) / 100,
        flashSale: { active: true, discount: sale.discount, endTime: sale.endTime },
      };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single product (with flash sale)
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviews = await Review.find({ product: product._id }).populate('user', 'name avatar').sort('-createdAt');

    // Check flash sale
    const now = new Date();
    const sale = await FlashSale.findOne({
      isActive: true,
      startTime: { $lte: now },
      endTime:   { $gte: now },
      $or: [
        { categories: product.category },
        { products: product._id },
      ],
    }).lean();

    let enriched = { ...product, reviews };
    if (sale) {
      enriched.originalPrice = product.originalPrice > 0 ? product.originalPrice : product.price;
      enriched.price = Math.round(product.price * (1 - sale.discount / 100) * 100) / 100;
      enriched.flashSale = { active: true, discount: sale.discount, title: sale.title, endTime: sale.endTime };
    }

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create product review
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: product._id });
    if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });
    const review = await Review.create({ user: req.user._id, product: product._id, rating: Number(rating), comment });
    const reviews = await Review.find({ product: product._id });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getProducts, getFeaturedProducts, getProductById, createReview, createProduct, updateProduct, deleteProduct };