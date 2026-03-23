import { useState, useEffect } from 'react';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || ''),
});

export default function Referral() {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/features/referral', { headers: authHeader() })
      .then(r => r.json()).then(setData);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(data?.user?.referralCode || '');
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(data?.referralLink || '');
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`Hey! Use my referral code *${data?.user?.referralCode}* on SmartGrocery and get ₹50 off your first order! 🛒\n\n${data?.referralLink}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  if (!data) return <div className="flex justify-center py-20"><span className="text-3xl material-symbols-outlined animate-spin text-primary">progress_activity</span></div>;

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto space-y-6">
      <h1 className="text-2xl font-black">Refer & Earn</h1>

      {/* Hero card */}
      <div className="text-white bg-gradient-to-br from-primary to-purple-700 rounded-3xl p-7">
        <div className="mb-6 text-center">
          <p className="mb-3 text-5xl">🎁</p>
          <h2 className="text-2xl font-black">Invite Friends, Earn Rewards</h2>
          <p className="mt-2 text-sm text-white/80">You earn <strong>200 points (₹20)</strong> for every friend who signs up</p>
        </div>

        {/* Referral code */}
        <div className="p-4 bg-white/10 rounded-2xl">
          <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-white/70">Your Referral Code</p>
          <div className="flex items-center gap-3">
            <p className="flex-1 text-3xl font-black tracking-widest">{data.user?.referralCode}</p>
            <button onClick={copyCode}
              className="bg-white text-primary font-bold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-all flex items-center gap-1.5">
              <span className="text-sm material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex gap-3 mt-4">
          <button onClick={shareWhatsApp}
            className="flex items-center justify-center flex-1 gap-2 py-3 text-sm font-bold text-white transition-all bg-emerald-500 hover:bg-emerald-600 rounded-xl">
            <span className="text-sm material-symbols-outlined">share</span> Share on WhatsApp
          </button>
          <button onClick={copyLink}
            className="flex items-center justify-center flex-1 gap-2 py-3 text-sm font-bold text-white transition-all bg-white/20 hover:bg-white/30 rounded-xl">
            <span className="text-sm material-symbols-outlined">link</span> Copy Link
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: 'group', label: 'Friends Referred', value: data.user?.referralCount || 0, color: 'text-primary' },
          { icon: 'currency_rupee', label: 'Points Earned', value: data.user?.referralEarnings || 0, color: 'text-emerald-500' },
          { icon: 'redeem', label: 'Worth', value: `₹${Math.floor((data.user?.referralEarnings || 0) / 10)}`, color: 'text-amber-500' },
        ].map(s => (
          <div key={s.label} className="p-4 text-center bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
            <p className="mt-1 text-2xl font-black">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
        <h3 className="mb-4 font-black">How it Works</h3>
        <div className="space-y-4">
          {[
            { n: '1', icon: 'share', label: 'Share your code', desc: 'Send your referral code to friends & family' },
            { n: '2', icon: 'person_add', label: 'They sign up', desc: 'Your friend registers using your code' },
            { n: '3', icon: 'star', label: 'Both earn rewards', desc: 'You get 200 points, they get ₹50 off their first order' },
          ].map(s => (
            <div key={s.n} className="flex items-start gap-4">
              <div className="flex items-center justify-center flex-shrink-0 text-sm font-black text-white w-9 h-9 bg-primary rounded-xl">{s.n}</div>
              <div>
                <p className="text-sm font-bold">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Friends list */}
      {data.referred?.length > 0 && (
        <div className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
          <h3 className="mb-4 font-black">Friends You Referred ({data.referred.length})</h3>
          <div className="space-y-3">
            {data.referred.map(f => (
              <div key={f._id} className="flex items-center gap-3">
                <div className="flex items-center justify-center text-sm font-black rounded-full w-9 h-9 bg-primary/10 text-primary">
                  {f.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{f.name}</p>
                  <p className="text-xs text-slate-400">Joined {new Date(f.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">+200 pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}