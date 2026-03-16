// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/cart', require('./routes/cartRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/delivery', require('./routes/deliveryRoutes'));

// app.get('/', (req, res) => res.json({ message: 'Smart Grocery API Running' }));

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/cart', require('./routes/cartRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/delivery', require('./routes/deliveryRoutes'));
// app.use('/api/chat', require('./routes/chatRoutes'));

// app.get('/', (req, res) => res.json({ message: 'Smart Grocery API Running' }));

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/cart', require('./routes/cartRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/delivery', require('./routes/deliveryRoutes'));
// app.use('/api/chat', require('./routes/chatRoutes'));
// app.use('/api/pricing', require('./routes/pricingRoutes'));

// app.get('/', (req, res) => res.json({ message: 'Smart Grocery API Running' }));

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   // Start dynamic pricing scheduler
//   const { startScheduler } = require('./utils/pricingScheduler');
//   startScheduler();
// });

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// Stripe webhook needs raw body — must be before express.json()
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/cart',     require('./routes/cartRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/chat',     require('./routes/chatRoutes'));
app.use('/api/pricing',  require('./routes/pricingRoutes'));
app.use('/api/payment',  require('./routes/paymentRoutes'));

app.get('/', (req, res) => res.json({ message: 'Smart Grocery API Running' }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start dynamic pricing scheduler
  const { startScheduler } = require('./utils/pricingScheduler');
  startScheduler();
});