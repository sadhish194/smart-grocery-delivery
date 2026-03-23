import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProducts } from '../../services/api';

const authH = () => ({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || '') });
const FREQ  = ['daily','weekly','biweekly','monthly'];
const DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const SLOTS = ['6-9 AM','9-12 PM','12-3 PM','3-6 PM','6-9 PM'];

export default function Subscriptions() {
  const { user } = useAuth();
  const [subs, setSubs]         = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({ items: [], frequency: 'weekly', deliveryDay: 'Mon', timeSlot: '9-12 PM', address: { street:'', city:'', state:'', zipCode:'', phone:'' } });

  useEffect(() => {
    fetch('/api/features/subscriptions', { headers: authH() }).then(r => r.json()).then(setSubs);
  }, []);

  useEffect(() => {
    if (search.length > 1) {
      getProducts({ keyword: search, limit: 8 }).then(({ data }) => setProducts(data.products || []));
    }
  }, [search]);

  const addItem = (product) => {
    if (form.items.find(i => i.product._id === product._id)) return;
    setForm(f => ({ ...f, items: [...f.items, { product, quantity: 1 }] }));
    setSearch(''); setProducts([]);
  };

  const removeItem = (id) => setForm(f => ({ ...f, items: f.items.filter(i => i.product._id !== id) }));

  const submit = async () => {
    if (!form.items.length) return alert('Add at least one product');
    setLoading(true);
    const res = await fetch('/api/features/subscriptions', {
      method: 'POST', headers: authH(),
      body: JSON.stringify({ ...form, items: form.items.map(i => ({ product: i.product._id, quantity: i.quantity })) }),
    });
    const data = await res.json();
    if (res.ok) { setSubs(s => [...s, data]); setShowForm(false); setForm({ items:[], frequency:'weekly', deliveryDay:'Mon', timeSlot:'9-12 PM', address:{street:'',city:'',state:'',zipCode:'',phone:''} }); }
    setLoading(false);
  };

  const toggle = async (id) => {
    const res = await fetch(`/api/features/subscriptions/${id}/toggle`, { method: 'PUT', headers: authH() });
    const data = await res.json();
    setSubs(s => s.map(sub => sub._id === id ? data : sub));
  };

  const cancel = async (id) => {
    await fetch(`/api/features/subscriptions/${id}`, { method: 'DELETE', headers: authH() });
    setSubs(s => s.filter(sub => sub._id !== id));
  };

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Subscriptions</h1>
          <p className="text-sm text-slate-500">Set up recurring deliveries for your essentials</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90">
          <span className="text-sm material-symbols-outlined">add</span> New
        </button>
      </div>

      {/* Existing subscriptions */}
      {subs.length === 0 && !showForm && (
        <div className="py-16 text-center bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
          <span className="block mb-3 text-5xl material-symbols-outlined text-slate-300">autorenew</span>
          <p className="font-semibold text-slate-500">No subscriptions yet</p>
          <p className="text-sm text-slate-400">Set up weekly milk, eggs, or bread deliveries</p>
        </div>
      )}

      {subs.map(sub => (
        <div key={sub._id} className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 ${!sub.isActive ? 'opacity-60' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-bold capitalize">{sub.frequency} Delivery</p>
              <p className="text-sm text-slate-500">Every {sub.deliveryDay} · {sub.timeSlot}</p>
              {sub.nextDelivery && <p className="text-xs text-primary mt-0.5">Next: {new Date(sub.nextDelivery).toLocaleDateString('en-IN')}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggle(sub._id)} className={`px-3 py-1 rounded-full text-xs font-bold ${sub.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {sub.isActive ? 'Active' : 'Paused'}
              </button>
              <button onClick={() => cancel(sub._id)} className="text-red-400 hover:text-red-600">
                <span className="text-sm material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {sub.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl">
                <img src={item.product?.image || ''} className="object-cover w-6 h-6 rounded" onError={e => e.target.style.display='none'} />
                <span className="font-medium">{item.product?.name}</span>
                <span className="text-slate-400">×{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* New subscription form */}
      {showForm && (
        <div className="p-6 space-y-4 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
          <h2 className="font-bold">New Subscription</h2>

          {/* Product search */}
          <div className="relative">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products to add..."
              className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
            {products.length > 0 && (
              <div className="absolute left-0 right-0 z-10 mt-1 overflow-y-auto bg-white border shadow-xl top-full dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl max-h-48">
                {products.map(p => (
                  <button key={p._id} onClick={() => addItem(p)} className="flex items-center w-full gap-3 px-4 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800">
                    <img src={p.image} className="object-cover w-8 h-8 rounded" onError={e => e.target.style.display='none'} />
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-auto text-primary">₹{p.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected items */}
          {form.items.length > 0 && (
            <div className="space-y-2">
              {form.items.map(item => (
                <div key={item.product._id} className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <img src={item.product.image} className="object-cover w-8 h-8 rounded" onError={e => e.target.style.display='none'} />
                  <span className="flex-1 text-sm font-medium">{item.product.name}</span>
                  <input type="number" min="1" max="20" value={item.quantity} onChange={e => setForm(f => ({ ...f, items: f.items.map(i => i.product._id === item.product._id ? { ...i, quantity: +e.target.value } : i) }))}
                    className="py-1 text-sm text-center border rounded-lg w-14 border-slate-200" />
                  <button onClick={() => removeItem(item.product._id)} className="text-red-400 hover:text-red-600"><span className="text-sm material-symbols-outlined">close</span></button>
                </div>
              ))}
            </div>
          )}

          {/* Frequency, day, slot */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">Frequency</label>
              <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                className="w-full px-3 py-2 text-sm capitalize bg-white border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary dark:bg-slate-900">
                {FREQ.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">Delivery Day</label>
              <select value={form.deliveryDay} onChange={e => setForm(f => ({ ...f, deliveryDay: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-white border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary dark:bg-slate-900">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-500">Time Slot</label>
              <select value={form.timeSlot} onChange={e => setForm(f => ({ ...f, timeSlot: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-white border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary dark:bg-slate-900">
                {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-3">
            {[['street','Street / Area'],['city','City'],['state','State'],['zipCode','PIN'],['phone','Phone']].map(([field, label]) => (
              <input key={field} placeholder={label} value={form.address[field]}
                onChange={e => setForm(f => ({ ...f, address: { ...f.address, [field]: e.target.value } }))}
                className="col-span-1 px-3 py-2 text-sm border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary" />
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={submit} disabled={loading} className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60">
              {loading ? 'Creating...' : 'Create Subscription'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-3 text-sm font-bold border rounded-xl border-slate-200">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}