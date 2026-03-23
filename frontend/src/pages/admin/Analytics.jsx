import { useState, useEffect } from 'react';

const authHeader = () => ({
  Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || ''),
});

const StatCard = ({ icon, label, value, sub, color = 'text-primary' }) => (
  <div className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-black">{value}</p>
        {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
      </div>
      <span className={`material-symbols-outlined text-2xl ${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
    </div>
  </div>
);

const SimpleBarChart = ({ data, color = '#6e3dff' }) => {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex items-end h-32 gap-1">
      {data.map((d, i) => (
        <div key={i} className="relative flex flex-col items-center flex-1 gap-1 group">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10">
            ₹{d.revenue.toLocaleString()}
          </div>
          <div className="w-full transition-all rounded-t-sm hover:opacity-80"
            style={{ height: `${Math.max(4, (d.revenue / max) * 112)}px`, background: color }} />
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/features/analytics?period=${period}`, { headers: authHeader() })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Sales Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500">Real-time business performance insights</p>
        </div>
        <div className="flex gap-2">
          {[['7','7 Days'],['30','30 Days'],['90','3 Months']].map(([v, l]) => (
            <button key={v} onClick={() => setPeriod(v)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${period === v ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-primary/40'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="text-3xl material-symbols-outlined animate-spin text-primary">progress_activity</span></div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon="currency_rupee" label="Revenue" value={`₹${data.summary.totalRevenue.toLocaleString()}`} sub={`All time: ₹${data.summary.allTimeRevenue.toLocaleString()}`} color="text-primary" />
            <StatCard icon="receipt_long" label="Orders" value={data.summary.totalOrders} sub={`Avg ₹${data.summary.avgOrderValue}/order`} color="text-blue-500" />
            <StatCard icon="person_add" label="New Customers" value={data.summary.newCustomers} color="text-emerald-500" />
            <StatCard icon="inventory_2" label="Active Products" value={data.summary.totalProducts.toLocaleString()} color="text-amber-500" />
          </div>

          {/* Revenue Chart */}
          <div className="p-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <h2 className="mb-6 font-black">Revenue Over Time</h2>
            <SimpleBarChart data={data.revenueByDay} />
            <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
              <span>{data.revenueByDay?.[0]?.date}</span>
              <span>{data.revenueByDay?.[data.revenueByDay.length - 1]?.date}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Products */}
            <div className="p-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
              <h2 className="mb-4 font-black">Top Products by Revenue</h2>
              <div className="space-y-3">
                {data.topProducts?.map((p, i) => {
                  const maxRev = data.topProducts[0]?.revenue || 1;
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 text-xs font-black rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold truncate">{p.name}</p>
                          <p className="flex-shrink-0 ml-2 text-sm font-black text-primary">₹{p.revenue.toLocaleString()}</p>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${(p.revenue / maxRev) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Status + Payment */}
            <div className="space-y-4">
              <div className="p-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
                <h2 className="mb-4 font-black">Order Status Breakdown</h2>
                <div className="space-y-2">
                  {data.statusCounts?.map(s => (
                    <div key={s._id} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                      <span className="text-sm font-medium">{s._id}</span>
                      <span className="text-sm font-black text-primary">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
                <h2 className="mb-4 font-black">Payment Methods</h2>
                <div className="space-y-2">
                  {data.paymentBreakdown?.map(p => (
                    <div key={p._id} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                      <span className="text-sm font-medium">{p._id || 'Unknown'}</span>
                      <div className="text-right">
                        <span className="text-sm font-black text-primary">{p.count} orders</span>
                        <span className="ml-2 text-xs text-slate-400">₹{Math.round(p.revenue).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}