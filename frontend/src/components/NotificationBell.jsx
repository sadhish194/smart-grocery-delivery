// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';
// import { io } from 'socket.io-client';

// const authH = () => ({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || '') });

// export default function NotificationBell() {
//   const { user } = useAuth();
//   const [notifs, setNotifs]   = useState([]);
//   const [unread, setUnread]   = useState(0);
//   const [open, setOpen]       = useState(false);
//   const panelRef              = useRef(null);

//   // Fetch on mount
//   useEffect(() => {
//     if (!user) return;
//     fetch('/api/features/notifications', { headers: authH() })
//       .then(r => r.json())
//       .then(d => { setNotifs(d.notifications || []); setUnread(d.unread || 0); });
//   }, [user]);

//   // Socket.io real-time
//   useEffect(() => {
//     if (!user) return;
//     const socket = io('http://localhost:5000');
//     socket.emit('join', user._id);
//     socket.on('notification', (n) => {
//       setUnread(u => u + 1);
//       setNotifs(prev => [{ ...n, isRead: false, createdAt: new Date() }, ...prev.slice(0, 29)]);
//     });
//     return () => socket.disconnect();
//   }, [user]);

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   const markAllRead = async () => {
//     await fetch('/api/features/notifications/read-all', { method: 'PUT', headers: authH() });
//     setUnread(0);
//     setNotifs(n => n.map(x => ({ ...x, isRead: true })));
//   };

//   const TYPE_ICONS = { order: 'receipt_long', promo: 'local_offer', flash_sale: 'local_fire_department', loyalty: 'stars', referral: 'card_giftcard', system: 'notifications' };
//   const TYPE_COLORS = { order: 'text-primary', promo: 'text-emerald-500', flash_sale: 'text-orange-500', loyalty: 'text-amber-500', referral: 'text-violet-500', system: 'text-slate-500' };

//   if (!user || user.role !== 'customer') return null;

//   return (
//     <div className="relative" ref={panelRef}>
//       <button onClick={() => setOpen(o => !o)}
//         className="relative p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
//         <span className="material-symbols-outlined" style={{ fontVariationSettings: unread > 0 ? "'FILL' 1" : "'FILL' 0" }}>notifications</span>
//         {unread > 0 && (
//           <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
//             {unread > 9 ? '9+' : unread}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 z-50 overflow-hidden bg-white border shadow-2xl top-12 w-80 dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-700">
//           <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
//             <p className="text-sm font-bold">Notifications</p>
//             {unread > 0 && (
//               <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:underline">Mark all read</button>
//             )}
//           </div>
//           <div className="overflow-y-auto divide-y max-h-80 divide-slate-50 dark:divide-slate-800">
//             {notifs.length === 0 && (
//               <div className="py-10 text-center text-slate-400">
//                 <span className="block mb-2 text-3xl material-symbols-outlined">notifications_none</span>
//                 <p className="text-sm">No notifications yet</p>
//               </div>
//             )}
//             {notifs.map((n, i) => (
//               <div key={i} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}>
//                 <span className={`material-symbols-outlined text-lg flex-shrink-0 mt-0.5 ${TYPE_COLORS[n.type]}`}
//                   style={{ fontVariationSettings: "'FILL' 1" }}>{TYPE_ICONS[n.type] || 'notifications'}</span>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold">{n.title}</p>
//                   <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
//                   <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
//                 </div>
//                 {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../context/AuthContext';

// const authH = () => ({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || '') });

// const TYPE_ICONS  = { order: 'receipt_long', promo: 'local_offer', flash_sale: 'local_fire_department', loyalty: 'stars', referral: 'card_giftcard', system: 'notifications' };
// const TYPE_COLORS = { order: 'text-primary', promo: 'text-emerald-500', flash_sale: 'text-orange-500', loyalty: 'text-amber-500', referral: 'text-violet-500', system: 'text-slate-500' };

// export default function NotificationBell() {
//   const { user } = useAuth();
//   const [notifs, setNotifs] = useState([]);
//   const [unread, setUnread] = useState(0);
//   const [open, setOpen]     = useState(false);
//   const panelRef            = useRef(null);

//   // Fetch on mount
//   useEffect(() => {
//     if (!user) return;
//     fetch('/api/features/notifications', { headers: authH() })
//       .then(r => r.json())
//       .then(d => { setNotifs(d.notifications || []); setUnread(d.unread || 0); });
//   }, [user]);

//   // Socket.io — using dynamic script tag (no npm needed)
//   useEffect(() => {
//     if (!user) return;
//     let socket;
//     const loadSocket = () => {
//       if (window.io) {
//         socket = window.io('http://localhost:5000');
//         socket.emit('join', user._id);
//         socket.on('notification', (n) => {
//           setUnread(u => u + 1);
//           setNotifs(prev => [{ ...n, isRead: false, createdAt: new Date() }, ...prev.slice(0, 29)]);
//           // Browser push notification if permitted
//           if (Notification?.permission === 'granted') {
//             new Notification(n.title, { body: n.message, icon: '/icon-192.png' });
//           }
//         });
//         return;
//       }
//       // Load socket.io script dynamically
//       const script = document.createElement('script');
//       script.src = 'http://localhost:5000/socket.io/socket.io.js';
//       script.onload = loadSocket;
//       document.head.appendChild(script);
//     };
//     loadSocket();
//     return () => { socket?.disconnect(); };
//   }, [user]);

//   // Request browser notification permission
//   useEffect(() => {
//     if (user && 'Notification' in window && Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//   }, [user]);

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   const markAllRead = async () => {
//     await fetch('/api/features/notifications/read-all', { method: 'PUT', headers: authH() });
//     setUnread(0);
//     setNotifs(n => n.map(x => ({ ...x, isRead: true })));
//   };

//   if (!user || user.role !== 'customer') return null;

//   return (
//     <div className="relative" ref={panelRef}>
//       <button onClick={() => setOpen(o => !o)}
//         className="relative p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
//         <span className="material-symbols-outlined"
//           style={{ fontVariationSettings: unread > 0 ? "'FILL' 1" : "'FILL' 0" }}>notifications</span>
//         {unread > 0 && (
//           <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
//             {unread > 9 ? '9+' : unread}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 z-50 overflow-hidden bg-white border shadow-2xl top-12 w-80 dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-700">
//           <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
//             <p className="text-sm font-bold">Notifications</p>
//             <div className="flex items-center gap-3">
//               {unread > 0 && <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:underline">Mark all read</button>}
//               <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">{notifs.length}</span>
//             </div>
//           </div>
//           <div className="overflow-y-auto divide-y max-h-80 divide-slate-50 dark:divide-slate-800">
//             {notifs.length === 0 ? (
//               <div className="py-10 text-center text-slate-400">
//                 <span className="block mb-2 text-3xl material-symbols-outlined">notifications_none</span>
//                 <p className="text-sm">No notifications yet</p>
//                 <p className="mt-1 text-xs">Place an order to get started</p>
//               </div>
//             ) : notifs.map((n, i) => (
//               <div key={i} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-slate-100 dark:bg-slate-800`}>
//                   <span className={`material-symbols-outlined text-sm ${TYPE_COLORS[n.type] || 'text-slate-500'}`}
//                     style={{ fontVariationSettings: "'FILL' 1" }}>
//                     {TYPE_ICONS[n.type] || 'notifications'}
//                   </span>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold leading-tight">{n.title}</p>
//                   <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
//                   <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</p>
//                 </div>
//                 {!n.isRead && <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const authH = () => ({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || '') });

const TYPE_ICONS  = { order: 'receipt_long', promo: 'local_offer', flash_sale: 'local_fire_department', loyalty: 'stars', referral: 'card_giftcard', system: 'notifications' };
const TYPE_COLORS = { order: 'text-primary', promo: 'text-emerald-500', flash_sale: 'text-orange-500', loyalty: 'text-amber-500', referral: 'text-violet-500', system: 'text-slate-500' };

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen]     = useState(false);
  const panelRef            = useRef(null);

  // Fetch on mount
  useEffect(() => {
    if (!user) return;
    fetch('/api/features/notifications', { headers: authH() })
      .then(r => r.json())
      .then(d => { setNotifs(d.notifications || []); setUnread(d.unread || 0); });
  }, [user]);

  // Socket.io — using dynamic script tag (no npm needed)
  useEffect(() => {
    if (!user) return;
    let socket;
    const loadSocket = () => {
      if (window.io) {
        socket = window.io({ path: '/socket.io' });
        socket.emit('join', user._id);
        socket.on('notification', (n) => {
          setUnread(u => u + 1);
          setNotifs(prev => [{ ...n, isRead: false, createdAt: new Date() }, ...prev.slice(0, 29)]);
          if (Notification?.permission === 'granted') {
            new Notification(n.title, { body: n.message, icon: '/icon-192.png' });
          }
        });
        return;
      }
      const script = document.createElement('script');
      script.src = '/socket.io/socket.io.js';
      script.onload = loadSocket;
      document.head.appendChild(script);
    };
    loadSocket();
    return () => { socket?.disconnect(); };
  }, [user]);

  // Request browser notification permission
  useEffect(() => {
    if (user && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    await fetch('/api/features/notifications/read-all', { method: 'PUT', headers: authH() });
    setUnread(0);
    setNotifs(n => n.map(x => ({ ...x, isRead: true })));
  };

  if (!user || user.role !== 'customer') return null;

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={() => setOpen(o => !o)}
        className="relative p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
        <span className="material-symbols-outlined"
          style={{ fontVariationSettings: unread > 0 ? "'FILL' 1" : "'FILL' 0" }}>notifications</span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 overflow-hidden bg-white border shadow-2xl top-12 w-80 dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold">Notifications</p>
            <div className="flex items-center gap-3">
              {unread > 0 && <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:underline">Mark all read</button>}
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">{notifs.length}</span>
            </div>
          </div>
          <div className="overflow-y-auto divide-y max-h-80 divide-slate-50 dark:divide-slate-800">
            {notifs.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <span className="block mb-2 text-3xl material-symbols-outlined">notifications_none</span>
                <p className="text-sm">No notifications yet</p>
                <p className="mt-1 text-xs">Place an order to get started</p>
              </div>
            ) : notifs.map((n, i) => (
              <div key={i} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-slate-100 dark:bg-slate-800`}>
                  <span className={`material-symbols-outlined text-sm ${TYPE_COLORS[n.type] || 'text-slate-500'}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    {TYPE_ICONS[n.type] || 'notifications'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
                {!n.isRead && <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}