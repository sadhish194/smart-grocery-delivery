

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
    desc:     'Stock up on your favourite snacks, chips, biscuits and branded food items at the best prices.',
    btn:      'EXPLORE',
    btnColor: 'bg-amber-500 hover:bg-amber-600',
    cat:      'Snacks & Branded Foods',
    img:      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80',
    bg:       '#fffbf0',
    textColor: 'text-slate-800',
  },
];

/* ─── Hero Slider ─── */
const HeroSlider = ({ navigate }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => { setCurrent(c => (c + 1) % SLIDES.length); setAnimating(false); }, 300);
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
    <div
      className="relative w-full overflow-hidden shadow-lg rounded-2xl"
      style={{ backgroundColor: slide.bg, minHeight: '380px', transition: 'background-color 0.5s ease' }}
    >
      <div className={`flex items-center justify-between h-full min-h-[380px] transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
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
            className={`${slide.btnColor} text-white font-black text-xs tracking-widest px-8 py-4 rounded-xl w-fit transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
          >
            {slide.btn}
          </button>
        </div>
        <div className="flex-1 relative h-[380px] hidden sm:block">
          <img
            src={slide.img} alt={slide.title[0]}
            className="absolute inset-0 object-cover object-center w-full h-full"
            style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 30%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)' }}
          />
        </div>
      </div>
      <div className="absolute flex gap-2 bottom-6 left-10 md:left-16">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2.5 bg-slate-700' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'}`} />
        ))}
      </div>
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

/* ─── Home ─── */
const Home = () => {
  const [featured, setFeatured]       = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [copied, setCopied]           = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard?.writeText('FRESH20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <div className={`w-full aspect-square rounded-2xl overflow-hidden flex-shrink-0 ${cat.light} group-hover:scale-105 transition-transform duration-200 shadow-sm`}>
                <img
                  src={cat.image} alt={cat.name}
                  className="object-cover w-full h-full"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem">${cat.emoji}</div>`;
                  }}
                />
              </div>
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
      <section className="relative overflow-hidden rounded-2xl" style={{ minHeight: '220px' }}>
        <div className="grid md:grid-cols-2 min-h-[220px]">

          {/* LEFT: light content panel */}
          <div
            className="relative z-10 flex flex-col justify-center px-10 py-10 md:px-12"
            style={{ background: '#f5f7f2' }}
          >
            {/* Eyebrow */}
            <p className="mb-2 text-xs font-medium tracking-wide text-slate-500">
              Fresh Groceries Delivered &nbsp;🚀
            </p>

            {/* Headline */}
            <h2
              className="mb-1 font-extrabold leading-tight text-slate-900 dark:text-white"
              style={{ fontSize: '2.1rem', fontFamily: "'Syne', sans-serif" }}
            >
              Save <span className="text-emerald-500">20%</span> on
            </h2>
            <p className="mb-5 text-lg font-normal text-slate-700 dark:text-slate-300">
              Your First Order
            </p>

            {/* Coupon box */}
            <div
              className="inline-flex items-center gap-2 mb-5 px-3.5 py-2 rounded-xl w-fit"
              style={{ border: '1.5px dashed #16a34a', background: '#f0fdf4' }}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#16a34a" strokeWidth="1.6">
                <path d="M2 6h12v8H2zM8 6V2M5 2a2 2 0 0 0 3 3M11 2a2 2 0 0 1-3 3M2 9h12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs text-slate-500">Use Code:</span>
              <span
                className="text-sm font-extrabold tracking-widest text-slate-900 dark:text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                FRESH20
              </span>
              <button
                onClick={handleCopy}
                className="p-0.5 rounded-md text-slate-400 hover:text-emerald-500 transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#16a34a" strokeWidth="2">
                    <polyline points="1,7 5,11 13,3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="5" y="5" width="9" height="9" rx="2" />
                    <path d="M11 5V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-2.5 mb-5">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-wider text-white transition-opacity rounded-lg hover:opacity-90"
                style={{ background: '#1a5c3a', fontFamily: "'Syne', sans-serif" }}
              >
                Shop Now
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                to="/products"
                className="px-5 py-3 text-xs font-medium transition-colors border rounded-lg text-slate-600 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600"
                style={{ borderColor: '#d1d5db', background: 'transparent' }}
              >
                Explore Deals
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4">
              {['10-min Delivery', '100% Fresh', 'No Chemicals'].map(b => (
                <div key={b} className="flex items-center gap-1.5">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{ width: 16, height: 16, background: '#dcfce7' }}
                  >
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="#16a34a" strokeWidth="1.8">
                      <polyline points="1,4.5 3.5,7 8,2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: same light background as left panel + vegetable burst image
              The image uses mix-blend-mode: multiply so black pixels in the
              veggie-burst.png become invisible against the light background.
          */}
          <div className="relative hidden overflow-hidden md:block" style={{ background: '#f5f7f2' }}>

            {/* Vegetable burst image — multiply blend removes the black bg */}
            <img
              src="/veggie-burst.png"
              alt="Fresh vegetables bursting from bag"
              className="absolute inset-0 object-cover object-center w-full h-full"
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* 100% Organic badge */}
            <div
              className="absolute z-20 flex flex-col items-center justify-center rounded-full top-5 left-10"
              style={{ width: 62, height: 62, background: '#1a5c3a' }}
            >
              <span
                className="font-extrabold leading-tight text-center text-white"
                style={{ fontSize: 10, fontFamily: "'Syne', sans-serif" }}
              >
                100%
              </span>
              <span
                className="font-extrabold leading-tight text-center text-white"
                style={{ fontSize: 10, fontFamily: "'Syne', sans-serif" }}
              >
                Organic
              </span>
            </div>

            {/* Starting from floating card */}
            <div
              className="absolute bottom-5 right-5 z-20 rounded-xl px-3.5 py-2.5"
              style={{
                background: 'rgba(26, 92, 58, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(26, 92, 58, 0.15)',
              }}
            >
              <p className="text-[10px] mb-0.5 text-slate-500">
                Starting from
              </p>
              <p
                className="text-base font-extrabold leading-none text-slate-800"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                ₹<span style={{ color: '#16a34a' }}>49</span> / item
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;


