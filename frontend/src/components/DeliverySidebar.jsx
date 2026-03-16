// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const navItems = [
//   { to: '/delivery', icon: 'dashboard', label: 'Dashboard', exact: true },
//   { to: '/delivery/orders', icon: 'local_shipping', label: 'My Deliveries' },
//   { to: '/delivery/completed', icon: 'task_alt', label: 'Completed' },
//   { to: '/delivery/profile', icon: 'person', label: 'Profile' },
// ];

// const DeliverySidebar = () => {
//   const { pathname } = useLocation();
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const isActive = (to, exact) => exact ? pathname === to : pathname.startsWith(to) && to !== '/delivery';

//   return (
//     <aside className="fixed z-50 flex flex-col w-64 h-full bg-white border-r dark:bg-slate-900 border-slate-200 dark:border-slate-800">
//       <div className="flex items-center gap-3 p-6">
//         <div className="bg-primary rounded-lg p-1.5 text-white">
//           <span className="block material-symbols-outlined">local_shipping</span>
//         </div>
//         <div>
//           <h1 className="text-base font-bold text-primary">Smart Grocery</h1>
//           <p className="text-xs text-slate-500">Delivery Partner</p>
//         </div>
//       </div>

//       <nav className="flex-1 px-4 space-y-1">
//         {navItems.map(item => (
//           <Link
//             key={item.to}
//             to={item.to}
//             className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
//               isActive(item.to, item.exact)
//                 ? 'bg-primary/10 text-primary font-semibold'
//                 : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
//             }`}
//           >
//             <span className="material-symbols-outlined">{item.icon}</span>
//             {item.label}
//           </Link>
//         ))}
//       </nav>

//       <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
//         <div className="p-3 bg-primary/5 rounded-xl">
//           <p className="text-xs font-bold text-slate-800 dark:text-white">{user?.name}</p>
//           <p className="text-[10px] text-slate-500">{user?.phone || user?.email}</p>
//         </div>
//         <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30">
//           <span className="text-sm material-symbols-outlined">logout</span> Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default DeliverySidebar;


import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/delivery',           icon: 'dashboard',      label: 'Dashboard',     exact: true },
  { to: '/delivery/orders',    icon: 'local_shipping', label: 'My Deliveries' },
  { to: '/delivery/completed', icon: 'payments',       label: 'Earnings' },
  { to: '/delivery/profile',   icon: 'person',         label: 'Profile' },
];

const DeliverySidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to, exact) =>
    exact ? pathname === to : pathname === to;

  return (
    <aside className="fixed z-50 flex flex-col w-64 h-full bg-white border-r dark:bg-slate-900 border-slate-100 dark:border-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-center shadow-lg w-9 h-9 bg-primary rounded-xl shadow-primary/30">
          <span className="text-lg text-white material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
        </div>
        <div>
          <p className="text-sm font-black leading-none text-primary">Smart Grocery</p>
          <p className="text-slate-400 text-xs mt-0.5">Delivery Partner</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => {
          const active = isActive(item.to, item.exact);
          return (
            <Link key={item.to} to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium
                ${active
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}>
              <span className="text-xl material-symbols-outlined"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        <div className="pt-2">
          <Link to="/delivery/settings"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
            <span className="text-xl material-symbols-outlined">settings</span>
            Settings
          </Link>
        </div>
      </nav>

      {/* Weekly progress at bottom */}
      <div className="px-4 pb-3">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Weekly Progress</p>
          </div>
          <div className="w-full h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-primary" style={{ width: '80%' }} />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">32/40 Deliveries to Bonus</p>
        </div>
      </div>

      {/* User + logout */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-center flex-shrink-0 text-sm font-black rounded-full w-9 h-9 bg-primary/10 text-primary">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{user?.name}</p>
          <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
          <span className="text-sm material-symbols-outlined">logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DeliverySidebar;
