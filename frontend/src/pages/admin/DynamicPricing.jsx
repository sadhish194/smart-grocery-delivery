import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = (path, opts = {}) => fetch(`/api${path}`, {
  ...opts,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user') || '{}')?.token}`,
    ...opts.headers,
  },
}).then(r => r.json());

const CATEGORIES = ['Fruits & Vegetables','Bakery, Cakes & Dairy','Beverages','Beauty & Hygiene','Cleaning & Household','Eggs, Meat & Fish','Foodgrains, Oil & Masala','Gourmet & World Food','Kitchen, Garden & Pets','Snacks & Branded Foods','Baby Care'];

const TrendBadge = ({ pct }) => {
  if (!pct) return <span className="text-xs text-slate-400">—</span>;
  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full
      ${up ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
      <span className="text-xs material-symbols-outlined">{up ? 'trending_up' : 'trending_down'}</span>
      {up ? '+' : ''}{pct?.toFixed(1)}%
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    green:   'bg-emerald-100 text-emerald-600',
    red:     'bg-red-100 text-red-600',
    orange:  'bg-amber-100 text-amber-600',
  };
  return (
    <div className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <span className="text-lg material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
};

export default function DynamicPricing() {
  const [status, setStatus]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [running, setRunning]   = useState(false);
  const [runCat, setRunCat]     = useState('');
  const [catToggles, setCatToggles] = useState({});
  const [toast, setToast]       = useState('');
  const [lastRun, setLastRun]   = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadStatus = async () => {
    try {
      const data = await API('/pricing/status');
      setStatus(data);
    } catch (_) {}
    finally { setLoading(false); }
  };

  useEffect(() => { loadStatus(); }, []);

  const handleRunPricing = async () => {
    setRunning(true);
    try {
      const result = await API('/pricing/run', {
        method: 'POST',
        body: JSON.stringify({ category: runCat || null }),
      });
      setLastRun(result);
      showToast(`✅ Updated ${result.updated} prices in ${result.elapsed}s`);
      loadStatus();
    } catch (_) {
      showToast('❌ Pricing update failed');
    } finally { setRunning(false); }
  };

  const handleToggleCategory = async (category, enabled) => {
    setCatToggles(t => ({ ...t, [category]: true }));
    try {
      await API('/pricing/toggle-category', {
        method: 'PUT',
        body: JSON.stringify({ category, enabled }),
      });
      showToast(`${enabled ? '✅ Enabled' : '⏸ Disabled'} dynamic pricing for ${category}`);
    } catch (_) {}
    finally { setCatToggles(t => ({ ...t, [category]: false })); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 p-8">
      <span className="text-4xl material-symbols-outlined animate-spin text-primary">progress_activity</span>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed z-50 px-5 py-3 text-sm font-semibold text-white shadow-xl top-5 right-5 bg-slate-900 rounded-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black">
            <span className="material-symbols-outlined text-primary">auto_graph</span>
            Dynamic Pricing
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Prices auto-adjust based on demand, stock, season & market data
          </p>
        </div>
        {/* Manual trigger */}
        <div className="flex items-center gap-3">
          <select value={runCat} onChange={e => setRunCat(e.target.value)}
            className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-slate-900 outline-none">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={handleRunPricing} disabled={running}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center gap-2 shadow-lg shadow-primary/25 transition-all">
            {running
              ? <span className="text-sm material-symbols-outlined animate-spin">progress_activity</span>
              : <span className="text-sm material-symbols-outlined">play_arrow</span>}
            {running ? 'Updating...' : 'Run Now'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        <StatCard icon="inventory_2" label="Total Products" value={status?.total?.toLocaleString()} color="primary" />
        <StatCard icon="auto_awesome" label="Pricing Enabled" value={status?.enabled?.toLocaleString()} color="green" />
        <StatCard icon="update" label="Updated (6h)" value={status?.recentlyUpdated?.toLocaleString()} color="primary" />
        <StatCard icon="trending_up" label="Prices Rising" value={status?.risingCount?.toLocaleString()} color="red" sub="Above base price" />
        <StatCard icon="trending_down" label="Prices Falling" value={status?.fallingCount?.toLocaleString()} color="green" sub="Below base price" />
      </div>

      {/* Last run result */}
      {lastRun && (
        <div className="flex items-center gap-4 p-5 border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 rounded-2xl">
          <span className="text-3xl material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <div>
            <p className="font-bold text-emerald-800 dark:text-emerald-200">Last Update Successful</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {lastRun.updated} prices updated · {lastRun.skipped} unchanged · took {lastRun.elapsed}s
              {lastRun.marketData && ` · Inflation factor: ${lastRun.marketData.inflationFactor?.toFixed(3)}`}
            </p>
          </div>
        </div>
      )}

      {/* 2-col: Rising / Falling */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top Rising */}
        <div className="bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm text-red-500 material-symbols-outlined">trending_up</span>
            <h2 className="text-sm font-bold">Top Rising Prices</h2>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {(status?.topRising || []).map(p => (
              <div key={p._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.category}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-black">₹{p.price?.toFixed(0)}</p>
                  <p className="text-xs line-through text-slate-400">₹{p.basePrice?.toFixed(0)}</p>
                </div>
                <TrendBadge pct={p.priceChangePercent} />
              </div>
            ))}
            {!status?.topRising?.length && (
              <p className="py-8 text-sm text-center text-slate-400">No data yet — run pricing update</p>
            )}
          </div>
        </div>

        {/* Top Falling */}
        <div className="bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm material-symbols-outlined text-emerald-500">trending_down</span>
            <h2 className="text-sm font-bold">Top Falling Prices</h2>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {(status?.topFalling || []).map(p => (
              <div key={p._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.category}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-black">₹{p.price?.toFixed(0)}</p>
                  <p className="text-xs line-through text-slate-400">₹{p.basePrice?.toFixed(0)}</p>
                </div>
                <TrendBadge pct={p.priceChangePercent} />
              </div>
            ))}
            {!status?.topFalling?.length && (
              <p className="py-8 text-sm text-center text-slate-400">No data yet — run pricing update</p>
            )}
          </div>
        </div>
      </div>

      {/* Category controls */}
      <div className="bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold">Category Controls</h2>
          <p className="text-xs text-slate-400 mt-0.5">Enable or disable dynamic pricing per category</p>
        </div>
        <div className="grid grid-cols-2 gap-0 divide-x divide-y md:grid-cols-3 lg:grid-cols-4 divide-slate-50 dark:divide-slate-800">
          {CATEGORIES.map(cat => {
            const volatility = {
              'Vegetables': 'High', 'Fruits': 'High', 'Seafood': 'High',
              'Meat': 'Medium', 'Bakery': 'Medium', 'Dairy': 'Low',
              'Beverages': 'Low', 'Snacks': 'Low', 'Frozen': 'Low',
              'Pantry': 'Low', 'Personal Care': 'Very Low', 'Household': 'Very Low',
            }[cat];
            const volColor = { 'High': 'text-red-500', 'Medium': 'text-amber-500', 'Low': 'text-emerald-500', 'Very Low': 'text-slate-400' }[volatility];
            return (
              <div key={cat} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-semibold">{cat}</p>
                  <p className={`text-xs font-medium ${volColor}`}>{volatility} volatility</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleToggleCategory(cat, true)} disabled={catToggles[cat]}
                    className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                    title="Enable">
                    <span className="text-sm material-symbols-outlined">play_arrow</span>
                  </button>
                  <button onClick={() => handleToggleCategory(cat, false)} disabled={catToggles[cat]}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-500 hover:text-white transition-all disabled:opacity-50"
                    title="Disable">
                    <span className="text-sm material-symbols-outlined">pause</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="p-6 border bg-primary/5 border-primary/15 rounded-2xl">
        <h3 className="flex items-center gap-2 mb-4 font-bold text-primary">
          <span className="text-sm material-symbols-outlined">info</span>
          How Dynamic Pricing Works
        </h3>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: 'sunny', label: 'Seasonal', desc: 'Monsoon raises veggie prices. Mango season = cheaper mangoes.' },
            { icon: 'bar_chart', label: 'Demand', desc: 'High views & cart adds → price rises. Low interest → discount.' },
            { icon: 'inventory', label: 'Stock Level', desc: 'Low stock (≤15 units) → +10-18%. Overstock (200+) → -7%.' },
            { icon: 'currency_rupee', label: 'Market Data', desc: 'USD/INR exchange rate used as inflation pressure proxy.' },
            { icon: 'schedule', label: 'Time of Day', desc: 'Morning fresh discount (-3%). Evening clearance deals (-6%).' },
          ].map(f => (
            <div key={f.label} className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm material-symbols-outlined text-primary">{f.icon}</span>
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200">{f.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 mt-4 text-xs border-t border-primary/10 text-slate-500">
          <span className="font-semibold">Auto-schedule:</span> Vegetables, Fruits & Seafood update every <span className="font-semibold">30 minutes</span>. All categories update every <span className="font-semibold">6 hours</span>. Prices never exceed 150% or fall below 70% of base price.
        </div>
      </div>
    </div>
  );
}