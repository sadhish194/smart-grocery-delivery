import { useState, useEffect } from 'react';
import { getCoupons, createCoupon } from '../../services/api';
import { Loader } from '../../components/SharedComponents';

const BLANK = { code: '', discount: '', discountType: 'percentage', minOrderAmount: '', maxDiscount: '', usageLimit: '100', expiresAt: '' };

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const load = () => getCoupons().then(r => setCoupons(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await createCoupon({ ...form, discount: Number(form.discount), minOrderAmount: Number(form.minOrderAmount) || 0, maxDiscount: Number(form.maxDiscount) || 0, usageLimit: Number(form.usageLimit) });
      setShowModal(false); setForm(BLANK); load();
    } catch (err) { alert(err.response?.data?.message || 'Failed to create coupon'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Coupons</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> New Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.length === 0 ? (
          <p className="text-slate-400 col-span-full text-center py-12">No coupons yet. Create one!</p>
        ) : coupons.map(c => {
          const expired = new Date() > new Date(c.expiresAt);
          return (
            <div key={c._id} className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 ${expired ? 'border-red-200 dark:border-red-900 opacity-60' : 'border-slate-100 dark:border-slate-800'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="bg-primary/10 rounded-xl px-3 py-1.5">
                  <p className="font-black text-primary tracking-widest text-lg">{c.code}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${expired ? 'bg-red-100 text-red-600' : c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {expired ? 'Expired' : c.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-2xl font-black mb-1">
                {c.discountType === 'percentage' ? `${c.discount}% OFF` : `₹${c.discount} OFF`}
              </p>
              <div className="space-y-1 text-xs text-slate-500 mt-3">
                {c.minOrderAmount > 0 && <p>Min order: ₹{c.minOrderAmount}</p>}
                {c.maxDiscount > 0 && <p>Max discount: ₹{c.maxDiscount}</p>}
                <p>Used: {c.usedCount}/{c.usageLimit}</p>
                <p>Expires: {new Date(c.expiresAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="mt-3 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-black text-lg">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Coupon Code *</label>
                  <input required value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} placeholder="e.g. SAVE20"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none uppercase tracking-widest font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Discount *</label>
                  <input required type="number" value={form.discount} onChange={e => setForm(f => ({...f, discount: e.target.value}))}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Type</label>
                  <select value={form.discountType} onChange={e => setForm(f => ({...f, discountType: e.target.value}))}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                {[
                  { key: 'minOrderAmount', label: 'Min Order (₹)' },
                  { key: 'maxDiscount', label: 'Max Discount (₹)' },
                  { key: 'usageLimit', label: 'Usage Limit' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{f.label}</label>
                    <input type="number" value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Expiry Date *</label>
                  <input required type="date" value={form.expiresAt} onChange={e => setForm(f => ({...f, expiresAt: e.target.value}))}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 dark:border-slate-700 py-2.5 rounded-xl font-bold text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
