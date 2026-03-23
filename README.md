<div align="center">

# 🛒 Smart Grocery Delivery System

**A production-ready full-stack MERN grocery delivery platform**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat&logo=mongodb)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0D6EFD?style=flat)](https://razorpay.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat&logo=socket.io)](https://socket.io/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat&logo=google)](https://aistudio.google.com/)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Setup](#-setup--installation) · [API Docs](#-api-endpoints)

</div>

---

## ✨ Features

### 🛍️ Customer
- Browse **8,000+ real BigBasket products** with search, filters & sorting
- **3-slide hero carousel** with auto-play and dot navigation
- **Blinkit-style category grid** with product images
- Product details with image gallery, smart accordions & customer reviews
- Category-aware tabs — food shows Ingredients/Nutrition, non-food shows How to Use/Storage
- Cart & Wishlist management
- **Real-time order tracking** with live Leaflet map & rider location
- **Razorpay payments** — UPI, Card, NetBanking, Wallets & Cash on Delivery
- Coupon codes with live validation
- **AI Chatbot (Genie)** — powered by Google Gemini
- **🎤 Voice Assistant** — search, navigate & add to cart by voice
- **⭐ Loyalty Points** — earn points on every order, Bronze/Silver/Gold/Platinum tiers
- **🎁 Referral System** — share code, friend gets ₹50, you get ₹100
- **🔄 Subscriptions** — recurring weekly/monthly deliveries
- **🔔 Real-time Notifications** — order updates via Socket.io

### 🔧 Admin
- **📊 Sales Analytics** — revenue charts, top products, category breakdown
- **⚡ Flash Sales** — create timed deals with live countdown timer on home page
- Product management — CRUD, stock, organic/featured flags
- Order management — assign delivery persons, cancel orders
- User management — activate/deactivate accounts
- Coupon management — percentage & flat discounts
- **Dynamic Pricing Engine** — auto-adjusts prices based on demand, stock, season & time
- **🧠 Smart Algorithms** — Inventory Forecast, Cart Abandonment, Route Optimizer, Coupon Targeting

### 🚴 Delivery Partner
- Personal dashboard with earnings, deliveries & weekly progress
- Live map showing active delivery with **Google Maps navigation**
- Order workflow — Accept → Start Delivery → Mark Delivered
- Real-time notifications for new assignments

### 🤖 AI Chatbot (Genie)
- Powered by **Google Gemini** (free tier)
- Knows user's real order status, cart contents & available coupons
- Quick-action chips for common queries
- Embedded in Help page + floating bubble on all pages

### 🎤 Voice Assistant
- **Web Speech API** — 100% free, built into Chrome
- Voice commands: "Search tomatoes", "Go to cart", "Track my order"
- **Add to cart by voice** — "Add onion to cart" → finds product → adds instantly
- **Talk to Genie AI** — ask anything, spoken answer via Text-to-Speech
- Waveform animation while listening, speaking indicator

### 📈 Dynamic Pricing
- Seasonal factors (monsoon, harvest seasons)
- Demand scoring (views + cart adds)
- Stock-based pricing (low stock = higher price)
- Time-of-day discounts (morning fresh, evening clearance)
- Auto-runs every 30 mins for volatile categories
- **Flash sale prices** applied server-side in real time

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS 3, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **Real-time** | Socket.io (notifications, live updates) |
| **Payments** | Razorpay (UPI, Card, NetBanking, Wallets) |
| **Maps** | Leaflet.js + OpenStreetMap (free, no API key) |
| **AI Chatbot** | Google Gemini API (free tier) |
| **Voice** | Web Speech API + SpeechSynthesis (free, built-in) |
| **Geocoding** | Nominatim (OpenStreetMap, free) |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
smart-grocery/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js   ← flash sale prices applied here
│   │   ├── orderController.js     ← loyalty points on order
│   │   ├── cartController.js
│   │   ├── adminController.js     ← notifications on assign/cancel
│   │   └── deliveryController.js  ← notifications on status change
│   ├── middleware/
│   ├── models/
│   │   ├── User.js           ← loyalty, referral, notification prefs
│   │   ├── Product.js        ← dynamic pricing + flash sale fields
│   │   ├── Order.js          ← Razorpay + loyalty fields
│   │   ├── Cart.js
│   │   ├── FlashSale.js      ← flash sale model
│   │   ├── Bundle.js
│   │   ├── Subscription.js
│   │   ├── Notification.js
│   │   ├── Review.js
│   │   └── Coupon.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── deliveryRoutes.js
│   │   ├── chatRoutes.js       ← Gemini AI proxy
│   │   ├── paymentRoutes.js    ← Razorpay
│   │   ├── pricingRoutes.js    ← Dynamic pricing
│   │   ├── algorithmRoutes.js  ← 6 smart algorithms
│   │   └── featuresRoutes.js   ← loyalty, referral, flash sales, subscriptions
│   ├── utils/
│   │   ├── algorithms.js       ← 6 AI algorithms
│   │   ├── dynamicPricing.js
│   │   └── pricingScheduler.js
│   ├── seeder.js
│   ├── importProducts.js
│   ├── enrichProducts.js       ← adds descriptions & how-to-use
│   └── server.js               ← Socket.io integrated
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ProductCard.jsx       ← flash sale badge + price
        │   ├── ChatBot.jsx
        │   ├── VoiceAssistant.jsx    ← voice commands + AI
        │   ├── NotificationBell.jsx  ← real-time bell
        │   ├── FlashSaleBanner.jsx   ← countdown timer
        │   ├── AdminSidebar.jsx
        │   ├── DeliverySidebar.jsx
        │   └── SharedComponents.jsx
        ├── pages/
        │   ├── customer/
        │   │   ├── Home.jsx          ← 3-slide hero, Blinkit categories
        │   │   ├── Products.jsx
        │   │   ├── ProductDetails.jsx ← smart accordions by category
        │   │   ├── Cart.jsx
        │   │   ├── Checkout.jsx      ← Razorpay
        │   │   ├── Orders.jsx        ← live map tracking
        │   │   ├── Loyalty.jsx       ← points & tiers
        │   │   ├── Referral.jsx
        │   │   ├── Subscriptions.jsx
        │   │   ├── Profile.jsx
        │   │   ├── Help.jsx
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── ManageProducts.jsx
        │   │   ├── ManageOrders.jsx
        │   │   ├── ManageUsers.jsx
        │   │   ├── ManageCoupons.jsx
        │   │   ├── DynamicPricing.jsx
        │   │   ├── Algorithms.jsx    ← inventory, cart, routes, coupons
        │   │   ├── Analytics.jsx     ← revenue charts
        │   │   └── FlashSales.jsx
        │   └── delivery/
        │       ├── DeliveryDashboard.jsx
        │       ├── DeliveryOrders.jsx
        │       └── DeliveryProfile.jsx
        └── App.jsx
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
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development

# AI Chatbot — free at aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key

# Payments — free account at razorpay.com
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
  [Pending]  ─── Admin assigns delivery person → 🔔 Customer notified
       ↓
  [Assigned] ─── Delivery person sees order
       ↓
  [Accepted] ─── Rider accepts → 🔔 Customer notified
       ↓
[OutForDelivery] ── En route with live map → 🔔 "On the way!"
       ↓
 [Delivered] ─── Order complete ✅ → 🔔 + ⭐ Loyalty points awarded
```

---

## ⭐ Loyalty Points System

| Tier | Points Required | Benefits |
|---|---|---|
| 🥉 Bronze | 0+ | 1 pt per ₹10 spent |
| 🥈 Silver | 500+ | 1.5x points, Free delivery on ₹300+ |
| 🥇 Gold | 2000+ | 2x points, Free delivery always |
| 💎 Platinum | 5000+ | 3x points, Exclusive deals, Dedicated support |

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

## 🧠 Smart Algorithms

| Algorithm | What it does |
|---|---|
| 🎯 Recommendations | Co-purchase + trending + personalized |
| 🔍 Smart Search | Ranked by purchase frequency, rating, personalization |
| 🛒 Cart Abandonment | Detects abandoned carts, shows lost revenue |
| 📦 Inventory Forecast | Predicts stockouts based on sales velocity |
| 🗺️ Route Optimizer | Assigns orders to nearest delivery person (Haversine) |
| 💡 Coupon Targeting | Segments churned/at-risk users for smart discounts |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile |
| PUT | /api/auth/profile | Update profile |

### Features
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/features/notifications | Get notifications |
| GET | /api/features/loyalty | Loyalty points & tier |
| GET | /api/features/referral | Referral code & stats |
| GET | /api/features/flash-sales | Active flash sales |
| GET | /api/features/subscriptions | My subscriptions |
| GET | /api/features/analytics | Admin sales analytics |

### Algorithms
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/algo/recommendations | Personalized recommendations |
| GET | /api/algo/inventory-forecast | Stock risk forecast |
| GET | /api/algo/abandoned-carts | Abandoned cart list |
| POST | /api/algo/optimize-routes | Delivery route optimizer |
| GET | /api/algo/coupon-targets | Smart coupon targeting |

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