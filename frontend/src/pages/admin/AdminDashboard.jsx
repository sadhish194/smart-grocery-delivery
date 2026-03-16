import { useState, useEffect } from 'react';
import { getAnalytics } from '../../services/api';
import { DashboardCard, Loader, StatusBadge } from '../../components/SharedComponents';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" />;

  const statusCount = (status) => stats?.statusCounts?.find(s => s._id === status)?.count || 0;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard icon="shopping_cart" label="Total Orders" value={stats?.totalOrders || 0} color="primary" />
        <DashboardCard icon="currency_rupee" label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} color="green" />
        <DashboardCard icon="group" label="Customers" value={stats?.totalUsers || 0} color="blue" />
        <DashboardCard icon="inventory_2" label="Products" value={stats?.totalProducts || 0} color="orange" />
      </div>

      {/* Order Status */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { status: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: 'hourglass_empty' },
          { status: 'Assigned', color: 'bg-blue-100 text-blue-700', icon: 'person_pin' },
          { status: 'Accepted', color: 'bg-indigo-100 text-indigo-700', icon: 'thumb_up' },
          { status: 'OutForDelivery', color: 'bg-orange-100 text-orange-700', icon: 'local_shipping' },
          { status: 'Delivered', color: 'bg-green-100 text-green-700', icon: 'task_alt' },
        ].map(s => (
          <div key={s.status} className={`rounded-2xl p-4 ${s.color} flex flex-col items-center gap-2`}>
            <span className="material-symbols-outlined text-2xl">{s.icon}</span>
            <p className="text-2xl font-black">{statusCount(s.status)}</p>
            <p className="text-xs font-semibold text-center">{s.status === 'OutForDelivery' ? 'Out for Delivery' : s.status}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-bold">Recent Orders</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats?.recentOrders?.map(order => (
              <div key={order._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-slate-500">{order.user?.name}</p>
                </div>
                <StatusBadge status={order.orderStatus} />
                <p className="font-bold text-primary text-sm">₹{order.totalPrice?.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold">Top Selling Products</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats?.topProducts?.map((p, i) => (
              <div key={p._id} className="p-4 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <p className="font-semibold text-sm flex-1">{p.name}</p>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{p.totalSold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
