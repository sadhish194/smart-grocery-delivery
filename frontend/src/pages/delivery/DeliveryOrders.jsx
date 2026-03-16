import { useState, useEffect } from 'react';
import { getAssignedOrders, getCompletedDeliveries, acceptOrder, outForDelivery, markDelivered } from '../../services/api';
import { Loader, StatusBadge } from '../../components/SharedComponents';

const OrderCard = ({ order, onAction, actionLoading }) => {
  const { orderStatus } = order;

  const getNextAction = () => {
    if (orderStatus === 'Assigned') return { label: 'Accept Order', fn: 'accept', color: 'bg-primary text-white', icon: 'thumb_up' };
    if (orderStatus === 'Accepted') return { label: 'Start Delivery', fn: 'outForDelivery', color: 'bg-orange-500 text-white', icon: 'local_shipping' };
    if (orderStatus === 'OutForDelivery') return { label: 'Mark Delivered', fn: 'delivered', color: 'bg-emerald-500 text-white', icon: 'task_alt' };
    return null;
  };

  const action = getNextAction();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4 space-y-2">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-sm text-primary mt-0.5">person</span>
          <div>
            <p className="font-semibold text-sm">{order.user?.name}</p>
            <p className="text-xs text-slate-500">{order.user?.phone}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-sm text-primary mt-0.5">location_on</span>
          <div>
            <p className="text-sm">{order.address?.street}</p>
            <p className="text-xs text-slate-500">{order.address?.city}, {order.address?.state} - {order.address?.zipCode}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{order.items?.length} items</p>
        <p className="font-black text-primary text-lg">₹{order.totalPrice?.toFixed(0)}</p>
      </div>

      {action && (
        <button onClick={() => onAction(order._id, action.fn)} disabled={actionLoading[order._id]}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${action.color}`}>
          {actionLoading[order._id]
            ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            : <span className="material-symbols-outlined text-sm">{action.icon}</span>}
          {action.label}
        </button>
      )}
    </div>
  );
};

export const AssignedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const load = () => getAssignedOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAction = async (orderId, action) => {
    setActionLoading(a => ({...a, [orderId]: true}));
    try {
      if (action === 'accept') await acceptOrder(orderId);
      else if (action === 'outForDelivery') await outForDelivery(orderId);
      else if (action === 'delivered') await markDelivered(orderId);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally { setActionLoading(a => ({...a, [orderId]: false})); }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6">My Deliveries</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <span className="material-symbols-outlined text-5xl mb-3">local_shipping</span>
          <p className="font-semibold">No active orders</p>
          <p className="text-sm">You have no assigned deliveries right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} onAction={handleAction} actionLoading={actionLoading} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CompletedDeliveries = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompletedDeliveries().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6">Completed Deliveries</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <span className="material-symbols-outlined text-5xl mb-3">task_alt</span>
          <p className="font-semibold">No completed deliveries yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-slate-500">{order.user?.name}</p>
                </div>
                <StatusBadge status="Delivered" />
              </div>
              <p className="text-sm text-slate-500">{order.address?.city}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-slate-400">{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-IN') : '—'}</p>
                <p className="font-black text-primary">₹{order.totalPrice?.toFixed(0)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
