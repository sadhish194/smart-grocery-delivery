import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import VoiceAssistant from './VoiceAssistant';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 gap-4 px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <span className="text-2xl material-symbols-outlined">shopping_basket</span>
          </div>
          <h1 className="hidden text-xl font-bold tracking-tight text-primary sm:block">SmartGrocery</h1>
        </Link>

        {/* Search + Voice */}
        <form onSubmit={handleSearch} className="relative flex items-center flex-1 max-w-2xl gap-2">
          <div className="relative flex-1">
            <span className="absolute -translate-y-1/2 material-symbols-outlined left-3 top-1/2 text-slate-400">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm border-none outline-none bg-slate-100 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50"
              placeholder="Search for groceries, snacks and more..."
            />
          </div>
          <VoiceAssistant />
        </form>

        {/* Nav links (desktop) */}
        <nav className="items-center hidden gap-1 lg:flex shrink-0">
          {[
            { to: '/orders', label: 'Orders', roles: ['customer'] },
            { to: '/products', label: 'Shop', roles: null },
            { to: '/help', label: 'Support', roles: null },
          ].filter(n => !n.roles || (user && n.roles.includes(user.role))).map(n => (
            <Link key={n.to} to={n.to}
              className="px-3 py-2 text-sm font-medium transition-colors rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5">
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {user ? (
            <>
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined">person</span>
                  <span className="hidden text-sm font-medium md:block">{user.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 z-50 invisible w-48 mt-1 transition-all bg-white border shadow-xl opacity-0 top-full dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-700 group-hover:opacity-100 group-hover:visible">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="p-2">
                    {user.role === 'customer' && (
                      <>
                        <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <span className="text-base material-symbols-outlined">manage_accounts</span> Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <span className="text-base material-symbols-outlined">receipt_long</span> My Orders
                        </Link>
                        <Link to="/loyalty" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <span className="text-base material-symbols-outlined">stars</span> Loyalty Points
                        </Link>
                        <Link to="/referral" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <span className="text-base material-symbols-outlined">card_giftcard</span> Refer & Earn
                        </Link>
                        <Link to="/subscriptions" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <span className="text-base material-symbols-outlined">autorenew</span> Subscriptions
                        </Link>
                        <Link to="/help" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <span className="text-base material-symbols-outlined">help</span> Help & Support
                        </Link>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="text-base material-symbols-outlined">admin_panel_settings</span> Admin Panel
                      </Link>
                    )}
                    {user.role === 'delivery' && (
                      <Link to="/delivery" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="text-base material-symbols-outlined">local_shipping</span> Delivery Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      <span className="text-base material-symbols-outlined">logout</span> Logout
                    </button>
                  </div>
                </div>
              </div>
              {user.role === 'customer' && (
                <>
                  <NotificationBell />
                  <Link to="/cart" className="relative p-2 transition-all rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">{cartCount}</span>
                  )}
                </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center px-5 py-2 text-sm font-bold text-white transition-all shadow-md rounded-xl bg-primary hover:bg-primary/90 shadow-primary/25">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
