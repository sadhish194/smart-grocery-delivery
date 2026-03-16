// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const NAV = [
//   { to: '/admin', label: 'Dashboard', icon: 'dashboard' },
//   { to: '/admin/products', label: 'Products', icon: 'inventory_2' },
//   { to: '/admin/orders', label: 'Orders', icon: 'shopping_cart' },
//   { to: '/admin/users', label: 'Users', icon: 'group' },
// ];

// export default function AdminSidebar() {
//   const { pathname } = useLocation();
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <aside className="fixed z-40 flex flex-col w-64 h-full bg-white border-r dark:bg-slate-900 border-slate-200 dark:border-slate-800">
//       <div className="flex items-center gap-3 p-6 border-b border-slate-100 dark:border-slate-800">
//         <div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-primary">
//           <span className="material-symbols-outlined">shopping_basket</span>
//         </div>
//         <div>
//           <h1 className="text-sm font-bold leading-tight text-slate-900 dark:text-white">Smart Grocery</h1>
//           <p className="text-xs text-slate-500 dark:text-slate-400">Admin Panel</p>
//         </div>
//       </div>
//       <nav className="flex-1 px-4 py-4 space-y-1">
//         {NAV.map(n => {
//           const active = n.to === '/admin' ? pathname === '/admin' : pathname.startsWith(n.to);
//           return (
//             <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
//               <span className="text-xl material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{n.icon}</span>
//               <span className="text-sm">{n.label}</span>
//             </Link>
//           );
//         })}
//       </nav>
//       <div className="p-4 border-t border-slate-200 dark:border-slate-800">
//         <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
//           <div className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-primary/20 text-primary">{user?.name?.[0]}</div>
//           <div className="flex-1 overflow-hidden">
//             <p className="text-xs font-bold truncate">{user?.name}</p>
//             <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
//           </div>
//           <button onClick={() => { logout(); navigate('/login'); }} className="transition-colors text-slate-400 hover:text-red-500">
//             <span className="text-base material-symbols-outlined">logout</span>
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// }

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin',          label: 'Dashboard',       icon: 'dashboard' },
  { to: '/admin/products', label: 'Products',         icon: 'inventory_2' },
  { to: '/admin/orders',   label: 'Orders',           icon: 'shopping_cart' },
  { to: '/admin/users',    label: 'Users',            icon: 'group' },
  { to: '/admin/coupons',  label: 'Coupons',          icon: 'sell' },
  { to: '/admin/pricing',  label: 'Dynamic Pricing',  icon: 'auto_graph' },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="fixed z-40 flex flex-col w-64 h-full bg-white border-r dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-primary">
          <span className="material-symbols-outlined">shopping_basket</span>
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight text-slate-900 dark:text-white">Smart Grocery</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV.map(n => {
          const active = n.to === '/admin' ? pathname === '/admin' : pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <span className="text-xl material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{n.icon}</span>
              <span className="text-sm">{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-primary/20 text-primary">{user?.name?.[0]}</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="transition-colors text-slate-400 hover:text-red-500">
            <span className="text-base material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}