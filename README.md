<div align="center">

# 🛒 Smart Grocery Delivery System

**A production-ready full-stack MERN grocery delivery platform**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat&logo=mongodb)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0D6EFD?style=flat)](https://razorpay.com/)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Setup](#-setup--installation) · [API Docs](#-api-endpoints) · [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 🛍️ Customer
- Browse **31,000+ real BigBasket products** with search, filters & sorting
- Product details with image gallery, accordions & customer reviews
- Cart & Wishlist management
- **Real-time order tracking** with live Leaflet map & rider location
- **Razorpay payments** — UPI, Card, NetBanking, Wallets & Cash on Delivery
- Coupon codes with live validation
- AI-powered chatbot (Genie) for instant support

### 🔧 Admin
- Analytics dashboard — revenue, orders, top products, monthly trends
- Product management — CRUD, stock, organic/featured flags
- Order management — assign delivery persons, cancel orders
- User management — activate/deactivate accounts
- Coupon management — percentage & flat discounts
- **Dynamic Pricing Engine** — auto-adjusts prices based on demand, stock, season & market data

### 🚴 Delivery Partner
- Personal dashboard with earnings, deliveries & weekly progress
- Live map showing active delivery with **Google Maps navigation**
- Order workflow — Accept → Start Delivery → Mark Delivered
- New order notifications with accept button

### 🤖 AI Chatbot (Genie)
- Powered by **Google Gemini** (free tier)
- Knows user's real order status, cart contents & available coupons
- Quick-action chips for common queries
- Embedded in Help page + floating bubble on all pages

### 📈 Dynamic Pricing
- Seasonal factors (monsoon, harvest seasons)
- Demand scoring (views + cart adds)
- Stock-based pricing (low stock = higher price)
- Exchange rate inflation proxy
- Time-of-day discounts (morning fresh, evening clearance)
- Auto-runs every 30 mins for volatile categories

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS 3, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **Payments** | Razorpay (UPI, Card, NetBanking, Wallets) |
| **Maps** | Leaflet.js + OpenStreetMap (free, no API key) |
| **AI Chatbot** | Google Gemini API (free tier) |
| **Geocoding** | Nominatim (OpenStreetMap, free) |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
smart-grocery/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── cartController.js
│   │   ├── adminController.js
│   │   └── deliveryController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js        ← includes dynamic pricing fields
│   │   ├── Order.js          ← includes Razorpay fields
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   ├── Review.js
│   │   └── Coupon.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── deliveryRoutes.js
│   │   ├── chatRoutes.js     ← Gemini AI proxy
│   │   ├── paymentRoutes.js  ← Razorpay
│   │   └── pricingRoutes.js  ← Dynamic pricing
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── dynamicPricing.js ← pricing algorithm
│   │   └── pricingScheduler.js
│   ├── seeder.js
│   ├── importProducts.js     ← BigBasket CSV importer
│   ├── fixImages.js          ← Pollinations.ai image fixer
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ProductCard.jsx
        │   ├── ChatBot.jsx
        │   ├── AdminSidebar.jsx
        │   ├── DeliverySidebar.jsx
        │   └── SharedComponents.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── pages/
        │   ├── customer/
        │   │   ├── Home.jsx
        │   │   ├── Products.jsx
        │   │   ├── ProductDetails.jsx
        │   │   ├── Cart.jsx
        │   │   ├── Checkout.jsx    ← Razorpay integration
        │   │   ├── Orders.jsx      ← Live map tracking
        │   │   ├── Profile.jsx
        │   │   ├── Help.jsx        ← AI chatbot embedded
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── ManageProducts.jsx
        │   │   ├── ManageOrders.jsx
        │   │   ├── ManageUsers.jsx
        │   │   ├── ManageCoupons.jsx
        │   │   └── DynamicPricing.jsx
        │   └── delivery/
        │       ├── DeliveryDashboard.jsx  ← mini map + new orders
        │       ├── DeliveryOrders.jsx
        │       └── DeliveryProfile.jsx
        ├── services/
        │   └── api.js
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/smart-grocery-delivery.git
cd smart-grocery-delivery
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/grocerydb
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development

# AI Chatbot — free at aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key

# Payments — free at razorpay.com
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

CLIENT_URL=http://localhost:5173
```

### 3. Install & Run Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Seed Demo Data

```bash
node seeder.js
```

### 5. Install & Run Frontend

```bash
cd ../frontend
npm install
npm run dev
```

App runs at **http://localhost:5173** 🎉

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | admin123 |
| Customer | customer@demo.com | cust123 |
| Delivery | delivery@demo.com | del123 |

---

## 🛍️ Import 31,000+ Real Products (Optional)

Download the **BigBasket Products dataset** from Kaggle:
> kaggle.com/datasets/surajjha101/bigbasket-entire-product-list-28k-datapoints

```bash
cd backend

# Place BigBasket Products.csv in backend/ folder, then:
node importProducts.js "BigBasket Products.csv"

# Fix missing product images (uses Pollinations AI — free)
node fixImages.js
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#6e3dff` (purple) |
| Secondary | `#22c55e` (green) |
| Background Light | `#f6f5f8` |
| Background Dark | `#140f23` |
| Font | Inter |
| Icons | Material Symbols Outlined |

---

## 💳 Payment Methods (via Razorpay)

| Method | Details |
|---|---|
| UPI | Google Pay, PhonePe, Paytm, BHIM |
| Card | Visa, Mastercard, RuPay, Amex |
| Net Banking | SBI, HDFC, ICICI, Axis & 50+ banks |
| Wallets | Paytm, Amazon Pay, Freecharge |
| Cash on Delivery | Pay on delivery |

**Test UPI:** `success@razorpay`
**Test Card:** `4111 1111 1111 1111` · Any future date · Any CVV

---

## 📦 Order Status Flow

```
Customer places order
       ↓
  [Pending]  ───────── Admin views & assigns
       ↓
  [Assigned] ───────── Delivery person sees order
       ↓
  [Accepted] ───────── Delivery person accepts
       ↓
[OutForDelivery] ───── En route with live map
       ↓
 [Delivered] ───────── Order complete ✅
```

---

## 📈 Dynamic Pricing Factors

| Factor | Effect |
|---|---|
| 🌧 Monsoon season | Vegetables +15% |
| 🥭 Mango season | Fruits −15% |
| 📦 Stock ≤ 5 units | +18% (scarcity) |
| 📦 Stock ≥ 200 units | −7% (clearance) |
| 🔥 High demand | Up to +20% |
| 💤 Low demand | Up to −15% |
| 🌅 Morning 6–9am | −3% fresh discount |
| 🌆 Evening 8–11pm | −6% clearance |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register user | — |
| POST | /api/auth/login | Login | — |
| GET | /api/auth/profile | Get profile | ✓ |
| PUT | /api/auth/profile | Update profile | ✓ |

### Products
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/products | All products (filter/search/sort/paginate) | — |
| GET | /api/products/featured | Featured products | — |
| GET | /api/products/:id | Single product + reviews | — |
| POST | /api/products/:id/reviews | Add review | Customer |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |

### Cart & Wishlist
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/cart | Get cart | Customer |
| POST | /api/cart | Add to cart | Customer |
| PUT | /api/cart/:productId | Update quantity | Customer |
| DELETE | /api/cart/:productId | Remove item | Customer |
| DELETE | /api/cart | Clear cart | Customer |
| GET | /api/cart/wishlist/all | Get wishlist | Customer |
| POST | /api/cart/wishlist/:productId | Toggle wishlist | Customer |

### Orders
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/orders | Create order (COD) | Customer |
| GET | /api/orders/my | My orders | Customer |
| GET | /api/orders/:id | Order details | ✓ |
| POST | /api/orders/coupon | Validate coupon | Customer |

### Payments (Razorpay)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/payment/config | Get Razorpay key | — |
| POST | /api/payment/create-order | Create payment order | Customer |
| POST | /api/payment/verify | Verify payment signature | Customer |
| POST | /api/payment/webhook | Razorpay webhook | — |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/admin/analytics | Dashboard stats | Admin |
| GET | /api/admin/orders | All orders | Admin |
| PUT | /api/admin/orders/:id/assign | Assign delivery person | Admin |
| PUT | /api/admin/orders/:id/cancel | Cancel order | Admin |
| GET | /api/admin/users | All users | Admin |
| PUT | /api/admin/users/:id/toggle | Toggle user status | Admin |
| GET | /api/admin/coupons | Get coupons | Admin |
| POST | /api/admin/coupons | Create coupon | Admin |

### Dynamic Pricing
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/pricing/status | Pricing overview | Admin |
| POST | /api/pricing/run | Trigger update | Admin |
| PUT | /api/pricing/toggle/:id | Toggle for product | Admin |
| PUT | /api/pricing/toggle-category | Toggle for category | Admin |

### Delivery
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/delivery/orders | Assigned orders | Delivery |
| GET | /api/delivery/completed | Completed deliveries | Delivery |
| GET | /api/delivery/stats | Personal stats | Delivery |
| PUT | /api/delivery/orders/:id/accept | Accept order | Delivery |
| PUT | /api/delivery/orders/:id/out-for-delivery | Start delivery | Delivery |
| PUT | /api/delivery/orders/:id/delivered | Mark delivered | Delivery |

### AI Chat
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/chat | Send message to Gemini | — |
| GET | /api/chat/models | List available models | — |

---

## 🏷️ Available Coupon Codes

| Code | Discount | Min Order |
|---|---|---|
| FRESH20 | 20% off (max ₹100) | ₹200 |
| SAVE50 | ₹50 flat off | ₹500 |
| NEWUSER | 15% off (max ₹75) | ₹100 |

---

## 📄 License

MIT License — feel free to use this project for learning or building your own grocery platform.

---

<div align="center">
Built with ❤️ using the MERN Stack
</div>
