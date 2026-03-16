import { useState, useEffect } from 'react';
import { getProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../../services/api';
import { Loader } from '../../components/SharedComponents';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Meat', 'Seafood', 'Beverages', 'Snacks', 'Frozen', 'Pantry', 'Personal Care', 'Household'];
const BLANK = { name: '', price: '', originalPrice: '', category: 'Vegetables', description: '', stock: '', image: '', unit: 'kg', brand: '', isOrganic: false, isFeatured: false, discount: '' };

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.keyword = search;
      const { data } = await getProducts(params);
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, search]);

  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, price: p.price, originalPrice: p.originalPrice || '', category: p.category, description: p.description || '', stock: p.stock, image: p.image || '', unit: p.unit || 'kg', brand: p.brand || '', isOrganic: p.isOrganic || false, isFeatured: p.isFeatured || false, discount: p.discount || '' });
    setEditId(p._id); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), originalPrice: Number(form.originalPrice) || 0 };
      if (editId) await adminUpdateProduct(editId, payload);
      else await adminCreateProduct(payload);
      setShowModal(false); load();
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await adminDeleteProduct(id); load(); } catch {}
  };

  const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&q=80';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-black">Products</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..."
              className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/30 w-56" />
          </div>
          <button onClick={openAdd} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 flex items-center gap-2 transition-all">
            <span className="material-symbols-outlined text-sm">add</span> Add Product
          </button>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image || PLACEHOLDER} alt={p.name} onError={e => { e.target.src = PLACEHOLDER; }}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <p className="font-semibold truncate max-w-[200px]">{p.name}</p>
                          {p.isOrganic && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Organic</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.category}</td>
                    <td className="px-4 py-3 text-right font-semibold text-primary">₹{p.price}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-amber-500' : 'text-emerald-600'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.isFeatured ? <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        : <span className="text-slate-300 text-sm">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-semibold ${page === i + 1 ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-700'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-black text-lg">{editId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Product Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                {[
                  { key: 'price', label: 'Price (₹) *', type: 'number' },
                  { key: 'originalPrice', label: 'Original Price (₹)', type: 'number' },
                  { key: 'stock', label: 'Stock *', type: 'number' },
                  { key: 'unit', label: 'Unit (kg/piece/L)', type: 'text' },
                  { key: 'brand', label: 'Brand', type: 'text' },
                  { key: 'discount', label: 'Discount %', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">{f.label}</label>
                    <input type={f.type} required={f.label.includes('*')} value={form[f.key]}
                      onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Category *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Image URL</label>
                <input value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} placeholder="https://..."
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none resize-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex gap-6">
                {[{ key: 'isOrganic', label: 'Organic' }, { key: 'isFeatured', label: 'Featured' }].map(opt => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[opt.key]} onChange={e => setForm(f => ({...f, [opt.key]: e.target.checked}))}
                      className="w-4 h-4 rounded text-primary" />
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 dark:border-slate-700 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-all">
                  {saving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  {editId ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
