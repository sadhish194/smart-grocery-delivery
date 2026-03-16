# 🛒 Smart Grocery Delivery System

A full-stack MERN application for grocery delivery with role-based dashboards for Customers, Admins, and Delivery Personnel.

---

## 🚀 Tech Stack

| Layer     | Tech                                     |
|-----------|------------------------------------------|
| Frontend  | React 18, React Router v6, Tailwind CSS  |
| Backend   | Node.js, Express.js                      |
| Database  | MongoDB + Mongoose                       |
| Auth      | JWT (JSON Web Tokens)                    |
| HTTP      | Axios                                    |

---

## 📁 Project Structure

```
smart-grocery/
├── backend/
│   ├── config/         db.js
│   ├── controllers/    auth, product, order, cart, admin, delivery
│   ├── middleware/     auth, role, error
│   ├── models/         User, Product, Order, Cart, Wishlist, Review, Coupon
│   ├── routes/         auth, products, orders, cart, admin, delivery
│   ├── utils/          generateToken.js
│   ├── seeder.js       (demo data seeder)
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/ Navbar, Footer, ProductCard, AdminSidebar, DeliverySidebar, SharedComponents
        ├── context/    AuthContext, CartContext
        ├── pages/
        │   ├── customer/   Home, Products, ProductDetails, Cart, Checkout, Orders, Profile, Login, Register
        │   ├── admin/      AdminDashboard, ManageProducts, ManageOrders, ManageUsers, ManageCoupons
        │   └── delivery/   DeliveryDashboard, DeliveryOrders, DeliveryProfile
        ├── services/   api.js
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Configure Backend

```bash
cd smart-grocery/backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/grocerydb
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

### 2. Install & Run Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Seed Demo Data (optional but recommended)

```bash
cd backend
node seeder.js
```

### 4. Install & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🔑 Demo Login Credentials

| Role     | Email                | Password |
|----------|----------------------|----------|
| Admin    | admin@demo.com       | admin123 |
| Customer | customer@demo.com    | cust123  |
| Delivery | delivery@demo.com    | del123   |

---

## 🎯 Feature Overview

### Customer
- Browse products by category, search, filter and sort
- Product details with reviews and ratings
- Cart management (add, update, remove)
- Wishlist
- Checkout with address, payment method selection
- Coupon code support
- Order tracking with live status timeline
- Profile management

### Admin
- Analytics dashboard (revenue, orders, top products)
- Product management (CRUD with image URL, stock, organic/featured flags)
- Order management (view all, assign delivery person, cancel)
- User management (view, activate/deactivate)
- Coupon management (create with percentage/fixed discount)

### Delivery Person
- Personal dashboard with delivery stats
- View assigned orders with customer address
- Step-by-step order workflow: Accept → Start Delivery → Mark Delivered
- Completed deliveries history

---

## 📦 Order Status Flow

```
Customer places order
        ↓
   [Pending] ← Admin views order
        ↓
   [Assigned] ← Admin assigns delivery person
        ↓
   [Accepted] ← Delivery person accepts
        ↓
[OutForDelivery] ← Delivery person starts delivery
        ↓
  [Delivered] ← Delivery person marks delivered
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint              | Description            | Auth |
|--------|-----------------------|------------------------|------|
| POST   | /api/auth/register    | Register user          | —    |
| POST   | /api/auth/login       | Login                  | —    |
| GET    | /api/auth/profile     | Get profile            | ✓    |
| PUT    | /api/auth/profile     | Update profile         | ✓    |

### Products
| Method | Endpoint                    | Description         | Auth   |
|--------|-----------------------------|---------------------|--------|
| GET    | /api/products               | Get all products    | —      |
| GET    | /api/products/featured      | Featured products   | —      |
| GET    | /api/products/:id           | Single product      | —      |
| POST   | /api/products/:id/reviews   | Add review          | Customer |
| POST   | /api/products               | Create product      | Admin  |
| PUT    | /api/products/:id           | Update product      | Admin  |
| DELETE | /api/products/:id           | Delete product      | Admin  |

### Cart
| Method | Endpoint                        | Description       | Auth     |
|--------|---------------------------------|-------------------|----------|
| GET    | /api/cart                       | Get cart          | Customer |
| POST   | /api/cart                       | Add to cart       | Customer |
| PUT    | /api/cart/:productId            | Update quantity   | Customer |
| DELETE | /api/cart/:productId            | Remove item       | Customer |
| DELETE | /api/cart                       | Clear cart        | Customer |
| GET    | /api/cart/wishlist/all          | Get wishlist      | Customer |
| POST   | /api/cart/wishlist/:productId   | Toggle wishlist   | Customer |

### Orders
| Method | Endpoint              | Description         | Auth     |
|--------|-----------------------|---------------------|----------|
| POST   | /api/orders           | Create order        | Customer |
| GET    | /api/orders/my        | My orders           | Customer |
| GET    | /api/orders/:id       | Order details       | ✓        |
| POST   | /api/orders/coupon    | Validate coupon     | Customer |

### Admin
| Method | Endpoint                          | Description            | Auth  |
|--------|-----------------------------------|------------------------|-------|
| GET    | /api/admin/analytics              | Dashboard stats        | Admin |
| GET    | /api/admin/orders                 | All orders             | Admin |
| PUT    | /api/admin/orders/:id/assign      | Assign delivery        | Admin |
| PUT    | /api/admin/orders/:id/cancel      | Cancel order           | Admin |
| GET    | /api/admin/users                  | All users              | Admin |
| PUT    | /api/admin/users/:id/toggle       | Toggle user status     | Admin |
| GET    | /api/admin/delivery-persons       | Get delivery persons   | Admin |
| GET    | /api/admin/coupons                | Get coupons            | Admin |
| POST   | /api/admin/coupons                | Create coupon          | Admin |

### Delivery
| Method | Endpoint                              | Description          | Auth     |
|--------|---------------------------------------|----------------------|----------|
| GET    | /api/delivery/orders                  | Assigned orders      | Delivery |
| GET    | /api/delivery/completed               | Completed deliveries | Delivery |
| GET    | /api/delivery/stats                   | Personal stats       | Delivery |
| PUT    | /api/delivery/orders/:id/accept       | Accept order         | Delivery |
| PUT    | /api/delivery/orders/:id/out-for-delivery | Start delivery   | Delivery |
| PUT    | /api/delivery/orders/:id/delivered    | Mark delivered       | Delivery |

---

## 🎨 Design System

- **Primary:** `#6e3dff` (purple)
- **Secondary:** `#22c55e` (green)
- **Background:** `#f6f5f8` (light) / `#140f23` (dark)
- **Font:** Inter
- **Icons:** Material Symbols Outlined

---

## 📝 Available Coupon Codes (from seeder)

| Code     | Discount         | Min Order |
|----------|------------------|-----------|
| FRESH20  | 20% off (max ₹100) | ₹200    |
| SAVE50   | ₹50 flat off     | ₹500      |
| NEWUSER  | 15% off (max ₹75)| ₹100      |
