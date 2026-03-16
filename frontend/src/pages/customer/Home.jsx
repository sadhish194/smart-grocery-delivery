// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getFeaturedProducts, getProducts } from '../../services/api';
// import ProductCard from '../../components/ProductCard';
// import { Loader } from '../../components/SharedComponents';

// const CATEGORIES = [
//   { name: 'Vegetables', color: 'bg-emerald-100 text-emerald-700', emoji: '🥦' },
//   { name: 'Fruits',     color: 'bg-orange-100 text-orange-700',   emoji: '🍎' },
//   { name: 'Dairy',      color: 'bg-blue-100 text-blue-700',       emoji: '🥛' },
//   { name: 'Bakery',     color: 'bg-amber-100 text-amber-700',     emoji: '🍞' },
//   { name: 'Meat',       color: 'bg-red-100 text-red-700',         emoji: '🥩' },
//   { name: 'Beverages',  color: 'bg-purple-100 text-purple-700',   emoji: '☕' },
//   { name: 'Snacks',     color: 'bg-yellow-100 text-yellow-700',   emoji: '🍿' },
//   { name: 'Frozen',     color: 'bg-cyan-100 text-cyan-700',       emoji: '🧊' },
// ];

// const Home = () => {
//   const [featured, setFeatured] = useState([]);
//   const [newArrivals, setNewArrivals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     Promise.all([getFeaturedProducts(), getProducts({ sort: 'newest', limit: 8 })])
//       .then(([fRes, nRes]) => {
//         setFeatured(fRes.data);
//         setNewArrivals(nRes.data.products);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="px-4 py-6 mx-auto space-y-12 max-w-7xl">

//       {/* ── Hero ── */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[280px] md:h-[380px]">
//         <div
//           className="relative overflow-hidden cursor-pointer md:col-span-2 rounded-2xl group"
//           onClick={() => navigate('/products?category=Vegetables')}
//         >
//           <div className="absolute inset-0 transition-transform duration-700 bg-center bg-cover group-hover:scale-105"
//             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80')` }} />
//           <div className="absolute inset-0 flex flex-col justify-center p-8 bg-gradient-to-r from-black/60 to-transparent md:p-12">
//             <span className="px-3 py-1 mb-4 text-xs font-bold text-white rounded-full bg-secondary w-fit">WEEKEND OFFER</span>
//             <h2 className="mb-3 text-3xl font-extrabold leading-tight text-white md:text-5xl">
//               Fresh Vegetables<br />Up to 40% Off
//             </h2>
//             <p className="mb-5 text-base text-white/80">Directly from local farms to your doorstep</p>
//             <button className="py-3 font-bold text-white transition-all shadow-lg bg-primary px-7 rounded-xl w-fit hover:bg-primary/90 shadow-primary/30">
//               Shop Now
//             </button>
//           </div>
//         </div>
//         <div className="flex-col hidden gap-4 md:flex">
//           {[
//             { label: 'Pure Dairy Deals', sub: 'Save ₹50 on next order', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80', cat: 'Dairy' },
//             { label: 'Snack Party Pack', sub: 'Buy 1 Get 1 Free',        img: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=500&q=80', cat: 'Snacks' },
//           ].map(b => (
//             <div key={b.cat} className="relative flex-1 overflow-hidden cursor-pointer rounded-2xl group"
//               onClick={() => navigate(`/products?category=${b.cat}`)}>
//               <div className="absolute inset-0 transition-transform duration-700 bg-center bg-cover group-hover:scale-105"
//                 style={{ backgroundImage: `url('${b.img}')` }} />
//               <div className="absolute inset-0 flex flex-col justify-end p-5 bg-black/40">
//                 <h3 className="text-lg font-bold text-white">{b.label}</h3>
//                 <p className="text-sm text-white/80">{b.sub}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── Features strip ── */}
//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         {[
//           { icon: 'local_shipping', label: 'Free Delivery',      sub: 'On orders over ₹500',      color: 'text-primary' },
//           { icon: 'schedule',       label: '30 Min Delivery',     sub: 'Express service available', color: 'text-orange-500' },
//           { icon: 'verified',       label: 'Fresh Guaranteed',    sub: '100% quality checked',     color: 'text-emerald-500' },
//           { icon: 'payments',       label: 'Secure Payment',      sub: 'Multiple methods accepted', color: 'text-blue-500' },
//         ].map(f => (
//           <div key={f.label} className="flex items-center gap-3 p-4 bg-white border dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800">
//             <span className={`material-symbols-outlined text-2xl ${f.color}`}>{f.icon}</span>
//             <div>
//               <p className="text-sm font-bold">{f.label}</p>
//               <p className="text-xs text-slate-500">{f.sub}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Categories ── */}
//       <section>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-black">Shop by Category</h2>
//           <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
//             View All <span className="text-sm material-symbols-outlined">arrow_forward</span>
//           </Link>
//         </div>
//         <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
//           {CATEGORIES.map(cat => (
//             <Link key={cat.name} to={`/products?category=${cat.name}`}
//               className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group">
//               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
//                 {cat.emoji}
//               </div>
//               <span className="text-xs font-semibold leading-tight text-center">{cat.name}</span>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* ── Featured Products ── */}
//       {loading ? <Loader /> : featured.length > 0 && (
//         <section>
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-black">Featured Products</h2>
//               <p className="text-sm text-slate-500">Handpicked by our experts</p>
//             </div>
//             <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
//               View All <span className="text-sm material-symbols-outlined">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//             {featured.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
//           </div>
//         </section>
//       )}

//       {/* ── New Arrivals ── */}
//       {newArrivals.length > 0 && (
//         <section>
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-black">New Arrivals</h2>
//               <p className="text-sm text-slate-500">Just added to our collection</p>
//             </div>
//             <Link to="/products?sort=newest" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
//               See More <span className="text-sm material-symbols-outlined">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//             {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
//           </div>
//         </section>
//       )}

//       {/* ── Promo Banner ── */}
//       <section className="relative p-8 overflow-hidden text-white bg-primary rounded-3xl md:p-12">
//         <div className="relative z-10 max-w-lg">
//           <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-white rounded-full bg-white/20">LIMITED TIME</span>
//           <h2 className="mb-3 text-3xl font-extrabold md:text-4xl">Get 20% off your first order!</h2>
//           <p className="mb-6 text-white/80">
//             Use code <strong className="bg-white/20 px-2 py-0.5 rounded">FRESH20</strong> at checkout
//           </p>
//           <Link to="/products" className="inline-block px-6 py-3 font-bold transition-all bg-white text-primary rounded-xl hover:bg-white/90">
//             Start Shopping
//           </Link>
//         </div>
//         <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[120px] opacity-10 select-none hidden md:block">🛒</div>
//       </section>

//     </div>
//   );
// };

// export default Home;


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts, getProducts } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { Loader } from '../../components/SharedComponents';

const CATEGORIES = [
  { name: 'Fruits & Vegetables',      color: 'bg-emerald-100 text-emerald-700', emoji: '🥦' },
  { name: 'Bakery, Cakes & Dairy',    color: 'bg-blue-100 text-blue-700',       emoji: '🥛' },
  { name: 'Beverages',                color: 'bg-purple-100 text-purple-700',   emoji: '🥤' },
  { name: 'Beauty & Hygiene',         color: 'bg-pink-100 text-pink-700',       emoji: '🧴' },
  { name: 'Cleaning & Household',     color: 'bg-slate-100 text-slate-700',     emoji: '🧹' },
  { name: 'Eggs, Meat & Fish',        color: 'bg-red-100 text-red-700',         emoji: '🥩' },
  { name: 'Snacks & Branded Foods',   color: 'bg-yellow-100 text-yellow-700',   emoji: '🍿' },
  { name: 'Foodgrains, Oil & Masala', color: 'bg-orange-100 text-orange-700',   emoji: '🫙' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getFeaturedProducts(), getProducts({ sort: 'newest', limit: 8 })])
      .then(([fRes, nRes]) => {
        setFeatured(fRes.data);
        setNewArrivals(nRes.data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 py-6 mx-auto space-y-12 max-w-7xl">

      {/* ── Hero ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[280px] md:h-[380px]">
        <div
          className="relative overflow-hidden cursor-pointer md:col-span-2 rounded-2xl group"
          onClick={() => navigate('/products?category=Fruits & Vegetables')}
        >
          <div className="absolute inset-0 transition-transform duration-700 bg-center bg-cover group-hover:scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80')` }} />
          <div className="absolute inset-0 flex flex-col justify-center p-8 bg-gradient-to-r from-black/60 to-transparent md:p-12">
            <span className="px-3 py-1 mb-4 text-xs font-bold text-white rounded-full bg-secondary w-fit">WEEKEND OFFER</span>
            <h2 className="mb-3 text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Fresh Vegetables<br />Up to 40% Off
            </h2>
            <p className="mb-5 text-base text-white/80">Directly from local farms to your doorstep</p>
            <button className="py-3 font-bold text-white transition-all shadow-lg bg-primary px-7 rounded-xl w-fit hover:bg-primary/90 shadow-primary/30">
              Shop Now
            </button>
          </div>
        </div>
        <div className="flex-col hidden gap-4 md:flex">
          {[
            { label: 'Pure Dairy Deals', sub: 'Save ₹50 on next order', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80', cat: 'Bakery, Cakes & Dairy' },
            { label: 'Snack Party Pack', sub: 'Buy 1 Get 1 Free',        img: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=500&q=80', cat: 'Snacks & Branded Foods' },
          ].map(b => (
            <div key={b.cat} className="relative flex-1 overflow-hidden cursor-pointer rounded-2xl group"
              onClick={() => navigate(`/products?category=${b.cat}`)}>
              <div className="absolute inset-0 transition-transform duration-700 bg-center bg-cover group-hover:scale-105"
                style={{ backgroundImage: `url('${b.img}')` }} />
              <div className="absolute inset-0 flex flex-col justify-end p-5 bg-black/40">
                <h3 className="text-lg font-bold text-white">{b.label}</h3>
                <p className="text-sm text-white/80">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features strip ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: 'local_shipping', label: 'Free Delivery',      sub: 'On orders over ₹500',      color: 'text-primary' },
          { icon: 'schedule',       label: '30 Min Delivery',     sub: 'Express service available', color: 'text-orange-500' },
          { icon: 'verified',       label: 'Fresh Guaranteed',    sub: '100% quality checked',     color: 'text-emerald-500' },
          { icon: 'payments',       label: 'Secure Payment',      sub: 'Multiple methods accepted', color: 'text-blue-500' },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-3 p-4 bg-white border dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800">
            <span className={`material-symbols-outlined text-2xl ${f.color}`}>{f.icon}</span>
            <div>
              <p className="text-sm font-bold">{f.label}</p>
              <p className="text-xs text-slate-500">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Categories ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Shop by Category</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View All <span className="text-sm material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} to={`/products?category=${cat.name}`}
              className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                {cat.emoji}
              </div>
              <span className="text-xs font-semibold leading-tight text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      {loading ? <Loader /> : featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black">Featured Products</h2>
              <p className="text-sm text-slate-500">Handpicked by our experts</p>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View All <span className="text-sm material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black">New Arrivals</h2>
              <p className="text-sm text-slate-500">Just added to our collection</p>
            </div>
            <Link to="/products?sort=newest" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              See More <span className="text-sm material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Promo Banner ── */}
      <section className="relative p-8 overflow-hidden text-white bg-primary rounded-3xl md:p-12">
        <div className="relative z-10 max-w-lg">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-white rounded-full bg-white/20">LIMITED TIME</span>
          <h2 className="mb-3 text-3xl font-extrabold md:text-4xl">Get 20% off your first order!</h2>
          <p className="mb-6 text-white/80">
            Use code <strong className="bg-white/20 px-2 py-0.5 rounded">FRESH20</strong> at checkout
          </p>
          <Link to="/products" className="inline-block px-6 py-3 font-bold transition-all bg-white text-primary rounded-xl hover:bg-white/90">
            Start Shopping
          </Link>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[120px] opacity-10 select-none hidden md:block">🛒</div>
      </section>

    </div>
  );
};

export default Home;