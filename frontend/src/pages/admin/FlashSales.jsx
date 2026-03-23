// import { useState, useEffect } from 'react';

// const authH = () => ({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || '') });

// const toLocal = (d) => d ? new Date(d).toISOString().slice(0,16) : '';
// const isActive = (s) => new Date() >= new Date(s.startTime) && new Date() <= new Date(s.endTime) && s.isActive;
// const timeLeft = (endTime) => {
//   const diff = new Date(endTime) - new Date();
//   if (diff <= 0) return 'Ended';
//   const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
//   return `${h}h ${m}m left`;
// };

// export default function FlashSales() {
//   const [sales, setSales]       = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading]   = useState(false);
//   const [form, setForm] = useState({ title:'', description:'', discount:20, startTime:'', endTime:'', categories:[], isActive:true, bannerColor:'#6e3dff' });

//   const CATEGORIES = ['Fruits & Vegetables','Bakery, Cakes & Dairy','Beverages','Beauty & Hygiene','Cleaning & Household','Eggs, Meat & Fish','Foodgrains, Oil & Masala','Gourmet & World Food','Snacks & Branded Foods','Baby Care','Kitchen, Garden & Pets'];

//   useEffect(() => { fetch('/api/features/flash-sales', { headers: authH() }).then(r => r.json()).then(setSales); }, []);

//   const submit = async () => {
//     if (!form.title || !form.startTime || !form.endTime) return alert('Fill all required fields');
//     setLoading(true);
//     const res = await fetch('/api/features/flash-sales', { method: 'POST', headers: authH(), body: JSON.stringify(form) });
//     const data = await res.json();
//     if (res.ok) { setSales(s => [data, ...s]); setShowForm(false); }
//     setLoading(false);
//   };

//   const deleteSale = async (id) => {
//     await fetch(`/api/features/flash-sales/${id}`, { method: 'DELETE', headers: authH() });
//     setSales(s => s.filter(x => x._id !== id));
//   };

//   const toggleCat = (cat) => setForm(f => ({
//     ...f, categories: f.categories.includes(cat) ? f.categories.filter(c => c !== cat) : [...f.categories, cat]
//   }));

//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="flex items-center gap-2 text-2xl font-black"><span className="text-orange-500 material-symbols-outlined">local_fire_department</span> Flash Sales</h1>
//           <p className="mt-1 text-sm text-slate-500">Create time-limited deals with countdown timers</p>
//         </div>
//         <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90">
//           <span className="text-sm material-symbols-outlined">add</span> New Flash Sale
//         </button>
//       </div>

//       {/* Sales list */}
//       <div className="space-y-4">
//         {sales.map(sale => (
//           <div key={sale._id} className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center justify-center w-12 h-12 text-lg font-black text-white rounded-xl" style={{ backgroundColor: sale.bannerColor }}>
//                   {sale.discount}%
//                 </div>
//                 <div>
//                   <p className="font-bold">{sale.title}</p>
//                   <p className="text-sm text-slate-500">{sale.description}</p>
//                   <p className="text-xs text-slate-400 mt-0.5">
//                     {new Date(sale.startTime).toLocaleString('en-IN')} → {new Date(sale.endTime).toLocaleString('en-IN')}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 {isActive(sale) ? (
//                   <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
//                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
//                     Live · {timeLeft(sale.endTime)}
//                   </span>
//                 ) : new Date() < new Date(sale.startTime) ? (
//                   <span className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">Scheduled</span>
//                 ) : (
//                   <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-500">Ended</span>
//                 )}
//                 <button onClick={() => deleteSale(sale._id)} className="p-1 text-red-400 hover:text-red-600">
//                   <span className="text-sm material-symbols-outlined">delete</span>
//                 </button>
//               </div>
//             </div>
//             {sale.categories?.length > 0 && (
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {sale.categories.map(c => <span key={c} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{c}</span>)}
//               </div>
//             )}
//           </div>
//         ))}
//         {!sales.length && <p className="py-12 text-center bg-white border text-slate-400 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">No flash sales yet</p>}
//       </div>

//       {/* Create form */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-black">New Flash Sale</h2>
//               <button onClick={() => setShowForm(false)}><span className="material-symbols-outlined">close</span></button>
//             </div>
//             {[['title','Title *','text'],['description','Description','text']].map(([f, p, t]) => (
//               <input key={f} type={t} placeholder={p} value={form[f]} onChange={e => setForm(x => ({ ...x, [f]: e.target.value }))}
//                 className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
//             ))}
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block mb-1 text-xs font-bold text-slate-500">Discount %</label>
//                 <input type="number" min="1" max="90" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: +e.target.value }))}
//                   className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
//               </div>
//               <div>
//                 <label className="block mb-1 text-xs font-bold text-slate-500">Banner Color</label>
//                 <div className="flex gap-2">
//                   <input type="color" value={form.bannerColor} onChange={e => setForm(f => ({ ...f, bannerColor: e.target.value }))} className="w-12 h-10 border-2 rounded-lg border-slate-200" />
//                   <input value={form.bannerColor} onChange={e => setForm(f => ({ ...f, bannerColor: e.target.value }))} className="flex-1 px-3 py-2 text-sm border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl" />
//                 </div>
//               </div>
//               <div>
//                 <label className="block mb-1 text-xs font-bold text-slate-500">Start Time *</label>
//                 <input type="datetime-local" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
//                   className="w-full px-3 py-2 text-sm border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary" />
//               </div>
//               <div>
//                 <label className="block mb-1 text-xs font-bold text-slate-500">End Time *</label>
//                 <input type="datetime-local" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
//                   className="w-full px-3 py-2 text-sm border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary" />
//               </div>
//             </div>
//             <div>
//               <label className="block mb-2 text-xs font-bold text-slate-500">Apply to Categories</label>
//               <div className="flex flex-wrap gap-2">
//                 {CATEGORIES.map(c => (
//                   <button key={c} onClick={() => toggleCat(c)} className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${form.categories.includes(c) ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>{c}</button>
//                 ))}
//               </div>
//             </div>
//             <div className="flex gap-3 pt-2">
//               <button onClick={submit} disabled={loading} className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60">
//                 {loading ? 'Creating...' : 'Create Flash Sale'}
//               </button>
//               <button onClick={() => setShowForm(false)} className="px-6 py-3 text-sm font-bold border rounded-xl border-slate-200">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';

const authH = () => ({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || '') });

const toLocal = (d) => d ? new Date(d).toISOString().slice(0,16) : '';
const isActive = (s) => new Date() >= new Date(s.startTime) && new Date() <= new Date(s.endTime) && s.isActive;
const timeLeft = (endTime) => {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return 'Ended';
  const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m left`;
};

export default function FlashSales() {
  const [sales, setSales]       = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm] = useState({ title:'', description:'', discount:20, startTime:'', endTime:'', categories:[], isActive:true, bannerColor:'#6e3dff' });

  const CATEGORIES = ['Fruits & Vegetables','Bakery, Cakes & Dairy','Beverages','Beauty & Hygiene','Cleaning & Household','Eggs, Meat & Fish','Foodgrains, Oil & Masala','Gourmet & World Food','Snacks & Branded Foods','Baby Care','Kitchen, Garden & Pets'];

  useEffect(() => { fetch('/api/features/flash-sales/all', { headers: authH() }).then(r => r.json()).then(d => { if (Array.isArray(d)) setSales(d); }); }, []);

  const submit = async () => {
    if (!form.title || !form.startTime || !form.endTime) return alert('Fill all required fields');
    setLoading(true);
    const res = await fetch('/api/features/flash-sales', { method: 'POST', headers: authH(), body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setSales(s => [data, ...s]); setShowForm(false); }
    setLoading(false);
  };

  const deleteSale = async (id) => {
    await fetch(`/api/features/flash-sales/${id}`, { method: 'DELETE', headers: authH() });
    setSales(s => s.filter(x => x._id !== id));
  };

  const toggleCat = (cat) => setForm(f => ({
    ...f, categories: f.categories.includes(cat) ? f.categories.filter(c => c !== cat) : [...f.categories, cat]
  }));

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black"><span className="text-orange-500 material-symbols-outlined">local_fire_department</span> Flash Sales</h1>
          <p className="mt-1 text-sm text-slate-500">Create time-limited deals with countdown timers</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90">
          <span className="text-sm material-symbols-outlined">add</span> New Flash Sale
        </button>
      </div>

      {/* Sales list */}
      <div className="space-y-4">
        {sales.map(sale => (
          <div key={sale._id} className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 text-lg font-black text-white rounded-xl" style={{ backgroundColor: sale.bannerColor }}>
                  {sale.discount}%
                </div>
                <div>
                  <p className="font-bold">{sale.title}</p>
                  <p className="text-sm text-slate-500">{sale.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(sale.startTime).toLocaleString('en-IN')} → {new Date(sale.endTime).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isActive(sale) ? (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Live · {timeLeft(sale.endTime)}
                  </span>
                ) : new Date() < new Date(sale.startTime) ? (
                  <span className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">Scheduled</span>
                ) : (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-500">Ended</span>
                )}
                <button onClick={() => deleteSale(sale._id)} className="p-1 text-red-400 hover:text-red-600">
                  <span className="text-sm material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            {sale.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {sale.categories.map(c => <span key={c} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{c}</span>)}
              </div>
            )}
          </div>
        ))}
        {!sales.length && <p className="py-12 text-center bg-white border text-slate-400 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">No flash sales yet</p>}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">New Flash Sale</h2>
              <button onClick={() => setShowForm(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            {[['title','Title *','text'],['description','Description','text']].map(([f, p, t]) => (
              <input key={f} type={t} placeholder={p} value={form[f]} onChange={e => setForm(x => ({ ...x, [f]: e.target.value }))}
                className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-xs font-bold text-slate-500">Discount %</label>
                <input type="number" min="1" max="90" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: +e.target.value }))}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-slate-500">Banner Color</label>
                <div className="flex gap-2">
                  <input type="color" value={form.bannerColor} onChange={e => setForm(f => ({ ...f, bannerColor: e.target.value }))} className="w-12 h-10 border-2 rounded-lg border-slate-200" />
                  <input value={form.bannerColor} onChange={e => setForm(f => ({ ...f, bannerColor: e.target.value }))} className="flex-1 px-3 py-2 text-sm border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-slate-500">Start Time *</label>
                <input type="datetime-local" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary" />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-slate-500">End Time *</label>
                <input type="datetime-local" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold text-slate-500">Apply to Categories</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => toggleCat(c)} className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${form.categories.includes(c) ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={submit} disabled={loading} className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60">
                {loading ? 'Creating...' : 'Create Flash Sale'}
              </button>
              <button onClick={() => setShowForm(false)} className="px-6 py-3 text-sm font-bold border rounded-xl border-slate-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}