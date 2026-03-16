// import { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { getMyOrders, getOrderById } from '../../services/api';
// import { Loader, StatusBadge } from '../../components/SharedComponents';

// // ── My Orders List ────────────────────────────────────────────────────────────
// export const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Loader size="lg" />;

//   return (
//     <div className="max-w-4xl px-4 py-8 mx-auto">
//       <h1 className="mb-6 text-2xl font-black">My Orders</h1>
//       {orders.length === 0 ? (
//         <div className="py-20 text-center">
//           <div className="mb-4 text-5xl">📦</div>
//           <h2 className="mb-2 text-xl font-bold">No orders yet</h2>
//           <p className="mb-6 text-slate-500">Start shopping to place your first order!</p>
//           <Link to="/products" className="px-8 py-3 font-bold text-white transition-all bg-primary rounded-xl hover:bg-primary/90">Shop Now</Link>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map(order => (
//             <Link key={order._id} to={`/orders/${order._id}`}
//               className="block p-5 transition-all bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-primary/20">
//               <div className="flex items-center justify-between mb-3">
//                 <div>
//                   <p className="text-sm font-bold">Order #{order._id.slice(-8).toUpperCase()}</p>
//                   <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
//                 </div>
//                 <StatusBadge status={order.orderStatus} />
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="text-sm text-slate-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
//                 <p className="text-lg font-black text-primary">₹{order.totalPrice.toFixed(2)}</p>
//               </div>
//               {order.deliveryPerson && (
//                 <p className="flex items-center gap-1 mt-2 text-xs text-slate-500">
//                   <span className="text-xs material-symbols-outlined">local_shipping</span>
//                   Delivery by {order.deliveryPerson.name}
//                 </p>
//               )}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ── Order Tracking ────────────────────────────────────────────────────────────
// export const OrderTracking = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getOrderById(id)
//       .then(r => setOrder(r.data))
//       .catch(() => navigate('/orders'))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <Loader size="lg" />;
//   if (!order) return null;

//   const steps = [
//     { status: 'Pending',        icon: 'receipt_long',   label: 'Order Placed' },
//     { status: 'Assigned',       icon: 'person_pin',     label: 'Rider Assigned' },
//     { status: 'Accepted',       icon: 'thumb_up',       label: 'Rider Accepted' },
//     { status: 'OutForDelivery', icon: 'local_shipping', label: 'Out for Delivery' },
//     { status: 'Delivered',      icon: 'task_alt',       label: 'Delivered' },
//   ];
//   const statusOrder = ['Pending', 'Assigned', 'Accepted', 'OutForDelivery', 'Delivered'];
//   const currentIdx = statusOrder.indexOf(order.orderStatus);

//   return (
//     <div className="max-w-2xl px-4 py-8 mx-auto">
//       <button onClick={() => navigate('/orders')}
//         className="flex items-center gap-1 mb-6 text-sm transition-colors text-slate-500 hover:text-primary">
//         <span className="text-sm material-symbols-outlined">arrow_back</span> Back to Orders
//       </button>

//       {/* Status Card */}
//       <div className="p-6 mb-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-lg font-black">Order #{order._id.slice(-8).toUpperCase()}</h1>
//             <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
//           </div>
//           <StatusBadge status={order.orderStatus} />
//         </div>

//         {/* Progress Steps */}
//         <div className="relative mt-8 mb-2">
//           <div className="relative flex justify-between">
//             <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-slate-200 dark:bg-slate-700" />
//             {currentIdx > 0 && (
//               <div
//                 className="absolute top-5 h-0.5 bg-primary transition-all duration-500"
//                 style={{ left: '5%', width: `${(currentIdx / (steps.length - 1)) * 90}%` }}
//               />
//             )}
//             {steps.map((step, i) => {
//               const done = i <= currentIdx;
//               return (
//                 <div key={step.status} className="relative z-10 flex flex-col items-center flex-1 gap-2">
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-400'}`}>
//                     <span className="text-sm material-symbols-outlined">{step.icon}</span>
//                   </div>
//                   <p className={`text-[10px] font-semibold text-center leading-tight max-w-[60px] ${done ? 'text-primary' : 'text-slate-400'}`}>
//                     {step.label}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Items */}
//       <div className="p-5 mb-4 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//         <h2 className="mb-4 font-bold">Items Ordered</h2>
//         <div className="space-y-3">
//           {order.items.map((item, i) => (
//             <div key={i} className="flex items-center gap-3">
//               <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
//                 <img
//                   src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'}
//                   alt={item.name} className="object-cover w-full h-full"
//                   onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'; }}
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold truncate">{item.name}</p>
//                 <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
//               </div>
//               <p className="text-sm font-bold shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
//             </div>
//           ))}
//         </div>
//         <div className="pt-4 mt-4 space-y-2 text-sm border-t border-slate-100 dark:border-slate-800">
//           <div className="flex justify-between text-slate-500">
//             <span>Delivery</span>
//             <span className={order.deliveryCharge === 0 ? 'text-emerald-500 font-semibold' : ''}>
//               {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
//             </span>
//           </div>
//           {order.discount > 0 && (
//             <div className="flex justify-between text-emerald-600">
//               <span>Discount</span><span>-₹{order.discount}</span>
//             </div>
//           )}
//           <div className="flex justify-between text-base font-black">
//             <span>Total</span>
//             <span className="text-primary">₹{order.totalPrice.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Delivery Info */}
//       <div className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//         <h2 className="mb-3 font-bold">Delivery Details</h2>
//         <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
//           <p className="font-semibold text-slate-800 dark:text-slate-200">{order.address.street}</p>
//           <p>{order.address.city}, {order.address.state} — {order.address.zipCode}</p>
//           <p className="flex items-center gap-1">
//             <span className="text-sm material-symbols-outlined text-primary">call</span>
//             {order.address.phone}
//           </p>
//         </div>
//         {order.deliveryPerson && (
//           <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
//             <div className="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full bg-primary/10 text-primary">
//               {order.deliveryPerson.name?.charAt(0).toUpperCase()}
//             </div>
//             <div className="flex-1">
//               <p className="text-sm font-semibold">{order.deliveryPerson.name}</p>
//               <p className="text-xs text-slate-500">Delivery Partner</p>
//             </div>
//             {order.deliveryPerson.phone && (
//               <a href={`tel:${order.deliveryPerson.phone}`}
//                 className="p-2 transition-all rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white">
//                 <span className="text-sm material-symbols-outlined">call</span>
//               </a>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ── Order Success ─────────────────────────────────────────────────────────────
// export const OrderSuccess = () => {
//   const { id } = useParams();
//   return (
//     <div className="max-w-md px-4 py-20 mx-auto text-center">
//       <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full shadow-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 shadow-emerald-100 dark:shadow-none">
//         <span className="text-5xl material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
//       </div>
//       <h1 className="mb-2 text-3xl font-black">Order Placed! 🎉</h1>
//       <p className="mb-2 text-slate-500">Your order has been successfully placed.</p>
//       <p className="mb-6 text-sm text-slate-400">We'll notify you when it's out for delivery.</p>
//       <div className="inline-block px-6 py-3 mb-8 border bg-primary/5 border-primary/20 rounded-xl">
//         <p className="text-xs text-slate-500 mb-0.5">Order ID</p>
//         <p className="text-lg font-black tracking-widest text-primary">#{id?.slice(-8).toUpperCase()}</p>
//       </div>
//       <div className="flex flex-col justify-center gap-3 sm:flex-row">
//         <Link to={`/orders/${id}`}
//           className="flex items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-all shadow-lg bg-primary rounded-xl hover:bg-primary/90 shadow-primary/20">
//           <span className="text-sm material-symbols-outlined">local_shipping</span> Track Order
//         </Link>
//         <Link to="/"
//           className="px-6 py-3 font-bold transition-all border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
//           Continue Shopping
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Orders;

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getMyOrders, getOrderById } from '../../services/api';
import { Loader, StatusBadge } from '../../components/SharedComponents';

// ── My Orders List ────────────────────────────────────────────────────────────
export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-black">My Orders</h1>
      {orders.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-4 text-5xl">📦</div>
          <h2 className="mb-2 text-xl font-bold">No orders yet</h2>
          <p className="mb-6 text-slate-500">Start shopping to place your first order!</p>
          <Link to="/products" className="px-8 py-3 font-bold text-white transition-all bg-primary rounded-xl hover:bg-primary/90">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`}
              className="block p-5 transition-all bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <StatusBadge status={order.orderStatus} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                <p className="text-lg font-black text-primary">₹{order.totalPrice.toFixed(2)}</p>
              </div>
              {order.deliveryPerson && (
                <p className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <span className="text-xs material-symbols-outlined">local_shipping</span>
                  Delivery by {order.deliveryPerson.name}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Robust geocoder: tries multiple query variations ──────────────────────────
const geocodeAddress = async (address) => {
  // Build a list of queries from most specific to least specific
  const queries = [
    // Full address
    [address.street, address.city, address.state, address.zipCode, 'India'].filter(Boolean).join(', '),
    // Without street (handles misspelled streets)
    [address.city, address.state, address.zipCode, 'India'].filter(Boolean).join(', '),
    // Just city + state
    [address.city, address.state, 'India'].filter(Boolean).join(', '),
    // Just city
    [address.city, 'India'].filter(Boolean).join(', '),
    // Zipcode only
    address.zipCode ? `${address.zipCode}, India` : null,
  ].filter(Boolean);

  for (const q of queries) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&countrycodes=in`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'SmartGroceryApp/1.0' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), label: data[0].display_name };
      }
    } catch (_) {}
  }

  // Final fallback: India center so map always shows something
  return { lat: 20.5937, lng: 78.9629, label: 'India', isFallback: true };
};

// Simulate rider position based on order status
const simulateRiderPosition = (destLat, destLng, status) => {
  const offsets = {
    Assigned:       { lat: 0.042, lng: -0.058 },
    Accepted:       { lat: 0.025, lng: -0.033 },
    OutForDelivery: { lat: 0.006, lng: -0.008 },
    Delivered:      { lat: 0.000, lng:  0.000 },
  };
  const off = offsets[status] || { lat: 0.050, lng: -0.070 };
  return { lat: destLat + off.lat, lng: destLng + off.lng };
};

// ── Leaflet Map Component ─────────────────────────────────────────────────────
const LiveMap = ({ order, deliveryCoords, storeCoords, riderCoords }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!deliveryCoords || mapInstanceRef.current) return;

    const loadLeaflet = () => new Promise((resolve) => {
      if (window.L) { resolve(); return; }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = resolve;
      script.onerror = resolve; // still resolve so we can show fallback
      document.head.appendChild(script);
    });

    loadLeaflet().then(() => {
      const L = window.L;
      if (!mapRef.current || mapInstanceRef.current || !L) return;

      const map = L.map(mapRef.current, {
        center: [deliveryCoords.lat, deliveryCoords.lng],
        zoom: deliveryCoords.isFallback ? 5 : 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const mkIcon = (emoji, color) => L.divIcon({
        html: `<div style="background:${color};width:38px;height:38px;border-radius:50% 50% 50% 0;
               transform:rotate(-45deg);border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.25);">
               <span style="transform:rotate(45deg);font-size:17px;display:block;text-align:center;line-height:32px;">${emoji}</span></div>`,
        iconSize: [38, 38], iconAnchor: [19, 38], className: '',
      });

      const riderIcon = L.divIcon({
        html: `<div style="background:white;width:42px;height:42px;border-radius:50%;border:3px solid #6e3dff;
               box-shadow:0 3px 14px rgba(110,61,255,0.45);display:flex;align-items:center;justify-content:center;
               font-size:22px;">🛵</div>`,
        iconSize: [42, 42], iconAnchor: [21, 21], className: '',
      });

      const points = [[deliveryCoords.lat, deliveryCoords.lng]];

      // Store marker
      if (storeCoords && !deliveryCoords.isFallback) {
        L.marker([storeCoords.lat, storeCoords.lng], { icon: mkIcon('🏪', '#22c55e') })
          .addTo(map)
          .bindPopup('<b>Smart Grocery Store</b><br>Your order started here');
        points.push([storeCoords.lat, storeCoords.lng]);
      }

      // Delivery destination marker
      L.marker([deliveryCoords.lat, deliveryCoords.lng], { icon: mkIcon('📍', '#6e3dff') })
        .addTo(map)
        .bindPopup(`<b>Delivery Address</b><br>${order.address?.street || ''}, ${order.address?.city || ''}`)
        .openPopup();

      // Rider marker + route line
      const isActive = ['Assigned', 'Accepted', 'OutForDelivery'].includes(order.orderStatus);
      if (riderCoords && isActive && !deliveryCoords.isFallback) {
        L.marker([riderCoords.lat, riderCoords.lng], { icon: riderIcon })
          .addTo(map)
          .bindPopup(`<b>${order.deliveryPerson?.name || 'Rider'}</b><br>On the way!`);

        L.polyline(
          [[riderCoords.lat, riderCoords.lng], [deliveryCoords.lat, deliveryCoords.lng]],
          { color: '#6e3dff', weight: 3, opacity: 0.65, dashArray: '9, 7' }
        ).addTo(map);

        points.push([riderCoords.lat, riderCoords.lng]);
      }

      if (order.orderStatus === 'Delivered') {
        L.divIcon({
          html: `<div style="font-size:32px;">✅</div>`,
          iconSize: [40, 40], iconAnchor: [20, 20], className: '',
        });
      }

      if (!deliveryCoords.isFallback && points.length > 1) {
        map.fitBounds(points, { padding: [50, 50] });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [deliveryCoords]);

  return (
    <div
      ref={mapRef}
      style={{ height: '340px', width: '100%', borderRadius: '14px', overflow: 'hidden', zIndex: 0 }}
      className="border border-slate-200 dark:border-slate-700"
    />
  );
};

// ── Order Tracking Page ───────────────────────────────────────────────────────
export const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [riderCoords, setRiderCoords] = useState(null);
  const [storeCoords, setStoreCoords] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geoLabel, setGeoLabel] = useState('');

  const fetchOrder = () =>
    getOrderById(id).then(r => setOrder(r.data)).catch(() => navigate('/orders'));

  useEffect(() => {
    fetchOrder().finally(() => setLoading(false));
  }, [id]);

  // Geocode once order loads
  useEffect(() => {
    if (!order?.address) return;
    setGeocoding(true);
    geocodeAddress(order.address).then(coords => {
      setDeliveryCoords(coords);
      setGeoLabel(coords.label || '');
      if (!coords.isFallback) {
        setStoreCoords({ lat: coords.lat + 0.032, lng: coords.lng - 0.025 });
        if (['Assigned', 'Accepted', 'OutForDelivery'].includes(order.orderStatus)) {
          setRiderCoords(simulateRiderPosition(coords.lat, coords.lng, order.orderStatus));
        }
      }
    }).finally(() => setGeocoding(false));
  }, [order?._id, order?.orderStatus]);

  // Poll every 30s
  useEffect(() => {
    const t = setInterval(() => {
      getOrderById(id).then(r => setOrder(r.data)).catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, [id]);

  if (loading) return <Loader size="lg" />;
  if (!order) return null;

  const steps = [
    { status: 'Pending',        icon: 'receipt_long',   label: 'Order Placed',     time: order.createdAt },
    { status: 'Assigned',       icon: 'person_pin',     label: 'Rider Assigned',   time: null },
    { status: 'Accepted',       icon: 'thumb_up',       label: 'Rider Accepted',   time: null },
    { status: 'OutForDelivery', icon: 'local_shipping', label: 'Out for Delivery', time: null },
    { status: 'Delivered',      icon: 'task_alt',       label: 'Delivered',        time: order.deliveredAt },
  ];
  const statusOrder = ['Pending', 'Assigned', 'Accepted', 'OutForDelivery', 'Delivered'];
  const currentIdx = statusOrder.indexOf(order.orderStatus);
  const isLive = ['Assigned', 'Accepted', 'OutForDelivery'].includes(order.orderStatus);
  const ETA = { Assigned: 45, Accepted: 30, OutForDelivery: 12 };
  const eta = ETA[order.orderStatus];

  return (
    <div className="max-w-3xl px-4 py-8 mx-auto">
      <button onClick={() => navigate('/orders')}
        className="flex items-center gap-1 mb-6 text-sm transition-colors text-slate-500 hover:text-primary">
        <span className="text-sm material-symbols-outlined">arrow_back</span> Back to Orders
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Track Order</h1>
          <p className="text-sm text-slate-500">#{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      {/* ETA / Delivered Banner */}
      {isLive && eta && (
        <div className="flex items-center gap-4 px-5 py-4 mb-6 text-white shadow-lg bg-primary rounded-2xl shadow-primary/25">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl">
            <span className="text-2xl material-symbols-outlined">schedule</span>
          </div>
          <div className="flex-1">
            <p className="text-xl font-black">{eta} minutes</p>
            <p className="text-sm opacity-80">Estimated delivery time</p>
          </div>
          <div className="text-4xl animate-bounce">🛵</div>
        </div>
      )}
      {order.orderStatus === 'Delivered' && (
        <div className="flex items-center gap-4 px-5 py-4 mb-6 text-white shadow-lg bg-emerald-500 rounded-2xl shadow-emerald-200">
          <span className="text-3xl material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <div>
            <p className="text-lg font-black">Order Delivered!</p>
            <p className="text-sm opacity-90">{order.deliveredAt ? new Date(order.deliveredAt).toLocaleString('en-IN') : 'Your order has been delivered'}</p>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="p-6 mb-4 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
        <div className="relative flex justify-between">
          <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-slate-200 dark:bg-slate-700" />
          <div
            className="absolute top-5 h-0.5 bg-primary transition-all duration-700"
            style={{ left: '5%', width: currentIdx > 0 ? `${(currentIdx / (steps.length - 1)) * 90}%` : '0%' }}
          />
          {steps.map((step, i) => {
            const done = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center flex-1 gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${done ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'}
                  ${active ? 'scale-110 ring-4 ring-primary/20' : ''}`}>
                  <span className="text-sm material-symbols-outlined" style={done ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {step.icon}
                  </span>
                </div>
                <p className={`text-[10px] font-semibold text-center leading-tight max-w-[64px] ${done ? 'text-primary' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                {step.time && done && (
                  <p className="text-[9px] text-slate-400 text-center">
                    {new Date(step.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LIVE MAP ── */}
      <div className="mb-4 overflow-hidden bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm material-symbols-outlined text-primary">map</span>
            <h2 className="text-sm font-bold">Live Tracking</h2>
            {isLive && (
              <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                LIVE
              </span>
            )}
          </div>
          {geocoding && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <span className="text-xs material-symbols-outlined animate-spin">progress_activity</span>
              Locating...
            </span>
          )}
        </div>

        <div className="p-3">
          {/* Map always renders once geocoding is done */}
          {!geocoding && deliveryCoords ? (
            <>
              {deliveryCoords.isFallback && (
                <div className="flex items-center gap-2 px-3 py-2 mb-2 text-xs border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 rounded-xl text-amber-700 dark:text-amber-400">
                  <span className="text-sm material-symbols-outlined">info</span>
                  Showing approximate location — exact address could not be pinpointed on map.
                </div>
              )}
              <LiveMap
                order={order}
                deliveryCoords={deliveryCoords}
                storeCoords={storeCoords}
                riderCoords={riderCoords}
              />
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-5 px-1 mt-3 text-xs text-slate-500">
                {storeCoords && !deliveryCoords.isFallback && <span>🏪 Store</span>}
                {isLive && riderCoords && !deliveryCoords.isFallback && <span>🛵 Rider</span>}
                <span>📍 Your Address</span>
                {isLive && !deliveryCoords.isFallback && (
                  <span className="flex items-center gap-1 ml-auto">
                    <span className="inline-block w-6 border-t-2 border-dashed border-primary" />
                    Route
                  </span>
                )}
              </div>
            </>
          ) : geocoding ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-3xl material-symbols-outlined animate-spin">progress_activity</span>
              <p className="text-sm">Loading map...</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Delivery Partner */}
      {order.deliveryPerson && (
        <div className="p-5 mb-4 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
          <h2 className="mb-4 text-sm font-bold">Your Delivery Partner</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center flex-shrink-0 text-xl font-black rounded-full w-14 h-14 bg-primary/10 text-primary">
              {order.deliveryPerson.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold">{order.deliveryPerson.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-sm material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-xs text-slate-500">4.8 · 230 deliveries</span>
              </div>
            </div>
            <div className="flex gap-2">
              {order.deliveryPerson.phone && (
                <a href={`tel:${order.deliveryPerson.phone}`}
                  className="flex items-center justify-center transition-all w-11 h-11 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl">
                  <span className="text-sm material-symbols-outlined">call</span>
                </a>
              )}
              <a href={`https://wa.me/${(order.deliveryPerson.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                className="flex items-center justify-center transition-all w-11 h-11 bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl">
                <span className="text-sm material-symbols-outlined">chat</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Items + Summary */}
      <div className="p-5 mb-4 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
        <h2 className="mb-4 font-bold">Items Ordered</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-xl">
                <img src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'}
                  alt={item.name} className="object-cover w-full h-full"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'; }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{item.name}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="pt-4 mt-4 space-y-2 text-sm border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between text-slate-500">
            <span>Delivery</span>
            <span className={order.deliveryCharge === 0 ? 'text-emerald-500 font-semibold' : ''}>
              {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span><span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black">
            <span>Total</span>
            <span className="text-primary">₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
        <h2 className="mb-3 text-sm font-bold">Delivery Address</h2>
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-0.5">
            <p className="font-semibold text-slate-800 dark:text-slate-200">{order.address.street}</p>
            <p>{order.address.city}, {order.address.state} — {order.address.zipCode}</p>
            {order.address.phone && (
              <p className="flex items-center gap-1 mt-1">
                <span className="text-xs material-symbols-outlined text-primary">call</span>
                {order.address.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Order Success ─────────────────────────────────────────────────────────────
export const OrderSuccess = () => {
  const { id } = useParams();
  return (
    <div className="max-w-md px-4 py-20 mx-auto text-center">
      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full shadow-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 shadow-emerald-100 dark:shadow-none">
        <span className="text-5xl material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>
      <h1 className="mb-2 text-3xl font-black">Order Placed! 🎉</h1>
      <p className="mb-2 text-slate-500">Your order has been successfully placed.</p>
      <p className="mb-6 text-sm text-slate-400">We'll notify you when it's out for delivery.</p>
      <div className="inline-block px-6 py-3 mb-8 border bg-primary/5 border-primary/20 rounded-xl">
        <p className="text-xs text-slate-500 mb-0.5">Order ID</p>
        <p className="text-lg font-black tracking-widest text-primary">#{id?.slice(-8).toUpperCase()}</p>
      </div>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link to={`/orders/${id}`}
          className="flex items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-all shadow-lg bg-primary rounded-xl hover:bg-primary/90 shadow-primary/20">
          <span className="text-sm material-symbols-outlined">local_shipping</span> Track Order
        </Link>
        <Link to="/"
          className="px-6 py-3 font-bold transition-all border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Orders;

