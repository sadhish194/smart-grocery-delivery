import { useState, useEffect } from 'react';
import { getAllOrders, assignDeliveryPerson, getDeliveryPersons, cancelOrderAdmin } from '../../services/api';
import { Loader, StatusBadge } from '../../components/SharedComponents';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [assigning, setAssigning] = useState({});
  const [selectedDP, setSelectedDP] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const [oRes, dpRes] = await Promise.all([getAllOrders({ status: filter || undefined }), getDeliveryPersons()]);
      setOrders(oRes.data.orders);
      setDeliveryPersons(dpRes.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleAssign = async (orderId) => {
    if (!selectedDP[orderId]) return;
    setAssigning(a => ({...a, [orderId]: true}));
    try {
      await assignDeliveryPerson(orderId, { deliveryPersonId: selectedDP[orderId] });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Assignment failed');
    } finally { setAssigning(a => ({...a, [orderId]: false})); }
  };

  const handleCancel = async (orderId) => {
    if (!confirm('Cancel this order?')) return;
    try { await cancelOrderAdmin(orderId); load(); } catch {}
  };

  const STATUS_FILTERS = ['', 'Pending', 'Assigned', 'Accepted', 'OutForDelivery', 'Delivered', 'Cancelled'];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Manage Orders</h1>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
              <p>No orders found</p>
            </div>
          ) : orders.map(order => (
            <div key={order._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                  <p className="text-sm font-semibold mt-1">{order.user?.name} · {order.user?.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.orderStatus} />
                  <p className="font-black text-primary">₹{order.totalPrice?.toFixed(0)}</p>
                </div>
              </div>

              <div className="text-xs text-slate-500 mb-3">
                {order.items?.length} items · {order.address?.city}, {order.address?.state}
              </div>

              {order.deliveryPerson ? (
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">local_shipping</span>
                  Assigned to <strong>{order.deliveryPerson.name}</strong>
                </p>
              ) : ['Pending'].includes(order.orderStatus) ? (
                <div className="flex items-center gap-3 mt-2">
                  <select value={selectedDP[order._id] || ''} onChange={e => setSelectedDP(s => ({...s, [order._id]: e.target.value}))}
                    className="flex-1 text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-800 outline-none">
                    <option value="">Select Delivery Person</option>
                    {deliveryPersons.map(dp => <option key={dp._id} value={dp._id}>{dp.name} — {dp.phone}</option>)}
                  </select>
                  <button onClick={() => handleAssign(order._id)} disabled={assigning[order._id] || !selectedDP[order._id]}
                    className="bg-primary text-white text-sm px-4 py-2 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-all">
                    {assigning[order._id] ? 'Assigning...' : 'Assign'}
                  </button>
                  <button onClick={() => handleCancel(order._id)} className="text-red-500 border border-red-200 text-sm px-3 py-2 rounded-xl hover:bg-red-50 transition-all">Cancel</button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
