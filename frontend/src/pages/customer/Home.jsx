// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getFeaturedProducts, getProducts } from '../../services/api';
// import ProductCard from '../../components/ProductCard';
// import { Loader } from '../../components/SharedComponents';
// import FlashSaleBanner from '../../components/FlashSaleBanner';

// const CATEGORIES = [
//   { name: 'Fruits & Vegetables',      color: 'bg-emerald-100', emoji: '🥦', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80' },
//   { name: 'Bakery, Cakes & Dairy',    color: 'bg-sky-100',     emoji: '🥛', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&q=80' },
//   { name: 'Beverages',                color: 'bg-purple-100',  emoji: '🥤', image: 'https://images.unsplash.com/photo-1596803244618-8dea48d6c432?w=200&q=80' },
//   { name: 'Snacks & Branded Foods',   color: 'bg-yellow-100',  emoji: '🍿', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&q=80' },
//   { name: 'Foodgrains, Oil & Masala', color: 'bg-orange-100',  emoji: '🫙', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80' },
//   { name: 'Beauty & Hygiene',         color: 'bg-pink-100',    emoji: '🧴', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&q=80' },
//   { name: 'Cleaning & Household',     color: 'bg-slate-100',   emoji: '🧹', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80' },
//   { name: 'Eggs, Meat & Fish',        color: 'bg-red-100',     emoji: '🥩', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80' },
//   { name: 'Gourmet & World Food',     color: 'bg-amber-100',   emoji: '🍜', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80' },
//   { name: 'Baby Care',                color: 'bg-indigo-100',  emoji: '🍼', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&q=80' },
//   { name: 'Kitchen, Garden & Pets',   color: 'bg-teal-100',    emoji: '🍳', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' },
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
//           onClick={() => navigate(`/products?category=${encodeURIComponent('Fruits & Vegetables')}`)}
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
//             { label: 'Pure Dairy Deals', sub: 'Save ₹50 on next order', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80', cat: 'Bakery, Cakes & Dairy' },
//             { label: 'Snack Party Pack', sub: 'Buy 1 Get 1 Free',        img: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=500&q=80', cat: 'Snacks & Branded Foods' },
//           ].map(b => (
//             <div key={b.cat} className="relative flex-1 overflow-hidden cursor-pointer rounded-2xl group"
//               onClick={() => navigate(`/products?category=${encodeURIComponent(b.cat)}`)}>
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

//       {/* ── Flash Sales ── */}
//       <FlashSaleBanner />

//       {/* ── Features strip ── */}
//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         {[
//           {
//             color: 'bg-teal-50 border-teal-100',
//             iconColor: 'text-teal-600',
//             label: 'Free Delivery',
//             sub: 'On orders over ₹500',
//             icon: (
//               <svg viewBox="0 0 64 48" className="h-10 w-14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="2" y="8" width="38" height="26" rx="4"/>
//                 <rect x="40" y="14" width="20" height="20" rx="3"/>
//                 <circle cx="14" cy="38" r="5"/>
//                 <circle cx="48" cy="38" r="5"/>
//                 <line x1="2" y1="33" x2="60" y2="33"/>
//                 <line x1="2" y1="16" x2="0" y2="16" strokeWidth="2.5" opacity="0.5"/>
//                 <line x1="2" y1="22" x2="0" y2="22" strokeWidth="2" opacity="0.35"/>
//               </svg>
//             ),
//           },
//           {
//             color: 'bg-amber-50 border-amber-100',
//             iconColor: 'text-amber-600',
//             label: '30 Min Delivery',
//             sub: 'Express service available',
//             icon: (
//               <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="24" cy="24" r="20"/>
//                 <line x1="24" y1="6" x2="24" y2="11"/>
//                 <line x1="24" y1="37" x2="24" y2="42"/>
//                 <line x1="6" y1="24" x2="11" y2="24"/>
//                 <line x1="37" y1="24" x2="42" y2="24"/>
//                 <line x1="24" y1="24" x2="24" y2="10" strokeWidth="2.5"/>
//                 <line x1="24" y1="24" x2="34" y2="28" strokeWidth="2.5"/>
//                 <circle cx="24" cy="24" r="2.5" fill="currentColor"/>
//               </svg>
//             ),
//           },
//           {
//             color: 'bg-emerald-50 border-emerald-100',
//             iconColor: 'text-emerald-600',
//             label: 'Fresh Guaranteed',
//             sub: '100% quality checked',
//             icon: (
//               <svg viewBox="0 0 48 52" className="w-10 h-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M24 4 L44 12 L44 30 Q44 44 24 50 Q4 44 4 30 L4 12 Z"/>
//                 <path d="M15 26 L21 32 L33 20" strokeWidth="2.5"/>
//               </svg>
//             ),
//           },
//           {
//             color: 'bg-violet-50 border-violet-100',
//             iconColor: 'text-violet-600',
//             label: 'Secure Payment',
//             sub: 'Multiple methods accepted',
//             icon: (
//               <svg viewBox="0 0 48 52" className="w-10 h-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="8" y="24" width="32" height="24" rx="5"/>
//                 <path d="M14 24 Q14 10 24 10 Q34 10 34 24"/>
//                 <circle cx="24" cy="35" r="4"/>
//                 <line x1="24" y1="39" x2="24" y2="44" strokeWidth="2"/>
//               </svg>
//             ),
//           },
//         ].map(f => (
//           <div key={f.label} className={`${f.color} rounded-2xl p-5 border flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
//             <div className={`${f.iconColor}`}>{f.icon}</div>
//             <div>
//               <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{f.label}</p>
//               <p className="text-xs text-slate-500 mt-0.5">{f.sub}</p>
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
//         <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-11">
//           {CATEGORIES.map(cat => (
//             <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`}
//               className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group">
//               <div className={`w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform ${cat.color}`}>
//                 <img
//                   src={cat.image}
//                   alt={cat.name}
//                   className="object-cover w-full h-full"
//                   onError={e => {
//                     e.target.style.display = 'none';
//                     e.target.parentNode.innerHTML = `<span style="font-size:28px;display:flex;align-items:center;justify-content:center;height:100%">${cat.emoji}</span>`;
//                   }}
//                 />
//               </div>
//               <span className="text-xs font-semibold leading-tight text-center line-clamp-2">{cat.name}</span>
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

// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getFeaturedProducts, getProducts } from '../../services/api';
// import ProductCard from '../../components/ProductCard';
// import { Loader } from '../../components/SharedComponents';
// import FlashSaleBanner from '../../components/FlashSaleBanner';

// const CATEGORIES = [
//   { name: 'Fruits & Vegetables',      emoji: '🥦', light: 'bg-emerald-50', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80' },
//   { name: 'Bakery, Cakes & Dairy',    emoji: '🥛', light: 'bg-sky-50',     image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&q=80' },
//   { name: 'Beverages',                emoji: '🥤', light: 'bg-purple-50',  image: 'https://images.unsplash.com/photo-1596803244618-8dea48d6c432?w=200&q=80' },
//   { name: 'Snacks & Branded Foods',   emoji: '🍿', light: 'bg-yellow-50',  image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&q=80' },
//   { name: 'Foodgrains, Oil & Masala', emoji: '🫙', light: 'bg-orange-50',  image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80' },
//   { name: 'Beauty & Hygiene',         emoji: '🧴', light: 'bg-pink-50',    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&q=80' },
//   { name: 'Cleaning & Household',     emoji: '🧹', light: 'bg-slate-50',   image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80' },
//   { name: 'Eggs, Meat & Fish',        emoji: '🥩', light: 'bg-red-50',     image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80' },
//   { name: 'Gourmet & World Food',     emoji: '🍜', light: 'bg-amber-50',   image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80' },
//   { name: 'Baby Care',                emoji: '🍼', light: 'bg-indigo-50',  image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&q=80' },
//   { name: 'Kitchen, Garden & Pets',   emoji: '🍳', light: 'bg-teal-50',    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' },
// ];

// const SLIDES = [
//   {
//     tag:      'ALL NATURAL PRODUCTS',
//     title:    ['Fresh and Healthy', 'Veggies', 'Organic Market'],
//     titleBold: [true, false, false],
//     desc:     'Organic food is food produced by methods that comply with the standard of farming.',
//     btn:      'SHOP NOW',
//     btnColor: 'bg-secondary hover:bg-emerald-600',
//     cat:      'Fruits & Vegetables',
//     img:      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
//     bg:       '#f8f9f3',
//     textColor: 'text-slate-800',
//   },
//   {
//     tag:      'FRESH EVERY DAY',
//     title:    ['Farm Fresh', 'Dairy &', 'Bakery Products'],
//     titleBold: [true, false, false],
//     desc:     'Start your day with the freshest milk, bread, eggs and dairy products delivered to your door.',
//     btn:      'ORDER NOW',
//     btnColor: 'bg-primary hover:bg-violet-700',
//     cat:      'Bakery, Cakes & Dairy',
//     img:      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80',
//     bg:       '#f0f4ff',
//     textColor: 'text-slate-800',
//   },
//   {
//     tag:      'BEST DEALS TODAY',
//     title:    ['Crispy Snacks &', 'Tasty', 'Branded Foods'],
//     titleBold: [true, false, false],
//     desc:     'Stock up on your favourite snacks, chips, biscuits and branded food items at the best prices.',
//     btn:      'EXPLORE',
//     btnColor: 'bg-amber-500 hover:bg-amber-600',
//     cat:      'Snacks & Branded Foods',
//     img:      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80',
//     bg:       '#fffbf0',
//     textColor: 'text-slate-800',
//   },
// ];

// const HeroSlider = ({ navigate }) => {
//   const [current, setCurrent] = useState(0);
//   const [animating, setAnimating] = useState(false);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setAnimating(true);
//       setTimeout(() => {
//         setCurrent(c => (c + 1) % SLIDES.length);
//         setAnimating(false);
//       }, 300);
//     }, 4500);
//     return () => clearInterval(timer);
//   }, []);

//   const goTo = (i) => {
//     if (i === current) return;
//     setAnimating(true);
//     setTimeout(() => { setCurrent(i); setAnimating(false); }, 300);
//   };

//   const slide = SLIDES[current];

//   return (
//     <div className="relative w-full overflow-hidden shadow-lg rounded-2xl"
//       style={{ backgroundColor: slide.bg, minHeight: '380px', transition: 'background-color 0.5s ease' }}>

//       <div className={`flex items-center justify-between h-full min-h-[380px] transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
//         {/* Left: text */}
//         <div className="z-10 flex flex-col justify-center flex-1 p-10 md:p-16">
//           <p className="mb-4 text-xs font-black tracking-widest uppercase text-slate-400">{slide.tag}</p>
//           <h1 className={`text-4xl md:text-5xl leading-tight mb-4 ${slide.textColor}`}>
//             <span className="font-black">{slide.title[0]}</span><br />
//             <span className="font-light">{slide.title[1]} </span>
//             <span className="font-light">{slide.title[2]}</span>
//           </h1>
//           <p className="max-w-xs mb-8 text-sm leading-relaxed text-slate-400">{slide.desc}</p>
//           <button
//             onClick={() => navigate(`/products?category=${encodeURIComponent(slide.cat)}`)}
//             className={`${slide.btnColor} text-white font-black text-xs tracking-widest px-8 py-4 rounded-xl w-fit transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}>
//             {slide.btn}
//           </button>
//         </div>

//         {/* Right: image */}
//         <div className="flex-1 relative h-[380px] hidden sm:block">
//           <img
//             src={slide.img}
//             alt={slide.title[0]}
//             className="absolute inset-0 object-cover object-center w-full h-full"
//             style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 30%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)' }}
//           />
//         </div>
//       </div>

//       {/* Dot navigation */}
//       <div className="absolute flex gap-2 bottom-6 left-10 md:left-16">
//         {SLIDES.map((_, i) => (
//           <button key={i} onClick={() => goTo(i)}
//             className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2.5 bg-slate-700' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'}`} />
//         ))}
//       </div>

//       {/* Arrow buttons */}
//       <button onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
//         className="absolute flex items-center justify-center transition-all -translate-y-1/2 rounded-full shadow left-3 top-1/2 w-9 h-9 bg-white/80 hover:bg-white hover:scale-110">
//         <span className="text-lg material-symbols-outlined text-slate-600">chevron_left</span>
//       </button>
//       <button onClick={() => goTo((current + 1) % SLIDES.length)}
//         className="absolute flex items-center justify-center transition-all -translate-y-1/2 rounded-full shadow right-3 top-1/2 w-9 h-9 bg-white/80 hover:bg-white hover:scale-110">
//         <span className="text-lg material-symbols-outlined text-slate-600">chevron_right</span>
//       </button>
//     </div>
//   );
// };

// const Home = () => {
//   const [featured, setFeatured]     = useState([]);
//   const [newArrivals, setNewArrivals] = useState([]);
//   const [loading, setLoading]       = useState(true);
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
//     <div className="px-4 py-6 mx-auto max-w-7xl space-y-14">

//       {/* ── Flash Sales ── */}
//       <FlashSaleBanner />

//       {/* ── Hero Slider ── */}
//       <HeroSlider navigate={navigate} />

//       {/* ── Features strip ── */}
//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         {[
//           { icon: 'local_shipping', label: 'Free Delivery',    sub: 'On orders over ₹500',      color: 'text-primary' },
//           { icon: 'schedule',       label: '30 Min Delivery',  sub: 'Express service available', color: 'text-orange-500' },
//           { icon: 'verified',       label: 'Fresh Guaranteed', sub: '100% quality checked',      color: 'text-emerald-500' },
//           { icon: 'payments',       label: 'Secure Payment',   sub: 'Multiple methods accepted', color: 'text-blue-500' },
//         ].map(f => (
//           <div key={f.label} className="flex items-center gap-3 p-4 bg-white border shadow-sm dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800">
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
//         <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
//           {CATEGORIES.map(cat => (
//             <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`}
//               className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group">
//               <div className={`w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform ${cat.light}`}>
//                 <img src={cat.image} alt={cat.name} className="object-cover w-full h-full"
//                   onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML=`<span style="font-size:28px;display:flex;align-items:center;justify-content:height:100%">${cat.emoji}</span>`; }} />
//               </div>
//               <span className="text-xs font-semibold leading-tight text-center line-clamp-2">{cat.name}</span>
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


// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getFeaturedProducts, getProducts } from '../../services/api';
// import ProductCard from '../../components/ProductCard';
// import { Loader } from '../../components/SharedComponents';
// import FlashSaleBanner from '../../components/FlashSaleBanner';

// const CATEGORIES = [
//   { name: 'Fruits & Vegetables',      emoji: '🥦', light: 'bg-emerald-50', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80' },
//   { name: 'Bakery, Cakes & Dairy',    emoji: '🥛', light: 'bg-sky-50',     image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&q=80' },
//   { name: 'Beverages',                emoji: '🥤', light: 'bg-purple-50',  image: 'https://images.unsplash.com/photo-1596803244618-8dea48d6c432?w=200&q=80' },
//   { name: 'Snacks & Branded Foods',   emoji: '🍿', light: 'bg-yellow-50',  image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&q=80' },
//   { name: 'Foodgrains, Oil & Masala', emoji: '🫙', light: 'bg-orange-50',  image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80' },
//   { name: 'Beauty & Hygiene',         emoji: '🧴', light: 'bg-pink-50',    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&q=80' },
//   { name: 'Cleaning & Household',     emoji: '🧹', light: 'bg-slate-50',   image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80' },
//   { name: 'Eggs, Meat & Fish',        emoji: '🥩', light: 'bg-red-50',     image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80' },
//   { name: 'Gourmet & World Food',     emoji: '🍜', light: 'bg-amber-50',   image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80' },
//   { name: 'Baby Care',                emoji: '🍼', light: 'bg-indigo-50',  image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&q=80' },
//   { name: 'Kitchen, Garden & Pets',   emoji: '🍳', light: 'bg-teal-50',    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' },
// ];

// const SLIDES = [
//   {
//     tag:      'ALL NATURAL PRODUCTS',
//     title:    ['Fresh and Healthy', 'Veggies', 'Organic Market'],
//     titleBold: [true, false, false],
//     desc:     'Organic food is food produced by methods that comply with the standard of farming.',
//     btn:      'SHOP NOW',
//     btnColor: 'bg-secondary hover:bg-emerald-600',
//     cat:      'Fruits & Vegetables',
//     img:      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
//     bg:       '#f8f9f3',
//     textColor: 'text-slate-800',
//   },
//   {
//     tag:      'FRESH EVERY DAY',
//     title:    ['Farm Fresh', 'Dairy &', 'Bakery Products'],
//     titleBold: [true, false, false],
//     desc:     'Start your day with the freshest milk, bread, eggs and dairy products delivered to your door.',
//     btn:      'ORDER NOW',
//     btnColor: 'bg-primary hover:bg-violet-700',
//     cat:      'Bakery, Cakes & Dairy',
//     img:      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80',
//     bg:       '#f0f4ff',
//     textColor: 'text-slate-800',
//   },
//   {
//     tag:      'BEST DEALS TODAY',
//     title:    ['Crispy Snacks &', 'Tasty', 'Branded Foods'],
//     titleBold: [true, false, false],
//     desc:     'Stock up on your favourite snacks, chips, biscuits and branded food items at the best prices.',
//     btn:      'EXPLORE',
//     btnColor: 'bg-amber-500 hover:bg-amber-600',
//     cat:      'Snacks & Branded Foods',
//     img:      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80',
//     bg:       '#fffbf0',
//     textColor: 'text-slate-800',
//   },
// ];

// const HeroSlider = ({ navigate }) => {
//   const [current, setCurrent] = useState(0);
//   const [animating, setAnimating] = useState(false);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setAnimating(true);
//       setTimeout(() => {
//         setCurrent(c => (c + 1) % SLIDES.length);
//         setAnimating(false);
//       }, 300);
//     }, 4500);
//     return () => clearInterval(timer);
//   }, []);

//   const goTo = (i) => {
//     if (i === current) return;
//     setAnimating(true);
//     setTimeout(() => { setCurrent(i); setAnimating(false); }, 300);
//   };

//   const slide = SLIDES[current];

//   return (
//     <div className="relative w-full overflow-hidden shadow-lg rounded-2xl"
//       style={{ backgroundColor: slide.bg, minHeight: '380px', transition: 'background-color 0.5s ease' }}>

//       <div className={`flex items-center justify-between h-full min-h-[380px] transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
//         {/* Left: text */}
//         <div className="z-10 flex flex-col justify-center flex-1 p-10 md:p-16">
//           <p className="mb-4 text-xs font-black tracking-widest uppercase text-slate-400">{slide.tag}</p>
//           <h1 className={`text-4xl md:text-5xl leading-tight mb-4 ${slide.textColor}`}>
//             <span className="font-black">{slide.title[0]}</span><br />
//             <span className="font-light">{slide.title[1]} </span>
//             <span className="font-light">{slide.title[2]}</span>
//           </h1>
//           <p className="max-w-xs mb-8 text-sm leading-relaxed text-slate-400">{slide.desc}</p>
//           <button
//             onClick={() => navigate(`/products?category=${encodeURIComponent(slide.cat)}`)}
//             className={`${slide.btnColor} text-white font-black text-xs tracking-widest px-8 py-4 rounded-xl w-fit transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}>
//             {slide.btn}
//           </button>
//         </div>

//         {/* Right: image */}
//         <div className="flex-1 relative h-[380px] hidden sm:block">
//           <img
//             src={slide.img}
//             alt={slide.title[0]}
//             className="absolute inset-0 object-cover object-center w-full h-full"
//             style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 30%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)' }}
//           />
//         </div>
//       </div>

//       {/* Dot navigation */}
//       <div className="absolute flex gap-2 bottom-6 left-10 md:left-16">
//         {SLIDES.map((_, i) => (
//           <button key={i} onClick={() => goTo(i)}
//             className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2.5 bg-slate-700' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'}`} />
//         ))}
//       </div>

//       {/* Arrow buttons */}
//       <button onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
//         className="absolute flex items-center justify-center transition-all -translate-y-1/2 rounded-full shadow left-3 top-1/2 w-9 h-9 bg-white/80 hover:bg-white hover:scale-110">
//         <span className="text-lg material-symbols-outlined text-slate-600">chevron_left</span>
//       </button>
//       <button onClick={() => goTo((current + 1) % SLIDES.length)}
//         className="absolute flex items-center justify-center transition-all -translate-y-1/2 rounded-full shadow right-3 top-1/2 w-9 h-9 bg-white/80 hover:bg-white hover:scale-110">
//         <span className="text-lg material-symbols-outlined text-slate-600">chevron_right</span>
//       </button>
//     </div>
//   );
// };

// const Home = () => {
//   const [featured, setFeatured]     = useState([]);
//   const [newArrivals, setNewArrivals] = useState([]);
//   const [loading, setLoading]       = useState(true);
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
//     <div className="px-4 py-6 mx-auto max-w-7xl space-y-14">

//       {/* ── Flash Sales ── */}
//       <FlashSaleBanner />

//       {/* ── Hero Slider ── */}
//       <HeroSlider navigate={navigate} />

//       {/* ── Features strip ── */}
//       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//         {[
//           { icon: 'local_shipping', label: 'Free Delivery',    sub: 'On orders over ₹500',      color: 'text-primary' },
//           { icon: 'schedule',       label: '30 Min Delivery',  sub: 'Express service available', color: 'text-orange-500' },
//           { icon: 'verified',       label: 'Fresh Guaranteed', sub: '100% quality checked',      color: 'text-emerald-500' },
//           { icon: 'payments',       label: 'Secure Payment',   sub: 'Multiple methods accepted', color: 'text-blue-500' },
//         ].map(f => (
//           <div key={f.label} className="flex items-center gap-3 p-4 bg-white border shadow-sm dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800">
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
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="text-2xl font-black">Shop by Category</h2>
//           <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
//             View All <span className="text-sm material-symbols-outlined">arrow_forward</span>
//           </Link>
//         </div>
//         <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
//           {CATEGORIES.map(cat => (
//             <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`}
//               className="flex flex-col items-center gap-2 cursor-pointer group">
//               {/* Image box — Blinkit style rounded square with pastel bg */}
//               <div className={`w-full aspect-square rounded-2xl overflow-hidden flex-shrink-0 ${cat.light} group-hover:scale-105 transition-transform duration-200 shadow-sm`}>
//                 <img
//                   src={cat.image}
//                   alt={cat.name}
//                   className="object-cover w-full h-full"
//                   onError={e => {
//                     e.target.style.display = 'none';
//                     e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem">${cat.emoji}</div>`;
//                   }}
//                 />
//               </div>
//               {/* Name below image */}
//               <span className="w-full text-xs font-semibold leading-tight text-center text-slate-700 dark:text-slate-300 line-clamp-2">{cat.name}</span>
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
import FlashSaleBanner from '../../components/FlashSaleBanner';

const CATEGORIES = [
  { name: 'Fruits & Vegetables',      emoji: '🥦', light: 'bg-emerald-50', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80' },
  { name: 'Bakery, Cakes & Dairy',    emoji: '🥛', light: 'bg-sky-50',     image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&q=80' },
  { name: 'Beverages',                emoji: '🥤', light: 'bg-purple-50',  image: 'https://images.unsplash.com/photo-1596803244618-8dea48d6c432?w=200&q=80' },
  { name: 'Snacks & Branded Foods',   emoji: '🍿', light: 'bg-yellow-50',  image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&q=80' },
  { name: 'Foodgrains, Oil & Masala', emoji: '🫙', light: 'bg-orange-50',  image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80' },
  { name: 'Beauty & Hygiene',         emoji: '🧴', light: 'bg-pink-50',    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&q=80' },
  { name: 'Cleaning & Household',     emoji: '🧹', light: 'bg-slate-50',   image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80' },
  { name: 'Eggs, Meat & Fish',        emoji: '🥩', light: 'bg-red-50',     image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80' },
  { name: 'Gourmet & World Food',     emoji: '🍜', light: 'bg-amber-50',   image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80' },
  { name: 'Baby Care',                emoji: '🍼', light: 'bg-indigo-50',  image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&q=80' },
  { name: 'Kitchen, Garden & Pets',   emoji: '🍳', light: 'bg-teal-50',    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' },
];

const SLIDES = [
  {
    tag:      'ALL NATURAL PRODUCTS',
    title:    ['Fresh and Healthy', 'Veggies', 'Organic Market'],
    titleBold: [true, false, false],
    desc:     'Organic food is food produced by methods that comply with the standard of farming.',
    btn:      'SHOP NOW',
    btnColor: 'bg-secondary hover:bg-emerald-600',
    cat:      'Fruits & Vegetables',
    img:      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
    bg:       '#f8f9f3',
    textColor: 'text-slate-800',
  },
  {
    tag:      'FRESH EVERY DAY',
    title:    ['Farm Fresh', 'Dairy &', 'Bakery Products'],
    titleBold: [true, false, false],
    desc:     'Start your day with the freshest milk, bread, eggs and dairy products delivered to your door.',
    btn:      'ORDER NOW',
    btnColor: 'bg-primary hover:bg-violet-700',
    cat:      'Bakery, Cakes & Dairy',
    img:      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80',
    bg:       '#f0f4ff',
    textColor: 'text-slate-800',
  },
  {
    tag:      'BEST DEALS TODAY',
    title:    ['Crispy Snacks &', 'Tasty', 'Branded Foods'],
    titleBold: [true, false, false],
    desc:     'Stock up on your favourite snacks, chips, biscuits and branded food items at the best prices.',
    btn:      'EXPLORE',
    btnColor: 'bg-amber-500 hover:bg-amber-600',
    cat:      'Snacks & Branded Foods',
    img:      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80',
    bg:       '#fffbf0',
    textColor: 'text-slate-800',
  },
];

const HeroSlider = ({ navigate }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % SLIDES.length);
        setAnimating(false);
      }, 300);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => {
    if (i === current) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(i); setAnimating(false); }, 300);
  };

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden shadow-lg rounded-2xl"
      style={{ backgroundColor: slide.bg, minHeight: '380px', transition: 'background-color 0.5s ease' }}>

      <div className={`flex items-center justify-between h-full min-h-[380px] transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        {/* Left: text */}
        <div className="z-10 flex flex-col justify-center flex-1 p-10 md:p-16">
          <p className="mb-4 text-xs font-black tracking-widest uppercase text-slate-400">{slide.tag}</p>
          <h1 className={`text-4xl md:text-5xl leading-tight mb-4 ${slide.textColor}`}>
            <span className="font-black">{slide.title[0]}</span><br />
            <span className="font-light">{slide.title[1]} </span>
            <span className="font-light">{slide.title[2]}</span>
          </h1>
          <p className="max-w-xs mb-8 text-sm leading-relaxed text-slate-400">{slide.desc}</p>
          <button
            onClick={() => navigate(`/products?category=${encodeURIComponent(slide.cat)}`)}
            className={`${slide.btnColor} text-white font-black text-xs tracking-widest px-8 py-4 rounded-xl w-fit transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}>
            {slide.btn}
          </button>
        </div>

        {/* Right: image */}
        <div className="flex-1 relative h-[380px] hidden sm:block">
          <img
            src={slide.img}
            alt={slide.title[0]}
            className="absolute inset-0 object-cover object-center w-full h-full"
            style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 30%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)' }}
          />
        </div>
      </div>

      {/* Dot navigation */}
      <div className="absolute flex gap-2 bottom-6 left-10 md:left-16">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2.5 bg-slate-700' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'}`} />
        ))}
      </div>

      {/* Arrow buttons */}
      <button onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute flex items-center justify-center transition-all -translate-y-1/2 rounded-full shadow left-3 top-1/2 w-9 h-9 bg-white/80 hover:bg-white hover:scale-110">
        <span className="text-lg material-symbols-outlined text-slate-600">chevron_left</span>
      </button>
      <button onClick={() => goTo((current + 1) % SLIDES.length)}
        className="absolute flex items-center justify-center transition-all -translate-y-1/2 rounded-full shadow right-3 top-1/2 w-9 h-9 bg-white/80 hover:bg-white hover:scale-110">
        <span className="text-lg material-symbols-outlined text-slate-600">chevron_right</span>
      </button>
    </div>
  );
};

const Home = () => {
  const [featured, setFeatured]     = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading]       = useState(true);
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

  // Remove white background from basket image using canvas
  useEffect(() => {
    const img = document.getElementById('basketSrc');
    const canvas = document.getElementById('basketCanvas');
    if (!img || !canvas) return;
    const draw = () => {
      canvas.width  = 420;
      canvas.height = 280;
      const ctx = canvas.getContext('2d');
      // Scale to fill canvas while maintaining aspect ratio
      const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth  * scale;
      const h = img.naturalHeight * scale;
      const x = (canvas.width  - w) / 2;
      const y = (canvas.height - h) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, w, h);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        if (r > 215 && g > 215 && b > 215) {
          d[i+3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };
    if (img.complete && img.naturalHeight > 0) draw();
    else img.onload = draw;
  }, []);

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl space-y-14">

      {/* ── Flash Sales ── */}
      <FlashSaleBanner />

      {/* ── Hero Slider ── */}
      <HeroSlider navigate={navigate} />

      {/* ── Features strip ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: 'local_shipping', label: 'Free Delivery',    sub: 'On orders over ₹500',      color: 'text-primary' },
          { icon: 'schedule',       label: '30 Min Delivery',  sub: 'Express service available', color: 'text-orange-500' },
          { icon: 'verified',       label: 'Fresh Guaranteed', sub: '100% quality checked',      color: 'text-emerald-500' },
          { icon: 'payments',       label: 'Secure Payment',   sub: 'Multiple methods accepted', color: 'text-blue-500' },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-3 p-4 bg-white border shadow-sm dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800">
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-black">Shop by Category</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View All <span className="text-sm material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-2 cursor-pointer group">
              {/* Image box — Blinkit style rounded square with pastel bg */}
              <div className={`w-full aspect-square rounded-2xl overflow-hidden flex-shrink-0 ${cat.light} group-hover:scale-105 transition-transform duration-200 shadow-sm`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-cover w-full h-full"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem">${cat.emoji}</div>`;
                  }}
                />
              </div>
              {/* Name below image */}
              <span className="w-full text-xs font-semibold leading-tight text-center text-slate-700 dark:text-slate-300 line-clamp-2">{cat.name}</span>
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
      <section className="relative overflow-hidden bg-white border shadow-md dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800" style={{ minHeight: '300px' }}>
        {/* Full green right background */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%]" style={{ background: 'linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)' }} />
        {/* Blob circles on green side */}
        <div className="absolute w-40 h-40 rounded-full right-20 top-10 bg-white/30 blur-2xl" />
        <div className="absolute rounded-full right-40 bottom-5 w-28 h-28 bg-emerald-300/40 blur-xl" />

        <div className="relative z-10 flex items-stretch min-h-[300px]">
          {/* Left white section */}
          <div className="flex flex-col justify-center flex-1 px-10 py-10">
            <p className="mb-3 text-xs font-bold tracking-widest uppercase text-slate-400">
              Fresh Groceries Delivered 🚀
            </p>
            <h2 className="mb-3 text-4xl font-black leading-tight md:text-5xl text-slate-800 dark:text-white">
              Save <span className="text-secondary">20%</span> on<br />
              Your First Order
            </h2>
            <p className="mb-5 text-sm text-slate-400">Farm fresh products at your doorstep in minutes</p>

            {/* Coupon box */}
            <div className="flex items-center gap-3 px-4 py-3 mb-6 border-2 border-dashed border-secondary rounded-2xl w-fit bg-emerald-50/50 dark:bg-emerald-900/20">
              <span className="text-lg material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
              <span className="text-sm font-medium text-slate-500">Use Code:</span>
              <span className="text-base font-black tracking-widest text-slate-800 dark:text-white">FRESH20</span>
              <button onClick={() => { navigator.clipboard?.writeText('FRESH20'); }}
                className="p-1 ml-1 transition-colors rounded-lg text-slate-400 hover:text-secondary hover:bg-emerald-50">
                <span className="text-base material-symbols-outlined">content_copy</span>
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mb-6">
              <Link to="/products"
                className="bg-secondary text-white font-black px-8 py-3.5 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-secondary/30 flex items-center gap-2">
                Shop Now <span className="text-sm material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to="/products"
                className="font-bold px-8 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-secondary hover:text-secondary transition-all text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
                Explore Deals
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6">
              {['10-min Delivery', '100% Fresh', 'No Chemicals'].map(b => (
                <div key={b} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="text-base material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Right green section with big basket */}
          <div className="hidden md:flex items-center justify-center relative w-[45%]">
            {/* Organic badge inside top-right */}
            <div className="absolute z-20 flex flex-col items-center justify-center w-20 h-20 rounded-full shadow-xl top-6 right-8 bg-secondary shadow-secondary/40">
              <p className="text-xs font-black leading-tight text-white">100%</p>
              <p className="text-xs font-black leading-tight text-white">Organic</p>
            </div>
            {/* Basket with white background removed via canvas */}
            <canvas id="basketCanvas" style={{ width: '420px', height: '280px', objectFit: 'contain' }} />
            <img id="basketSrc" src="/basket.png" alt="" className="hidden" crossOrigin="anonymous" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;