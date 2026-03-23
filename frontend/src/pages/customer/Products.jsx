import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { Loader } from '../../components/SharedComponents';

const CATEGORIES = [
  'All',
  'Fruits & Vegetables',
  'Bakery, Cakes & Dairy',
  'Beverages',
  'Beauty & Hygiene',
  'Cleaning & Household',
  'Eggs, Meat & Fish',
  'Foodgrains, Oil & Masala',
  'Gourmet & World Food',
  'Kitchen, Garden & Pets',
  'Snacks & Branded Foods',
  'Baby Care',
];
const SORT_OPTIONS = [
  { value: '',           label: 'Relevance' },
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);

  const keyword  = searchParams.get('keyword')  || '';
  const category = searchParams.get('category') ? decodeURIComponent(searchParams.get('category')) : '';
  const sort     = searchParams.get('sort')     || '';
  const page     = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (keyword)  params.keyword  = keyword;
    if (category) params.category = category;
    if (sort)     params.sort     = sort;

    getProducts(params)
      .then(({ data }) => { setProducts(data.products); setTotalPages(data.pages); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [keyword, category, sort, page]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    // Reset to page 1 only when changing filters, not when changing page
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  };

  const goToPage = (newPage) => {
    const p = new URLSearchParams(searchParams);
    if (newPage <= 1) p.delete('page');
    else p.set('page', newPage);
    setSearchParams(p);
  };

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black">
            {category ? category : keyword ? `Results for "${keyword}"` : 'All Products'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{total} products found</p>
        </div>
        <select value={sort} onChange={e => setParam('sort', e.target.value)}
          className="px-3 py-2 text-sm bg-white border outline-none border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-900 focus:ring-2 focus:ring-primary/30">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky p-4 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 top-20">
            <h3 className="mb-3 text-sm font-bold">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button key={cat}
                  onClick={() => setParam('category', cat === 'All' ? '' : cat)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    (cat === 'All' && !category) || cat === category
                      ? 'bg-primary text-white font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile category chips */}
          <div className="flex gap-2 pb-1 mb-5 overflow-x-auto hide-scrollbar lg:hidden">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setParam('category', cat === 'All' ? '' : cat)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  (cat === 'All' && !category) || cat === category
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? <Loader /> : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="mb-3 text-5xl material-symbols-outlined">search_off</span>
              <p className="font-semibold">No products found</p>
              <p className="text-sm">Try a different search or category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => goToPage(page - 1)} disabled={page <= 1}
                    className="p-2 border rounded-lg border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="text-sm material-symbols-outlined">chevron_left</span>
                  </button>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button key={pageNum} onClick={() => goToPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                          page === pageNum
                            ? 'bg-primary text-white shadow-md shadow-primary/25'
                            : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}>
                        {pageNum}
                      </button>
                    );
                  })}
                  <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages}
                    className="p-2 border rounded-lg border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="text-sm material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;