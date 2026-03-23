import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const authHeader = () => ({
  Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || ''),
});

const TIER_STYLES = {
  Bronze:   { bg: 'from-amber-700 to-amber-500',   icon: '🥉', text: 'text-amber-100' },
  Silver:   { bg: 'from-slate-500 to-slate-400',    icon: '🥈', text: 'text-slate-100' },
  Gold:     { bg: 'from-yellow-500 to-amber-400',   icon: '🥇', text: 'text-yellow-100' },
  Platinum: { bg: 'from-purple-700 to-purple-500',  icon: '💎', text: 'text-purple-100' },
};

export default function Loyalty() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/features/loyalty', { headers: authHeader() })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><span className="text-3xl material-symbols-outlined animate-spin text-primary">progress_activity</span></div>;
  if (!data) return null;

  const { user: u, tiers } = data;
  const tier = TIER_STYLES[u?.loyaltyTier] || TIER_STYLES.Bronze;
  const currentTierData = tiers?.find(t => t.name === u?.loyaltyTier);
  const nextTierData = tiers?.find(t => t.min > (u?.totalEarned || 0));
  const progress = currentTierData && nextTierData
    ? Math.min(100, ((u.totalEarned - currentTierData.min) / (nextTierData.min - currentTierData.min)) * 100)
    : 100;

  return (
    <div className="max-w-3xl px-4 py-8 mx-auto space-y-6">
      <h1 className="text-2xl font-black">Loyalty Rewards</h1>

      {/* Tier card */}
      <div className={`bg-gradient-to-br ${tier.bg} rounded-3xl p-7 text-white shadow-xl`}>
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-semibold ${tier.text} opacity-80`}>Current Tier</p>
            <h2 className="mt-1 text-3xl font-black">{tier.icon} {u?.loyaltyTier}</h2>
            <p className={`text-5xl font-black mt-4 ${tier.text}`}>{u?.loyaltyPoints?.toLocaleString()}</p>
            <p className={`text-sm ${tier.text} opacity-80 mt-1`}>Available Points</p>
          </div>
          <div className="text-right">
            <p className={`text-sm ${tier.text} opacity-80`}>Lifetime Earned</p>
            <p className="text-2xl font-black">{u?.totalEarned?.toLocaleString()}</p>
            <p className={`text-xs ${tier.text} opacity-60 mt-1`}>10 pts = ₹1 discount</p>
          </div>
        </div>

        {nextTierData && (
          <div className="mt-6">
            <div className="flex justify-between text-xs opacity-80 mb-1.5">
              <span>{u?.loyaltyTier}</span>
              <span>{nextTierData.min - u?.totalEarned} pts to {nextTierData.name}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full transition-all duration-700 bg-white rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiers?.map(t => {
          const ts = TIER_STYLES[t.name];
          const isActive = u?.loyaltyTier === t.name;
          return (
            <div key={t.name} className={`rounded-2xl p-4 border-2 transition-all ${isActive ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
              <p className="mb-2 text-2xl">{ts.icon}</p>
              <p className="text-sm font-black">{t.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.min.toLocaleString()}+ pts</p>
              <ul className="mt-3 space-y-1">
                {t.perks.map(p => (
                  <li key={p} className="flex items-start gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-emerald-500 text-xs mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {p}
                  </li>
                ))}
              </ul>
              {isActive && <span className="mt-2 inline-block text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">Current</span>}
            </div>
          );
        })}
      </div>

      {/* How to earn */}
      <div className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
        <h3 className="mb-4 font-black">How to Earn Points</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: 'shopping_cart', label: 'Place an Order', pts: '1 pt per ₹10 spent', color: 'text-primary bg-primary/10' },
            { icon: 'card_giftcard', label: 'Refer a Friend', pts: '+200 points', color: 'text-emerald-500 bg-emerald-50' },
            { icon: 'star', label: 'Write a Review', pts: '+50 points', color: 'text-yellow-500 bg-yellow-50' },
            { icon: 'cake', label: 'Birthday Bonus', pts: '+100 points', color: 'text-pink-500 bg-pink-50' },
          ].map(e => (
            <div key={e.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${e.color}`}>
                <span className="text-sm material-symbols-outlined">{e.icon}</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{e.label}</p>
                <p className="text-xs font-bold text-primary">{e.pts}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}