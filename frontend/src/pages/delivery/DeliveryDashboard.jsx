// import { useState, useEffect } from 'react';
// import { getDeliveryStats, getAssignedOrders } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import { DashboardCard, StatusBadge, Loader } from '../../components/SharedComponents';
// import { Link } from 'react-router-dom';

// const DeliveryDashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([getDeliveryStats(), getAssignedOrders()])
//       .then(([sRes, oRes]) => { setStats(sRes.data); setOrders(oRes.data.slice(0, 3)); })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Loader size="lg" />;

//   return (
//     <div className="p-8 space-y-8">
//       <div>
//         <h1 className="text-2xl font-black">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
//         <p className="mt-1 text-sm text-slate-500">Here's your delivery summary for today.</p>
//       </div>

//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         <DashboardCard icon="task_alt" label="Total Delivered" value={stats?.totalDelivered || 0} color="green" />
//         <DashboardCard icon="today" label="Today's Deliveries" value={stats?.todayDelivered || 0} color="blue" />
//         <DashboardCard icon="pending" label="Pending Orders" value={stats?.pending || 0} color="orange" />
//         <DashboardCard icon="local_shipping" label="Active Orders" value={stats?.active || 0} color="primary" />
//       </div>

//       {/* Weekly Progress */}
//       <div className="p-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//         <h2 className="mb-4 font-bold">Weekly Progress</h2>
//         <div className="flex items-center gap-4">
//           <div className="flex-1">
//             <div className="w-full h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
//               <div className="h-full transition-all rounded-full bg-primary" style={{ width: `${Math.min(100, ((stats?.totalDelivered || 0) / 40) * 100)}%` }}></div>
//             </div>
//             <p className="mt-2 text-xs text-slate-500">{stats?.totalDelivered || 0} / 40 deliveries to bonus</p>
//           </div>
//           <div className="text-right">
//             <p className="text-2xl font-black text-primary">{Math.min(100, Math.round(((stats?.totalDelivered || 0) / 40) * 100))}%</p>
//             <p className="text-xs text-slate-500">Completed</p>
//           </div>
//         </div>
//       </div>

//       {/* Recent Assignments */}
//       {orders.length > 0 && (
//         <div className="bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//           <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
//             <h2 className="font-bold">Active Assignments</h2>
//             <Link to="/delivery/orders" className="text-sm font-semibold text-primary hover:underline">View All</Link>
//           </div>
//           <div className="divide-y divide-slate-100 dark:divide-slate-800">
//             {orders.map(order => (
//               <div key={order._id} className="flex items-center justify-between p-4">
//                 <div>
//                   <p className="text-sm font-semibold">#{order._id.slice(-6).toUpperCase()}</p>
//                   <p className="text-xs text-slate-500">{order.user?.name} · {order.address?.city}</p>
//                 </div>
//                 <StatusBadge status={order.orderStatus} />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeliveryDashboard;


import { useState, useEffect, useRef } from 'react';
import { getDeliveryStats, getAssignedOrders, getCompletedDeliveries, acceptOrder, outForDelivery, markDelivered } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/SharedComponents';
import { Link, useNavigate } from 'react-router-dom';

// ── Mini Leaflet map for active delivery ─────────────────────────────────────
const MiniMap = ({ address }) => {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!address) return;
    const q = [address.street, address.city, address.state, address.zipCode, 'India'].filter(Boolean).join(', ');
    const tryGeo = async (query) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=in`,
          { headers: { 'Accept-Language': 'en', 'User-Agent': 'SmartGroceryApp/1.0' } });
        const data = await res.json();
        if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      } catch (_) {}
      return null;
    };
    const queries = [q, [address.city, address.state, 'India'].join(', '), address.zipCode ? `${address.zipCode}, India` : null].filter(Boolean);
    (async () => {
      for (const q of queries) {
        const c = await tryGeo(q);
        if (c) { setCoords(c); return; }
      }
    })();
  }, [address]);

  useEffect(() => {
    if (!coords || !mapRef.current || instanceRef.current) return;
    const load = () => new Promise(res => {
      if (window.L) { res(); return; }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = res; document.head.appendChild(s);
    });
    load().then(() => {
      if (!window.L || !mapRef.current || instanceRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { center: [coords.lat, coords.lng], zoom: 14, zoomControl: false, scrollWheelZoom: false, dragging: false });
      instanceRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      // "CURRENT TARGET" labeled marker
      const icon = L.divIcon({
        html: `<div>
          <div style="background:#6e3dff;color:white;font-size:9px;font-weight:900;padding:3px 6px;border-radius:4px;white-space:nowrap;margin-bottom:4px;text-align:center;box-shadow:0 2px 6px rgba(110,61,255,0.4)">CURRENT TARGET</div>
          <div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:2px solid white;margin:0 auto;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
        </div>`,
        iconSize: [90, 40], iconAnchor: [45, 40], className: '',
      });
      L.marker([coords.lat, coords.lng], { icon }).addTo(map);
    });
    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, [coords]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}
      className="flex items-center justify-center bg-slate-100 dark:bg-slate-800">
      {!coords && <span className="text-3xl material-symbols-outlined text-slate-400 animate-pulse">map</span>}
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, subColor = 'text-emerald-500', accent = false }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 flex flex-col gap-3 ${accent ? 'border-primary' : 'border-slate-100 dark:border-slate-800'}`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center justify-center w-11 h-11 bg-primary/10 rounded-xl">
        <span className="text-xl material-symbols-outlined text-primary">{icon}</span>
      </div>
      {sub && <span className={`text-xs font-bold ${subColor}`}>{sub}</span>}
    </div>
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  </div>
);

// ── New Order Card ─────────────────────────────────────────────────────────────
const NewOrderCard = ({ order, onAccept, loading }) => (
  <div className="p-4 space-y-3 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <span className="text-lg material-symbols-outlined text-primary">shopping_basket</span>
        </div>
        <div>
          <p className="text-xs text-slate-500">2.4 miles away</p>
          <p className="text-sm font-bold">{order.user?.name || 'Customer'}</p>
        </div>
      </div>
      <p className="text-lg font-black text-primary">₹{order.totalPrice?.toFixed(0)}</p>
    </div>
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className="text-xs material-symbols-outlined">location_on</span>
      <span>Delivery to: {order.address?.street || order.address?.city}</span>
    </div>
    <button onClick={() => onAccept(order._id)} disabled={loading}
      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2">
      {loading ? <span className="text-sm material-symbols-outlined animate-spin">progress_activity</span> : null}
      Accept Order
    </button>
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const DeliveryDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const load = async () => {
    try {
      const [sRes, aRes, cRes] = await Promise.all([
        getDeliveryStats(),
        getAssignedOrders(),
        getCompletedDeliveries(),
      ]);
      setStats(sRes.data);
      const all = aRes.data || [];
      // Active = Accepted or OutForDelivery
      setActiveOrders(all.filter(o => ['Accepted', 'OutForDelivery'].includes(o.orderStatus)));
      // New = Assigned (not yet accepted)
      setNewOrders(all.filter(o => o.orderStatus === 'Assigned'));
      setCompleted((cRes.data || []).slice(0, 5));
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  // Poll every 20s
  useEffect(() => { const t = setInterval(load, 20000); return () => clearInterval(t); }, []);

  const handleAccept = async (orderId) => {
    setActionLoading(a => ({ ...a, [orderId]: true }));
    try { await acceptOrder(orderId); await load(); } catch (_) {}
    finally { setActionLoading(a => ({ ...a, [orderId]: false })); }
  };

  const handleNextStep = async (order) => {
    setActionLoading(a => ({ ...a, [order._id]: true }));
    try {
      if (order.orderStatus === 'Accepted') await outForDelivery(order._id);
      else if (order.orderStatus === 'OutForDelivery') await markDelivered(order._id);
      await load();
    } catch (_) {}
    finally { setActionLoading(a => ({ ...a, [order._id]: false })); }
  };

  if (loading) return <Loader size="lg" />;

  const delivered = stats?.totalDelivered || 0;
  const progress = Math.min(100, Math.round((delivered / 40) * 100));
  const activeOrder = activeOrders[0] || null;

  return (
    <div className="min-h-screen p-6 space-y-6 bg-slate-50 dark:bg-slate-950">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Online toggle */}
          <button onClick={() => setOnline(o => !o)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all
              ${online ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : 'border-slate-300 text-slate-500 bg-white dark:bg-slate-800'}`}>
            <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {online ? 'ONLINE' : 'OFFLINE'}
          </button>
          {/* Notification */}
          <button className="relative flex items-center justify-center w-10 h-10 transition-colors bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary">
            <span className="text-lg material-symbols-outlined text-slate-500">notifications</span>
            {newOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {newOrders.length}
              </span>
            )}
          </button>
          {/* Avatar */}
          <div className="flex items-center justify-center w-10 h-10 text-sm font-black border bg-primary/10 text-primary rounded-xl border-primary/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="today" label="Today's Deliveries" value={stats?.todayDelivered || 0} sub="+12%" />
        <StatCard icon="payments" label="Total Earnings" value={`₹${(delivered * 45).toLocaleString()}`} sub="+₹240" />
        <StatCard icon="star" label="Average Rating" value="4.9" sub="Top 5%" subColor="text-amber-500" />
        <StatCard icon="pending" label="Active Orders" value={activeOrders.length + newOrders.length} accent={activeOrders.length > 0} />
      </div>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* LEFT: Active delivery + Recent */}
        <div className="space-y-6 xl:col-span-2">

          {/* Active Delivery */}
          <div className="overflow-hidden bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-black">Active Delivery</h2>
            </div>

            {activeOrder ? (
              <div className="flex flex-col gap-0 md:flex-row">
                {/* Mini map */}
                <div className="flex-shrink-0 h-48 p-3 md:w-52 md:h-auto">
                  <MiniMap address={activeOrder.address} />
                </div>
                {/* Info */}
                <div className="flex flex-col justify-center flex-1 gap-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-black">
                        Order #{activeOrder._id.slice(-6).toUpperCase()} — {activeOrder.user?.name || 'Customer'}
                      </p>
                    </div>
                    <span className={`text-xs font-black px-3 py-1 rounded-full flex-shrink-0
                      ${activeOrder.orderStatus === 'OutForDelivery' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'}`}>
                      {activeOrder.orderStatus === 'OutForDelivery' ? 'IN TRANSIT' : 'ACCEPTED'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="text-sm material-symbols-outlined text-slate-400">location_on</span>
                      {activeOrder.address?.street}, {activeOrder.address?.city}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm material-symbols-outlined text-slate-400">schedule</span>
                      Estimated Delivery: <span className="font-bold text-slate-700 dark:text-slate-200">
                        {activeOrder.orderStatus === 'OutForDelivery' ? '12 mins' : '25 mins'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {/* Navigate opens Google Maps */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        [activeOrder.address?.street, activeOrder.address?.city, activeOrder.address?.state].filter(Boolean).join(', ')
                      )}`}
                      target="_blank" rel="noreferrer"
                      className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/25">
                      <span className="text-sm material-symbols-outlined">navigation</span>
                      Navigate
                    </a>
                    <button
                      onClick={() => handleNextStep(activeOrder)}
                      disabled={actionLoading[activeOrder._id]}
                      className="flex-1 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl font-bold text-sm hover:border-primary hover:text-primary transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {actionLoading[activeOrder._id]
                        ? <span className="text-sm material-symbols-outlined animate-spin">progress_activity</span>
                        : null}
                      {activeOrder.orderStatus === 'OutForDelivery' ? 'Mark Delivered' : 'Start Delivery'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400">
                <span className="mb-2 text-4xl material-symbols-outlined">local_shipping</span>
                <p className="font-semibold">No active delivery</p>
                <p className="text-sm">Accept a new order to get started</p>
              </div>
            )}
          </div>

          {/* Recent Deliveries */}
          <div className="bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black">Recent Deliveries</h2>
              <Link to="/delivery/completed" className="text-xs font-semibold text-primary hover:underline">View All</Link>
            </div>
            {completed.length === 0 ? (
              <div className="p-8 text-sm text-center text-slate-400">No deliveries yet today</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs font-bold uppercase border-b text-slate-400 border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Earnings</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {completed.map(order => (
                    <tr key={order._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 font-bold text-slate-600 dark:text-slate-400">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3.5 font-medium">{order.user?.name || '—'}</td>
                      <td className="px-4 py-3.5 font-black text-emerald-600">
                        ₹{order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Completed</span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-400">
                        {order.deliveredAt
                          ? new Date(order.deliveredAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT: New Orders */}
        <div className="space-y-4 xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black">New Orders</h2>
            {newOrders.length > 0 && (
              <span className="bg-primary text-white text-xs font-black px-2.5 py-1 rounded-full">
                {newOrders.length} NEARBY
              </span>
            )}
          </div>

          {newOrders.length === 0 ? (
            <div className="p-8 text-center bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 text-slate-400">
              <span className="block mb-2 text-3xl material-symbols-outlined">inbox</span>
              <p className="text-sm font-semibold">No new orders nearby</p>
              <p className="mt-1 text-xs">New assignments will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {newOrders.map(order => (
                <NewOrderCard
                  key={order._id}
                  order={order}
                  onAccept={handleAccept}
                  loading={actionLoading[order._id]}
                />
              ))}
            </div>
          )}

          {/* Quick stats */}
          <div className="p-5 space-y-4 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold">Today's Summary</h3>
            {[
              { label: 'Total Distance', value: `${(delivered * 3.2).toFixed(1)} km`, icon: 'route' },
              { label: 'Time Active', value: '6h 24m', icon: 'timer' },
              { label: 'Avg. Delivery Time', value: '18 min', icon: 'schedule' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="text-sm material-symbols-outlined text-primary">{s.icon}</span>
                  {s.label}
                </div>
                <span className="text-sm font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
