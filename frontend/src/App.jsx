// import { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import AdminSidebar from './components/AdminSidebar';
// import DeliverySidebar from './components/DeliverySidebar';
// import { ChatBot } from './components/ChatBot';

// // Customer Pages
// import Home from './pages/customer/Home';
// import Products from './pages/customer/Products';
// import ProductDetails from './pages/customer/ProductDetails';
// import Cart from './pages/customer/Cart';
// import Checkout from './pages/customer/Checkout';
// import { Orders, OrderTracking, OrderSuccess } from './pages/customer/Orders';
// import Profile from './pages/customer/Profile';
// import Login from './pages/customer/Login';
// import Register from './pages/customer/Register';
// import Help from './pages/customer/Help';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ManageProducts from './pages/admin/ManageProducts';
// import ManageOrders from './pages/admin/ManageOrders';
// import ManageUsers from './pages/admin/ManageUsers';
// import ManageCoupons from './pages/admin/ManageCoupons';
// import DynamicPricing from './pages/admin/DynamicPricing';
// import Algorithms from './pages/admin/Algorithms';

// // Delivery Pages
// import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
// import { AssignedOrders, CompletedDeliveries } from './pages/delivery/DeliveryOrders';
// import DeliveryProfile from './pages/delivery/DeliveryProfile';

// // ── Scroll to top on every route change ──────────────────────────────────────
// const ScrollToTop = () => {
//   const { pathname } = useLocation();
//   useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
//   return null;
// };

// // ── Floating back-to-top button ───────────────────────────────────────────────
// const BackToTop = () => {
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setVisible(window.scrollY > 400);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);
//   if (!visible) return null;
//   return (
//     <button
//       onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//       className="fixed z-40 flex items-center justify-center text-white transition-all duration-200 rounded-full shadow-lg bottom-24 left-5 w-11 h-11 bg-primary shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1"
//       title="Back to top">
//       <span className="text-lg material-symbols-outlined">keyboard_arrow_up</span>
//     </button>
//   );
// };

// // ─── Route Guards ────────────────────────────────────────────────────────────
// const ProtectedRoute = ({ roles }) => {
//   const { user } = useAuth();
//   const location = useLocation();
//   if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
//   return <Outlet />;
// };

// // ─── Layouts ─────────────────────────────────────────────────────────────────
// const CustomerLayout = () => (
//   <div className="flex flex-col min-h-screen">
//     <Navbar />
//     <main className="flex-1"><Outlet /></main>
//     <Footer />
//     <ChatBot mode="float" />
//   </div>
// );

// const AdminLayout = () => (
//   <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
//     <AdminSidebar />
//     <main className="flex-1 min-h-screen ml-64 overflow-y-auto">
//       <Outlet />
//     </main>
//   </div>
// );

// const DeliveryLayout = () => (
//   <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
//     <DeliverySidebar />
//     <main className="flex-1 min-h-screen ml-64 overflow-y-auto">
//       <Outlet />
//     </main>
//   </div>
// );

// // ─── App ─────────────────────────────────────────────────────────────────────
// export default function App() {
//   return (
//     <>
//       <ScrollToTop />
//       <BackToTop />
//       <Routes>
//         {/* Public auth pages */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Customer routes */}
//         <Route element={<CustomerLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/products/:id" element={<ProductDetails />} />
//           <Route path="/help" element={<Help />} />

//           <Route element={<ProtectedRoute roles={['customer']} />}>
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/checkout" element={<Checkout />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/orders/:id" element={<OrderTracking />} />
//             <Route path="/order-success/:id" element={<OrderSuccess />} />
//             <Route path="/profile" element={<Profile />} />
//           </Route>
//         </Route>

//         {/* Admin routes */}
//         <Route element={<ProtectedRoute roles={['admin']} />}>
//           <Route element={<AdminLayout />}>
//             <Route path="/admin" element={<AdminDashboard />} />
//             <Route path="/admin/products" element={<ManageProducts />} />
//             <Route path="/admin/orders" element={<ManageOrders />} />
//             <Route path="/admin/users" element={<ManageUsers />} />
//             <Route path="/admin/coupons" element={<ManageCoupons />} />
//             <Route path="/admin/pricing" element={<DynamicPricing />} />
//           <Route path="/admin/algorithms" element={<Algorithms />} />
//           </Route>
//         </Route>

//         {/* Delivery routes */}
//         <Route element={<ProtectedRoute roles={['delivery']} />}>
//           <Route element={<DeliveryLayout />}>
//             <Route path="/delivery" element={<DeliveryDashboard />} />
//             <Route path="/delivery/orders" element={<AssignedOrders />} />
//             <Route path="/delivery/completed" element={<CompletedDeliveries />} />
//             <Route path="/delivery/profile" element={<DeliveryProfile />} />
//           </Route>
//         </Route>

//         {/* Catch-all */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   );
// }

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';
import DeliverySidebar from './components/DeliverySidebar';
import { ChatBot } from './components/ChatBot';

// Customer Pages
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import { Orders, OrderTracking, OrderSuccess } from './pages/customer/Orders';
import Profile from './pages/customer/Profile';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Help from './pages/customer/Help';
import Loyalty from './pages/customer/Loyalty';
import Referral from './pages/customer/Referral';
import Subscriptions from './pages/customer/Subscriptions';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCoupons from './pages/admin/ManageCoupons';
import DynamicPricing from './pages/admin/DynamicPricing';
import Algorithms from './pages/admin/Algorithms';
import Analytics from './pages/admin/Analytics';
import FlashSales from './pages/admin/FlashSales';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import { AssignedOrders, CompletedDeliveries } from './pages/delivery/DeliveryOrders';
import DeliveryProfile from './pages/delivery/DeliveryProfile';

// ── Scroll to top on every route change ──────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
};

// ── Floating back-to-top button ───────────────────────────────────────────────
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed z-40 flex items-center justify-center text-white transition-all duration-200 rounded-full shadow-lg bottom-24 left-5 w-11 h-11 bg-primary shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1">
      <span className="text-lg material-symbols-outlined">keyboard_arrow_up</span>
    </button>
  );
};

// ─── Route Guards ────────────────────────────────────────────────────────────
const ProtectedRoute = ({ roles }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

// ─── Layouts ─────────────────────────────────────────────────────────────────
const CustomerLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1"><Outlet /></main>
    <Footer />
    <ChatBot mode="float" />
  </div>
);

const AdminLayout = () => (
  <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
    <AdminSidebar />
    <main className="flex-1 min-h-screen ml-64 overflow-y-auto"><Outlet /></main>
  </div>
);

const DeliveryLayout = () => (
  <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
    <DeliverySidebar />
    <main className="flex-1 min-h-screen ml-64 overflow-y-auto"><Outlet /></main>
  </div>
);

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <ScrollToTop />
      <BackToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/help" element={<Help />} />

          <Route element={<ProtectedRoute roles={['customer']} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderTracking />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/loyalty" element={<Loyalty />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/coupons" element={<ManageCoupons />} />
            <Route path="/admin/pricing" element={<DynamicPricing />} />
            <Route path="/admin/algorithms" element={<Algorithms />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/flash-sales" element={<FlashSales />} />
          </Route>
        </Route>

        {/* Delivery */}
        <Route element={<ProtectedRoute roles={['delivery']} />}>
          <Route element={<DeliveryLayout />}>
            <Route path="/delivery" element={<DeliveryDashboard />} />
            <Route path="/delivery/orders" element={<AssignedOrders />} />
            <Route path="/delivery/completed" element={<CompletedDeliveries />} />
            <Route path="/delivery/profile" element={<DeliveryProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}