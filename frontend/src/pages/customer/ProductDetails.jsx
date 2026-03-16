// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getProductById, createReview } from '../../services/api';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { Loader } from '../../components/SharedComponents';

// const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { addToCart, toggleWishlist, isInWishlist } = useCart();

//   const [product, setProduct]           = useState(null);
//   const [reviews, setReviews]           = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [error, setError]               = useState('');
//   const [qty, setQty]                   = useState(1);
//   const [adding, setAdding]             = useState(false);
//   const [toast, setToast]               = useState('');
//   const [reviewForm, setReviewForm]     = useState({ rating: 5, comment: '' });
//   const [submitting, setSubmitting]     = useState(false);

//   const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

//   useEffect(() => {
//     setLoading(true);
//     setError('');
//     getProductById(id)
//       .then(({ data }) => { setProduct(data); setReviews(data.reviews || []); })
//       .catch((err) => {
//         const msg = err.response?.data?.message || 'Failed to load product. Please try again.';
//         setError(msg);
//       })
//       .finally(() => setLoading(false));
//   }, [id]);

//   const handleAddToCart = async () => {
//     if (!user) { navigate('/login'); return; }
//     setAdding(true);
//     try {
//       await addToCart(product._id, qty);
//       showToast('Added to cart!');
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Failed to add');
//     } finally { setAdding(false); }
//   };

//   const handleReview = async (e) => {
//     e.preventDefault();
//     if (!user) { navigate('/login'); return; }
//     setSubmitting(true);
//     try {
//       await createReview(id, reviewForm);
//       const { data } = await getProductById(id);
//       setProduct(data); setReviews(data.reviews || []);
//       setReviewForm({ rating: 5, comment: '' });
//       showToast('Review submitted!');
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Review failed');
//     } finally { setSubmitting(false); }
//   };

//   if (loading) return <Loader size="lg" />;

//   if (error) return (
//     <div className="max-w-md px-4 py-24 mx-auto text-center">
//       <span className="block mb-4 text-5xl text-red-400 material-symbols-outlined">error</span>
//       <h2 className="mb-2 text-xl font-bold">Product not found</h2>
//       <p className="mb-6 text-slate-500">{error}</p>
//       <button onClick={() => navigate('/products')}
//         className="px-6 py-3 font-bold text-white transition-all bg-primary rounded-xl hover:bg-primary/90">
//         Back to Products
//       </button>
//     </div>
//   );

//   if (!product) return null;

//   const inWishlist    = user ? isInWishlist(product._id) : false;
//   const discountPct   = product.originalPrice > product.price
//     ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

//   return (
//     <div className="px-4 py-8 mx-auto max-w-7xl">
//       {toast && (
//         <div className="fixed z-50 px-5 py-3 text-sm font-semibold text-white shadow-lg top-20 right-4 bg-secondary rounded-xl animate-bounce">
//           {toast}
//         </div>
//       )}

//       {/* Breadcrumb */}
//       <nav className="flex items-center gap-2 mb-6 text-sm text-slate-500">
//         <span className="transition-colors cursor-pointer hover:text-primary" onClick={() => navigate('/')}>Home</span>
//         <span className="text-sm material-symbols-outlined">chevron_right</span>
//         <span className="transition-colors cursor-pointer hover:text-primary" onClick={() => navigate(`/products?category=${product.category}`)}>{product.category}</span>
//         <span className="text-sm material-symbols-outlined">chevron_right</span>
//         <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">{product.name}</span>
//       </nav>

//       <div className="grid grid-cols-1 gap-10 mb-12 md:grid-cols-2">
//         {/* Image */}
//         <div className="relative">
//           <div className="overflow-hidden aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl">
//             <img src={product.image || PLACEHOLDER} alt={product.name}
//               className="object-cover w-full h-full"
//               onError={e => { e.target.src = PLACEHOLDER; }} />
//           </div>
//           {user?.role === 'customer' && (
//             <button onClick={() => toggleWishlist(product._id)}
//               className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all ${inWishlist ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-500'}`}>
//               <span className="material-symbols-outlined" style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
//             </button>
//           )}
//           {discountPct > 0 && (
//             <div className="absolute px-3 py-1 text-sm font-black text-white rounded-full shadow-lg top-4 left-4 bg-secondary">
//               {discountPct}% OFF
//             </div>
//           )}
//         </div>

//         {/* Info */}
//         <div>
//           {product.isOrganic && (
//             <span className="inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">🌿 Organic</span>
//           )}
//           <h1 className="mb-2 text-3xl font-black">{product.name}</h1>
//           <p className="mb-4 text-sm text-slate-500">
//             {product.brand && <span className="font-semibold">by {product.brand}</span>}
//             {product.brand && ' · '}{product.unit}
//           </p>

//           {/* Stars */}
//           <div className="flex items-center gap-2 mb-4">
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <span key={i} className={`material-symbols-outlined text-lg ${i < Math.round(product.rating || 0) ? 'text-amber-400' : 'text-slate-200'}`}
//                   style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//               ))}
//             </div>
//             <span className="text-sm font-semibold">{(product.rating || 0).toFixed(1)}</span>
//             <span className="text-sm text-slate-400">({reviews.length} reviews)</span>
//           </div>

//           {/* Price */}
//           <div className="flex items-baseline gap-3 mb-6">
//             <span className="text-4xl font-black text-primary">₹{product.price}</span>
//             {product.originalPrice > product.price && (
//               <>
//                 <span className="text-xl line-through text-slate-400">₹{product.originalPrice}</span>
//                 <span className="bg-secondary/10 text-secondary font-bold text-sm px-2 py-0.5 rounded-lg">{discountPct}% OFF</span>
//               </>
//             )}
//           </div>

//           <p className="mb-6 text-slate-600 dark:text-slate-400">{product.description}</p>

//           {/* Stock */}
//           <div className="mb-6">
//             <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
//               <span className="text-sm material-symbols-outlined">{product.stock > 0 ? 'check_circle' : 'cancel'}</span>
//               {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
//             </span>
//           </div>

//           {/* Add to cart */}
//           {user?.role === 'customer' && product.stock > 0 && (
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-1 p-1 border border-slate-200 dark:border-slate-700 rounded-xl">
//                 <button onClick={() => setQty(q => Math.max(1, q - 1))}
//                   className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10">
//                   <span className="text-sm material-symbols-outlined">remove</span>
//                 </button>
//                 <span className="w-10 font-bold text-center">{qty}</span>
//                 <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
//                   className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10">
//                   <span className="text-sm material-symbols-outlined">add</span>
//                 </button>
//               </div>
//               <button onClick={handleAddToCart} disabled={adding}
//                 className="flex items-center justify-center flex-1 gap-2 py-3 font-bold text-white transition-all shadow-lg bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 shadow-primary/20">
//                 {adding
//                   ? <span className="text-sm material-symbols-outlined animate-spin">progress_activity</span>
//                   : <span className="text-sm material-symbols-outlined">shopping_cart</span>}
//                 Add to Cart
//               </button>
//             </div>
//           )}
//           {!user && (
//             <button onClick={() => navigate('/login')}
//               className="w-full py-3 mt-2 font-bold text-white transition-all bg-primary rounded-xl hover:bg-primary/90">
//               Login to Add to Cart
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Reviews */}
//       <div className="p-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//         <h2 className="mb-6 text-xl font-black">Customer Reviews ({reviews.length})</h2>

//         {user?.role === 'customer' && (
//           <form onSubmit={handleReview} className="p-5 mb-8 bg-slate-50 dark:bg-slate-800 rounded-xl">
//             <h3 className="mb-4 font-bold">Write a Review</h3>
//             <div className="mb-4">
//               <p className="mb-2 text-sm font-semibold">Your Rating</p>
//               <div className="flex gap-1">
//                 {[1, 2, 3, 4, 5].map(s => (
//                   <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
//                     <span className={`material-symbols-outlined text-2xl cursor-pointer ${s <= reviewForm.rating ? 'text-amber-400' : 'text-slate-300'}`}
//                       style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <textarea required rows={3} placeholder="Share your experience with this product..."
//               className="w-full p-3 text-sm bg-white border outline-none resize-none border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-900 focus:ring-2 focus:ring-primary/30"
//               value={reviewForm.comment}
//               onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
//             <button type="submit" disabled={submitting}
//               className="mt-3 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 text-sm flex items-center gap-2 transition-all">
//               {submitting && <span className="text-sm material-symbols-outlined animate-spin">progress_activity</span>}
//               Submit Review
//             </button>
//           </form>
//         )}

//         {reviews.length === 0 ? (
//           <p className="py-8 text-center text-slate-400">No reviews yet. Be the first to review!</p>
//         ) : (
//           <div className="space-y-5">
//             {reviews.map(r => (
//               <div key={r._id} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="flex items-center justify-center text-sm font-bold rounded-full w-9 h-9 bg-primary/10 text-primary">
//                     {r.user?.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold">{r.user?.name}</p>
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <span key={i} className={`material-symbols-outlined text-xs ${i < r.rating ? 'text-amber-400' : 'text-slate-200'}`}
//                           style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                       ))}
//                     </div>
//                   </div>
//                   <span className="ml-auto text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
//                 </div>
//                 <p className="pl-12 text-sm text-slate-600 dark:text-slate-400">{r.comment}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;



import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getFeaturedProducts, createReview } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/SharedComponents';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80';

const getGalleryImages = (mainImg, category) => {
  const fallbacks = {
    Fruits: [
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200',
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200',
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200',
    ],
    Vegetables: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200',
      'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=200',
    ],
    Dairy: [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200',
      'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=200',
    ],
  };
  const extras = fallbacks[category] || [
    'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=200',
    'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=200',
    'https://images.unsplash.com/photo-1543168256-418811576931?w=200',
  ];
  return [mainImg || PLACEHOLDER, ...extras];
};

const Accordion = ({ icon, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-2xl">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm material-symbols-outlined text-primary">{icon}</span>
          <span className="text-sm font-bold">{title}</span>
        </div>
        <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-5 pt-4 pb-5 text-sm leading-relaxed border-t text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
};

const StarRating = ({ value, onChange, size = 'text-xl' }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} type="button" onClick={() => onChange?.(s)} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
        <span
          className={`material-symbols-outlined ${size} ${s <= value ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >star</span>
      </button>
    ))}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct]       = useState(null);
  const [reviews, setReviews]       = useState([]);
  const [related, setRelated]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [activeImg, setActiveImg]   = useState(0);
  const [qty, setQty]               = useState(1);
  const [adding, setAdding]         = useState(false);
  const [toast, setToast]           = useState({ msg: '', type: 'success' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 2500);
  };

  useEffect(() => {
    setLoading(true); setError(''); setActiveImg(0); setQty(1);
    getProductById(id)
      .then(({ data }) => { setProduct(data); setReviews(data.reviews || []); })
      .catch(err => setError(err.response?.data?.message || 'Product not found'))
      .finally(() => setLoading(false));
    getFeaturedProducts()
      .then(({ data }) => setRelated((Array.isArray(data) ? data : []).filter(p => p._id !== id).slice(0, 4)))
      .catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'customer') { showToast('Only customers can add to cart', 'error'); return; }
    setAdding(true);
    try {
      await addToCart(product._id, qty);
      showToast(product.name + ' added to cart!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add to cart', 'error');
    } finally { setAdding(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await createReview(id, reviewForm);
      const { data } = await getProductById(id);
      setProduct(data); setReviews(data.reviews || []);
      setReviewForm({ rating: 5, comment: '' });
      showToast('Review submitted!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Review failed', 'error');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Loader size="lg" />;

  if (error) return (
    <div className="max-w-md px-4 py-24 mx-auto text-center">
      <span className="block mb-4 text-5xl text-red-400 material-symbols-outlined">error</span>
      <h2 className="mb-2 text-xl font-bold">Product not found</h2>
      <p className="mb-6 text-slate-500">{error}</p>
      <button onClick={() => navigate('/products')}
        className="px-6 py-3 font-bold text-white transition-all bg-primary rounded-xl hover:bg-primary/90">
        Back to Products
      </button>
    </div>
  );

  if (!product) return null;

  const gallery = getGalleryImages(product.image, product.category);
  const inWishlist = user ? isInWishlist(product._id) : false;
  const discountPct = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto">

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2
          ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          <span className="text-sm material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-8 flex-wrap">
        <Link to="/" className="transition-colors hover:text-primary">Home</Link>
        <span className="text-base material-symbols-outlined">chevron_right</span>
        <Link to={`/products?category=${product.category}`} className="transition-colors hover:text-primary">{product.category}</Link>
        <span className="text-base material-symbols-outlined">chevron_right</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-12 mb-16 lg:grid-cols-2">

        {/* Left: Gallery */}
        <div>
          <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden mb-3 shadow-sm">
            <img
              src={gallery[activeImg]}
              alt={product.name}
              className="object-cover w-full h-full transition-opacity duration-300"
              onError={e => { e.target.src = PLACEHOLDER; }}
            />
            {product.isOrganic && (
              <div className="absolute px-3 py-1 text-xs font-bold text-white rounded-full shadow top-3 left-3 bg-emerald-500">
                🌿 Organic
              </div>
            )}
            {discountPct > 0 && (
              <div className="absolute px-3 py-1 text-xs font-black text-white rounded-full shadow top-3 right-3 bg-secondary">
                {discountPct}% OFF
              </div>
            )}
            {user?.role === 'customer' && (
              <button onClick={() => toggleWishlist(product._id)}
                className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-lg transition-all
                  ${inWishlist ? 'bg-red-500 text-white scale-110' : 'bg-white/90 text-slate-400 hover:text-red-500 hover:scale-110'}`}>
                <span className="text-lg material-symbols-outlined"
                  style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </button>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2">
            {gallery.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all
                  ${activeImg === i ? 'border-primary shadow-md shadow-primary/20' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="object-cover w-full h-full"
                  onError={e => { e.target.src = PLACEHOLDER; }} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          {product.isFeatured && (
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              <span className="text-xs material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              Premium Selection
            </div>
          )}

          <h1 className="mb-2 text-3xl font-black leading-tight lg:text-4xl">{product.name}</h1>

          {product.brand && (
            <p className="mb-3 text-sm text-slate-500">
              Brand: <span className="font-semibold text-primary">{product.brand}</span>
            </p>
          )}

          {/* Stars */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating value={Math.round(product.rating || 0)} />
            <span className="text-sm font-bold">{(product.rating || 0).toFixed(1)}</span>
            <span className="text-sm text-slate-400">({reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-4xl font-black text-slate-900 dark:text-white">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xl font-medium line-through text-slate-400">₹{product.originalPrice}</span>
            )}
          </div>
          {product.unit && <p className="mb-5 text-xs text-slate-500">Weight: {product.unit}</p>}

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 rounded-xl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="flex items-center justify-center text-xl font-bold transition-colors w-11 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">
                −
              </button>
              <span className="w-10 font-bold text-center select-none">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                className="flex items-center justify-center text-xl font-bold transition-colors w-11 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">
                +
              </button>
            </div>

            {product.stock > 0 ? (
              <button onClick={handleAddToCart} disabled={adding}
                className="flex items-center justify-center flex-1 gap-2 text-sm font-bold text-white transition-all shadow-lg h-11 bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 shadow-primary/25">
                {adding
                  ? <span className="text-base material-symbols-outlined animate-spin">progress_activity</span>
                  : <span className="text-base material-symbols-outlined">shopping_cart</span>}
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            ) : (
              <div className="flex items-center justify-center flex-1 text-sm font-bold h-11 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl">
                Out of Stock
              </div>
            )}
          </div>

          {!user && (
            <button onClick={() => navigate('/login')}
              className="w-full mb-4 text-sm font-bold text-white transition-all h-11 bg-primary rounded-xl hover:bg-primary/90">
              Login to Add to Cart
            </button>
          )}

          {/* Stock status */}
          <div className="flex items-center gap-1.5 mb-6">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {product.stock > 0 ? 'In stock and ready for immediate delivery' : 'Out of stock'}
            </span>
          </div>

          {/* Accordions */}
          <div className="space-y-2">
            <Accordion icon="nutrition" title="Ingredients" defaultOpen={true}>
              {product.description || 'No ingredient information available for this product.'}
            </Accordion>

            <Accordion icon="monitoring" title="Nutrition Facts">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {[['Calories','52 kcal'],['Carbohydrates','13.8g'],['Protein','0.3g'],['Fat','0.2g'],['Fiber','2.4g'],['Sugar','10.4g']].map(([k,v]) => (
                  <div key={k} className="flex justify-between pb-1 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400">* Per 100g. Values are approximate.</p>
            </Accordion>

            <Accordion icon="calendar_today" title="Shelf Life & Storage">
              <ul className="space-y-1 text-xs">
                <li>• Keep refrigerated at 2–4°C for best freshness</li>
                <li>• Best consumed within 5–7 days of delivery</li>
                <li>• Store away from direct sunlight</li>
                <li>• Wash thoroughly before consumption</li>
              </ul>
            </Accordion>

            <Accordion icon="reviews" title={`Customer Reviews (${reviews.length})`}>
              {user?.role === 'customer' && (
                <form onSubmit={handleReview} className="p-4 mb-5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <p className="mb-3 text-xs font-bold">Write a Review</p>
                  <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} size="text-lg" />
                  <textarea required rows={3} placeholder="Share your experience..."
                    className="w-full p-3 mt-3 text-xs bg-white border outline-none resize-none border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-primary/30"
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
                  <button type="submit" disabled={submitting}
                    className="mt-2 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1.5">
                    {submitting && <span className="text-xs material-symbols-outlined animate-spin">progress_activity</span>}
                    Submit Review
                  </button>
                </form>
              )}
              {reviews.length === 0 ? (
                <p className="py-4 text-xs text-center text-slate-400">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="flex gap-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-xs font-bold rounded-full bg-primary/10 text-primary">
                        {r.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs font-semibold">{r.user?.name}</p>
                          <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <StarRating value={r.rating} size="text-xs" />
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{r.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black">You Might Also Like</h2>
            <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View All Recommendations
              <span className="text-sm material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map(p => (
              <Link key={p._id} to={`/products/${p._id}`}
                className="overflow-hidden transition-all duration-200 bg-white border group dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                <div className="overflow-hidden aspect-square bg-slate-50 dark:bg-slate-800">
                  <img src={p.image || PLACEHOLDER} alt={p.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    onError={e => { e.target.src = PLACEHOLDER; }} />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm truncate mb-0.5">{p.name}</p>
                  {p.unit && <p className="mb-1 text-xs text-slate-400">{p.unit}</p>}
                  <p className="font-black text-primary">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;

