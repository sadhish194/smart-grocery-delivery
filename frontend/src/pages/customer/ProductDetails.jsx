
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { getProductById, getFeaturedProducts, createReview } from '../../services/api';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { Loader } from '../../components/SharedComponents';

// const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80';

// const FOOD_CATEGORIES = [
//   'Fruits & Vegetables', 'Bakery, Cakes & Dairy', 'Beverages',
//   'Snacks & Branded Foods', 'Foodgrains, Oil & Masala',
//   'Eggs, Meat & Fish', 'Gourmet & World Food', 'Baby Care',
// ];

// // Fix: exact match instead of partial split
// const isFood = (category) => FOOD_CATEGORIES.includes(category);

// const getProductAccordions = (product) => {
//   const food = isFood(product.category);
//   const accordions = [];

//   if (food) {
//     accordions.push({
//       icon: 'nutrition', title: 'Ingredients', defaultOpen: true,
//       content: product.description || `${product.brand ? product.brand + ' — ' : ''}${product.name}${product.unit ? ' (' + product.unit + ')' : ''}`,
//     });
//     accordions.push({ icon: 'monitoring', title: 'Nutrition Facts', type: 'nutrition' });
//     accordions.push({ icon: 'calendar_today', title: 'Shelf Life & Storage', type: 'storage_food' });
//   } else {
//     accordions.push({
//       icon: 'info', title: 'Product Details', defaultOpen: true,
//       content: product.description || `${product.brand ? product.brand + ' — ' : ''}${product.name}${product.unit ? ' (' + product.unit + ')' : ''}`,
//     });
//     accordions.push({ icon: 'help_outline', title: 'How to Use', type: 'how_to_use' });
//     accordions.push({ icon: 'inventory_2', title: 'Storage & Safety', type: 'storage_nonfood' });
//   }

//   accordions.push({ icon: 'reviews', title: 'Customer Reviews', type: 'reviews' });
//   return accordions;
// };

// const Accordion = ({ icon, title, children, defaultOpen = false }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
//       <button onClick={() => setOpen(o => !o)}
//         className="flex items-center justify-between w-full px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
//         <div className="flex items-center gap-3">
//           <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
//             <span className="text-sm material-symbols-outlined text-primary">{icon}</span>
//           </div>
//           <span className="text-sm font-bold">{title}</span>
//         </div>
//         <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
//           expand_more
//         </span>
//       </button>
//       {open && (
//         <div className="px-5 pt-4 pb-5 text-sm leading-relaxed border-t text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// const StarRating = ({ value, onChange, size = 'text-xl' }) => (
//   <div className="flex gap-0.5">
//     {[1,2,3,4,5].map(s => (
//       <button key={s} type="button" onClick={() => onChange?.(s)} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
//         <span className={`material-symbols-outlined ${size} ${s <= value ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
//           style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//       </button>
//     ))}
//   </div>
// );

// const ProductDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { addToCart, toggleWishlist, isInWishlist } = useCart();

//   const [product, setProduct]       = useState(null);
//   const [reviews, setReviews]       = useState([]);
//   const [related, setRelated]       = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [error, setError]           = useState('');
//   const [activeImg, setActiveImg]   = useState(0);
//   const [qty, setQty]               = useState(1);
//   const [adding, setAdding]         = useState(false);
//   const [toast, setToast]           = useState({ msg: '', type: 'success' });
//   const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
//   const [submitting, setSubmitting] = useState(false);

//   const showToast = (msg, type = 'success') => {
//     setToast({ msg, type });
//     setTimeout(() => setToast({ msg: '', type: 'success' }), 2500);
//   };

//   useEffect(() => {
//     setLoading(true); setError(''); setActiveImg(0); setQty(1);
//     getProductById(id)
//       .then(({ data }) => { setProduct(data); setReviews(data.reviews || []); })
//       .catch(err => setError(err.response?.data?.message || 'Product not found'))
//       .finally(() => setLoading(false));
//     getFeaturedProducts()
//       .then(({ data }) => setRelated((Array.isArray(data) ? data : []).filter(p => p._id !== id).slice(0, 4)))
//       .catch(() => {});
//   }, [id]);

//   const handleAddToCart = async () => {
//     if (!user) { navigate('/login'); return; }
//     if (user.role !== 'customer') { showToast('Only customers can add to cart', 'error'); return; }
//     setAdding(true);
//     try {
//       await addToCart(product._id, qty);
//       showToast(product.name + ' added to cart!');
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Failed to add to cart', 'error');
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
//       showToast(err.response?.data?.message || 'Review failed', 'error');
//     } finally { setSubmitting(false); }
//   };

//   if (loading) return <Loader size="lg" />;
//   if (error) return (
//     <div className="max-w-md px-4 py-24 mx-auto text-center">
//       <span className="block mb-4 text-5xl text-red-400 material-symbols-outlined">error</span>
//       <h2 className="mb-2 text-xl font-bold">Product not found</h2>
//       <p className="mb-6 text-slate-500">{error}</p>
//       <button onClick={() => navigate('/products')} className="px-6 py-3 font-bold text-white bg-primary rounded-xl">Back to Products</button>
//     </div>
//   );
//   if (!product) return null;

//   const images = [product.image || PLACEHOLDER, product.image || PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];
//   const inWishlist = user ? isInWishlist(product._id) : false;
//   const discountPct = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
//   const food = isFood(product.category);
//   const accordions = getProductAccordions(product);

//   return (
//     <div className="max-w-6xl px-4 py-8 mx-auto space-y-12">

//       {/* Toast */}
//       {toast.msg && (
//         <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2
//           ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
//           <span className="text-sm material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
//           {toast.msg}
//         </div>
//       )}

//       {/* Breadcrumb */}
//       <nav className="flex items-center gap-2 text-sm text-slate-400">
//         <Link to="/" className="hover:text-primary">Home</Link>
//         <span>›</span>
//         <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">{product.category}</Link>
//         <span>›</span>
//         <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{product.name}</span>
//       </nav>

//       {/* Main grid */}
//       <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

//         {/* Left: Images */}
//         <div className="space-y-4">
//           {/* Main image */}
//           <div className="relative overflow-hidden border aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl border-slate-100 dark:border-slate-700">
//             <img src={images[activeImg]} alt={product.name}
//               className="object-contain w-full h-full p-6"
//               onError={e => { e.target.src = PLACEHOLDER; }} />
//             {discountPct > 0 && (
//               <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow">
//                 {discountPct}% OFF
//               </div>
//             )}
//             {product.isOrganic && (
//               <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow">
//                 🌿 Organic
//               </div>
//             )}
//             {user?.role === 'customer' && (
//               <button onClick={() => toggleWishlist(product._id)}
//                 className={`absolute bottom-4 right-4 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all
//                   ${inWishlist ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500'}`}>
//                 <span className="text-lg material-symbols-outlined" style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
//               </button>
//             )}
//           </div>

//           {/* Thumbnails */}
//           <div className="grid grid-cols-4 gap-3">
//             {images.map((img, i) => (
//               <button key={i} onClick={() => setActiveImg(i)}
//                 className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all
//                   ${activeImg === i ? 'border-primary shadow-md shadow-primary/20' : 'border-slate-100 dark:border-slate-700 hover:border-primary/40'}`}>
//                 <img src={img} alt="" className="object-contain w-full h-full p-2 bg-slate-50 dark:bg-slate-800"
//                   onError={e => { e.target.src = PLACEHOLDER; }} />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Right: Info */}
//         <div>
//           {/* Category + badge row */}
//           <div className="flex flex-wrap items-center gap-2 mb-3">
//             <Link to={`/products?category=${encodeURIComponent(product.category)}`}
//               className="px-3 py-1 text-xs font-bold transition-all rounded-full text-primary bg-primary/10 hover:bg-primary hover:text-white">
//               {product.category}
//             </Link>
//             {product.isOrganic && (
//               <span className="px-3 py-1 text-xs font-bold rounded-full text-emerald-700 bg-emerald-100">🌿 Organic</span>
//             )}
//             {product.isFeatured && (
//               <span className="px-3 py-1 text-xs font-bold rounded-full text-amber-700 bg-amber-100">⭐ Featured</span>
//             )}
//           </div>

//           <h1 className="mb-2 text-2xl font-black leading-tight md:text-3xl text-slate-800 dark:text-white">{product.name}</h1>

//           {product.brand && (
//             <p className="mb-4 text-sm text-slate-500">
//               Brand: <Link to={`/products?keyword=${product.brand}`} className="font-semibold text-primary hover:underline">{product.brand}</Link>
//               {product.unit && <span className="ml-3 text-slate-400">· {product.unit}</span>}
//             </p>
//           )}

//           {/* Stars */}
//           <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
//             <StarRating value={Math.round(product.rating || 0)} />
//             <span className="text-sm font-bold">{(product.rating || 0).toFixed(1)}</span>
//             <span className="text-sm text-slate-400">({reviews.length} reviews)</span>
//           </div>

//           {/* Price */}
//           <div className="mb-5">
//             <div className="flex items-baseline gap-3 mb-1">
//               <span className="text-4xl font-black text-slate-900 dark:text-white">₹{product.price}</span>
//               {product.originalPrice > product.price && (
//                 <span className="text-xl line-through text-slate-400">₹{product.originalPrice}</span>
//               )}
//               {discountPct > 0 && (
//                 <span className="bg-red-100 text-red-600 text-xs font-black px-2.5 py-1 rounded-full">{discountPct}% off</span>
//               )}
//             </div>
//             {product.flashSale?.active && (
//               <div className="flex items-center gap-2 mt-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg w-fit">
//                 <span className="text-sm material-symbols-outlined">timer</span>
//                 Flash sale price — limited time!
//               </div>
//             )}
//           </div>

//           {/* Qty + Add to Cart */}
//           <div className="flex items-center gap-3 mb-4">
//             <div className="flex items-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 rounded-xl">
//               <button onClick={() => setQty(q => Math.max(1, q - 1))}
//                 className="flex items-center justify-center text-xl font-bold transition-colors w-11 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">−</button>
//               <span className="w-10 font-bold text-center">{qty}</span>
//               <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
//                 className="flex items-center justify-center text-xl font-bold transition-colors w-11 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">+</button>
//             </div>
//             {product.stock > 0 ? (
//               <button onClick={handleAddToCart} disabled={adding}
//                 className="flex items-center justify-center flex-1 gap-2 text-sm font-bold text-white transition-all shadow-lg h-11 bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 shadow-primary/25">
//                 {adding ? <span className="text-base material-symbols-outlined animate-spin">progress_activity</span>
//                   : <span className="text-base material-symbols-outlined">shopping_cart</span>}
//                 {adding ? 'Adding...' : 'Add to Cart'}
//               </button>
//             ) : (
//               <div className="flex items-center justify-center flex-1 text-sm font-bold h-11 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl">
//                 Out of Stock
//               </div>
//             )}
//           </div>

//           {!user && (
//             <button onClick={() => navigate('/login')} className="w-full mb-4 text-sm font-bold text-white transition-all h-11 bg-primary rounded-xl hover:bg-primary/90">
//               Login to Add to Cart
//             </button>
//           )}

//           {/* Stock + delivery info */}
//           <div className="flex items-center gap-2 mb-5 text-xs font-semibold">
//             <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
//             <span className={product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}>
//               {product.stock > 0 ? `In stock · ${product.stock} units available` : 'Out of stock'}
//             </span>
//           </div>

//           {/* Delivery badges */}
//           <div className="grid grid-cols-3 gap-3 mb-6">
//             {[
//               { icon: 'local_shipping', label: 'Free Delivery', sub: 'Orders over ₹500' },
//               { icon: 'verified', label: 'Quality Check', sub: '100% guaranteed' },
//               { icon: 'cached', label: 'Easy Returns', sub: '7-day policy' },
//             ].map(d => (
//               <div key={d.label} className="p-3 text-center border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-100 dark:border-slate-700">
//                 <span className="block mb-1 text-xl material-symbols-outlined text-primary">{d.icon}</span>
//                 <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{d.label}</p>
//                 <p className="text-[10px] text-slate-400">{d.sub}</p>
//               </div>
//             ))}
//           </div>

//           {/* Accordions */}
//           <div className="space-y-2">
//             {accordions.map((acc, i) => (
//               <Accordion key={i} icon={acc.icon} title={acc.title === 'Customer Reviews' ? `Customer Reviews (${reviews.length})` : acc.title} defaultOpen={acc.defaultOpen}>
//                 {/* Plain text content */}
//                 {acc.content && <p>{acc.content}</p>}

//                 {/* Nutrition Facts — only for food */}
//                 {acc.type === 'nutrition' && (
//                   <div>
//                     <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
//                       {[['Calories','52 kcal'],['Carbohydrates','13.8g'],['Protein','0.3g'],['Fat','0.2g'],['Fiber','2.4g'],['Sugar','10.4g']].map(([k,v]) => (
//                         <div key={k} className="flex justify-between pb-1 border-b border-slate-100 dark:border-slate-700">
//                           <span className="text-slate-500">{k}</span><span className="font-semibold">{v}</span>
//                         </div>
//                       ))}
//                     </div>
//                     <p className="mt-2 text-xs text-slate-400">* Per 100g. Values are approximate.</p>
//                   </div>
//                 )}

//                 {/* Storage — food */}
//                 {acc.type === 'storage_food' && (
//                   <ul className="space-y-1.5 text-xs">
//                     {['Keep refrigerated at 2–4°C for best freshness','Best consumed within 5–7 days of delivery','Store away from direct sunlight','Wash thoroughly before consumption'].map(t => (
//                       <li key={t} className="flex items-start gap-2"><span className="text-secondary mt-0.5">✓</span>{t}</li>
//                     ))}
//                   </ul>
//                 )}

//                 {/* How to use — uses real DB data if available */}
//                 {acc.type === 'how_to_use' && (
//                   <ul className="space-y-2 text-xs">
//                     {(product.howToUse?.length > 0 ? product.howToUse : [
//                       'Read the label carefully before use',
//                       'Follow the instructions on the packaging',
//                       'Use the recommended quantity for best results',
//                       'Keep out of reach of children',
//                     ]).map((t, i) => (
//                       <li key={i} className="flex items-start gap-2">
//                         <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i+1}</span>
//                         {t}
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 {/* Storage — uses real DB data if available */}
//                 {acc.type === 'storage_nonfood' && (
//                   <ul className="space-y-1.5 text-xs">
//                     {(product.storage?.length > 0 ? product.storage : [
//                       'Store in a cool, dry place away from heat',
//                       'Keep away from direct sunlight',
//                       'Do not use after expiry date',
//                       'Keep container tightly closed after use',
//                     ]).map((t, i) => (
//                       <li key={i} className="flex items-start gap-2">
//                         <span className="material-symbols-outlined text-secondary text-sm flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
//                         {t}
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 {/* Food shelf life — uses real DB data if available */}
//                 {acc.type === 'storage_food' && (
//                   <ul className="space-y-1.5 text-xs">
//                     {(product.storage?.length > 0 ? product.storage : [
//                       'Refrigerate at 2–4°C for best freshness',
//                       'Best consumed within 5–7 days of delivery',
//                       'Wash thoroughly before consumption',
//                       'Store away from direct sunlight',
//                     ]).map((t, i) => (
//                       <li key={i} className="flex items-start gap-2">
//                         <span className="material-symbols-outlined text-secondary text-sm flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
//                         {t}
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 {/* Reviews */}
//                 {acc.type === 'reviews' && (
//                   <div>
//                     {user?.role === 'customer' && (
//                       <form onSubmit={handleReview} className="p-4 mb-5 bg-slate-50 dark:bg-slate-900 rounded-xl">
//                         <p className="mb-3 text-xs font-bold">Write a Review</p>
//                         <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} size="text-lg" />
//                         <textarea required rows={3} placeholder="Share your experience..."
//                           className="w-full p-3 mt-3 text-xs bg-white border outline-none resize-none border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-primary/30"
//                           value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
//                         <button type="submit" disabled={submitting}
//                           className="mt-2 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1.5">
//                           {submitting && <span className="text-xs material-symbols-outlined animate-spin">progress_activity</span>}
//                           Submit Review
//                         </button>
//                       </form>
//                     )}
//                     {reviews.length === 0 ? (
//                       <p className="py-4 text-xs text-center text-slate-400">No reviews yet. Be the first!</p>
//                     ) : (
//                       <div className="space-y-4">
//                         {reviews.map(r => (
//                           <div key={r._id} className="flex gap-3">
//                             <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-xs font-bold rounded-full bg-primary/10 text-primary">
//                               {r.user?.name?.charAt(0).toUpperCase()}
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex items-center justify-between mb-0.5">
//                                 <p className="text-xs font-semibold">{r.user?.name}</p>
//                                 <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
//                               </div>
//                               <StarRating value={r.rating} size="text-xs" />
//                               <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{r.comment}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </Accordion>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       {related.length > 0 && (
//         <section>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-black">You Might Also Like</h2>
//             <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
//               View All <span className="text-sm material-symbols-outlined">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//             {related.map(p => (
//               <Link key={p._id} to={`/products/${p._id}`}
//                 className="overflow-hidden transition-all bg-white border group dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1">
//                 <div className="overflow-hidden aspect-square bg-slate-50 dark:bg-slate-800">
//                   <img src={p.image || PLACEHOLDER} alt={p.name} className="object-cover w-full h-full transition-transform group-hover:scale-105"
//                     onError={e => { e.target.src = PLACEHOLDER; }} />
//                 </div>
//                 <div className="p-3">
//                   <p className="font-semibold text-sm truncate mb-0.5">{p.name}</p>
//                   {p.unit && <p className="mb-1 text-xs text-slate-400">{p.unit}</p>}
//                   <p className="font-black text-primary">₹{p.price}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}
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

const FOOD_CATEGORIES = [
  'Fruits & Vegetables', 'Bakery, Cakes & Dairy', 'Beverages',
  'Snacks & Branded Foods', 'Foodgrains, Oil & Masala',
  'Eggs, Meat & Fish', 'Gourmet & World Food',
];

const SEMI_FOOD = ['Baby Care']; // baby care shows product details not nutrition

const isFood = (category) => FOOD_CATEGORIES.includes(category);

// Category-specific nutrition data
const NUTRITION_BY_CATEGORY = {
  'Eggs, Meat & Fish':      [['Calories','165 kcal'],['Protein','23 g'],['Fat','7 g'],['Carbohydrates','0 g'],['Saturated Fat','2 g'],['Sodium','75 mg']],
  'Fruits & Vegetables':    [['Calories','52 kcal'],['Carbohydrates','13.8 g'],['Protein','0.3 g'],['Fat','0.2 g'],['Fiber','2.4 g'],['Sugar','10.4 g']],
  'Bakery, Cakes & Dairy':  [['Calories','148 kcal'],['Protein','8 g'],['Fat','8 g'],['Carbohydrates','12 g'],['Calcium','276 mg'],['Sugar','12 g']],
  'Beverages':              [['Calories','45 kcal'],['Sugar','10 g'],['Sodium','10 mg'],['Carbohydrates','11 g'],['Protein','0 g'],['Fat','0 g']],
  'Snacks & Branded Foods': [['Calories','530 kcal'],['Total Fat','34 g'],['Carbohydrates','55 g'],['Protein','6 g'],['Sodium','500 mg'],['Sugar','3 g']],
  'Foodgrains, Oil & Masala':[['Calories','350 kcal'],['Carbohydrates','72 g'],['Protein','9 g'],['Fat','2 g'],['Fiber','3.5 g'],['Iron','4 mg']],
  'Gourmet & World Food':   [['Calories','210 kcal'],['Carbohydrates','30 g'],['Protein','5 g'],['Fat','8 g'],['Sodium','600 mg'],['Fiber','2 g']],
};

// Category-specific storage info
const STORAGE_BY_CATEGORY = {
  'Eggs, Meat & Fish':       ['Refrigerate immediately at 0–4°C upon delivery','Consume within 1–2 days for maximum freshness','Keep away from other foods to prevent cross-contamination','Cook thoroughly to safe internal temperature before consuming','Do not refreeze once thawed'],
  'Fruits & Vegetables':     ['Refrigerate at 4–8°C for best freshness','Best consumed within 5–7 days of delivery','Wash thoroughly under running water before use','Store away from strong-smelling foods','Keep leafy greens wrapped in a damp cloth'],
  'Bakery, Cakes & Dairy':   ['Refrigerate immediately — do not leave at room temperature','Consume by the date printed on the packaging','Do not freeze unless clearly indicated on the pack','Keep away from direct sunlight and heat'],
  'Beverages':               ['Store in a cool dry place before opening','Refrigerate after opening and consume within 24–48 hours','Best served chilled at 4–6°C','Avoid exposure to direct sunlight'],
  'Snacks & Branded Foods':  ['Store in a cool dry place away from sunlight','Best before date is printed on the package','Once opened store in an airtight container','Keep away from moisture and humidity'],
  'Foodgrains, Oil & Masala':['Store in an airtight container after opening','Keep in a cool dry dark place','Always use a dry spoon to prevent moisture','Check the best before date before consuming'],
  'Gourmet & World Food':    ['Refrigerate after opening and use within 3–5 days','Store in a cool dry place before opening','Keep container tightly sealed after use','Check best before date before consumption'],
  'Beauty & Hygiene':        ['Store in a cool dry place away from direct sunlight','Keep the cap tightly closed when not in use','Do not store above 30°C or in humid conditions','Keep away from children','Do not use after the expiry date'],
  'Cleaning & Household':    ['Store in original container with lid tightly sealed','Keep away from food beverages and children','Store away from heat sources and direct sunlight','Do not store above 45°C','In case of spillage clean immediately with water'],
  'Kitchen, Garden & Pets':  ['Store in a clean dry place at room temperature','Keep away from sharp objects that may cause damage','Do not expose to extreme heat or direct sunlight','Ensure fully dry before storing'],
  'Baby Care':               ['Store at room temperature between 15–30°C','Keep away from direct sunlight and moisture','Seal tightly after each use','Store out of reach of children'],
};

// Category-specific how-to-use
const HOW_TO_USE_BY_CATEGORY = {
  'Eggs, Meat & Fish':       ['Wash hands before and after handling raw meat','Cook thoroughly to a safe internal temperature','For chicken: internal temp should reach 75°C','Marinate in the refrigerator never at room temperature','Do not consume raw unless specified as safe'],
  'Fruits & Vegetables':     ['Wash thoroughly under running water before consuming','Peel chop or slice as required for your recipe','Can be consumed raw steamed stir-fried or cooked','Best consumed fresh for maximum nutrients and flavour','Blanch leafy vegetables briefly before cooking'],
  'Bakery, Cakes & Dairy':   ['Consume directly or use as part of your recipe','Refrigerate immediately after opening','Check expiry date before consumption','Do not consume if the seal is broken upon delivery'],
  'Beauty & Hygiene':        ['Apply a small amount to the affected area','Massage gently in circular motions until absorbed','Use twice daily morning and night for best results','Avoid contact with eyes — rinse immediately if contact occurs','Patch test recommended for sensitive skin'],
  'Cleaning & Household':    ['Dilute as per instructions on the label before use','Apply to the surface and scrub with a brush or cloth','Leave for 2–3 minutes for tough stains then rinse','Rinse thoroughly with clean water after cleaning','Wear gloves when using concentrated product'],
  'Baby Care':               ['Use only as directed on the label for infants','Apply gently — avoid contact with eyes and mouth','Discontinue immediately if any irritation occurs','Consult a paediatrician before use on newborns under 3 months'],
  'Kitchen, Garden & Pets':  ['Read the instruction leaflet before first use','Wash with mild soap and water before first use','Clean after each use and dry thoroughly before storing','Do not use abrasive cleaners — use a soft cloth only'],
};

const getProductAccordions = (product) => {
  const cat = product.category;
  const food = isFood(cat);
  const accordions = [];

  if (food) {
    // Ingredients — use product description if available
    accordions.push({
      icon: 'nutrition', title: 'Ingredients', defaultOpen: true,
      content: product.description || `${product.brand ? product.brand + ' — ' : ''}${product.name}${product.unit ? ' (' + product.unit + ')' : ''}`,
    });
    // Nutrition — category-specific values
    accordions.push({ icon: 'monitoring', title: 'Nutrition Facts', type: 'nutrition' });
    // Storage — category-specific
    accordions.push({ icon: 'calendar_today', title: 'Shelf Life & Storage', type: 'storage_food' });
  } else if (SEMI_FOOD.includes(cat)) {
    accordions.push({
      icon: 'info', title: 'Product Details', defaultOpen: true,
      content: product.description || `${product.brand ? product.brand + ' — ' : ''}${product.name}`,
    });
    accordions.push({ icon: 'help_outline', title: 'How to Use', type: 'how_to_use' });
    accordions.push({ icon: 'inventory_2', title: 'Storage & Safety', type: 'storage_nonfood' });
  } else {
    accordions.push({
      icon: 'info', title: 'Product Details', defaultOpen: true,
      content: product.description || `${product.brand ? product.brand + ' — ' : ''}${product.name}`,
    });
    accordions.push({ icon: 'help_outline', title: 'How to Use', type: 'how_to_use' });
    accordions.push({ icon: 'inventory_2', title: 'Storage & Safety', type: 'storage_nonfood' });
  }

  accordions.push({ icon: 'reviews', title: 'Customer Reviews', type: 'reviews' });
  return accordions;
};

const Accordion = ({ icon, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
            <span className="text-sm material-symbols-outlined text-primary">{icon}</span>
          </div>
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
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange?.(s)} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
        <span className={`material-symbols-outlined ${size} ${s <= value ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
          style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
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
      <button onClick={() => navigate('/products')} className="px-6 py-3 font-bold text-white bg-primary rounded-xl">Back to Products</button>
    </div>
  );
  if (!product) return null;

  // Build image list from product.images[] or fallback to single image
  const allImages = product.images?.length > 0
    ? product.images
    : [product.image].filter(Boolean);
  const images = allImages.length > 0 ? allImages : [PLACEHOLDER];
  const inWishlist = user ? isInWishlist(product._id) : false;
  const discountPct = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const food = isFood(product.category);
  const accordions = getProductAccordions(product);

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto space-y-12">

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2
          ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          <span className="text-sm material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>›</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">{product.category}</Link>
        <span>›</span>
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* Left: Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative overflow-hidden border aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl border-slate-100 dark:border-slate-700">
            <img src={images[activeImg]} alt={product.name}
              className="object-contain w-full h-full p-6"
              onError={e => { e.target.src = PLACEHOLDER; }} />
            {discountPct > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow">
                {discountPct}% OFF
              </div>
            )}
            {product.isOrganic && (
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow">
                🌿 Organic
              </div>
            )}
            {user?.role === 'customer' && (
              <button onClick={() => toggleWishlist(product._id)}
                className={`absolute bottom-4 right-4 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all
                  ${inWishlist ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500'}`}>
                <span className="text-lg material-symbols-outlined" style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </button>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all
                  ${activeImg === i ? 'border-primary shadow-md shadow-primary/20' : 'border-slate-100 dark:border-slate-700 hover:border-primary/40'}`}>
                <img src={img} alt="" className="object-contain w-full h-full p-2 bg-slate-50 dark:bg-slate-800"
                  onError={e => { e.target.src = PLACEHOLDER; }} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          {/* Category + badge row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link to={`/products?category=${encodeURIComponent(product.category)}`}
              className="px-3 py-1 text-xs font-bold transition-all rounded-full text-primary bg-primary/10 hover:bg-primary hover:text-white">
              {product.category}
            </Link>
            {product.isOrganic && (
              <span className="px-3 py-1 text-xs font-bold rounded-full text-emerald-700 bg-emerald-100">🌿 Organic</span>
            )}
            {product.isFeatured && (
              <span className="px-3 py-1 text-xs font-bold rounded-full text-amber-700 bg-amber-100">⭐ Featured</span>
            )}
          </div>

          <h1 className="mb-2 text-2xl font-black leading-tight md:text-3xl text-slate-800 dark:text-white">{product.name}</h1>

          {product.brand && (
            <p className="mb-4 text-sm text-slate-500">
              Brand: <Link to={`/products?keyword=${product.brand}`} className="font-semibold text-primary hover:underline">{product.brand}</Link>
              {product.unit && <span className="ml-3 text-slate-400">· {product.unit}</span>}
            </p>
          )}

          {/* Stars */}
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
            <StarRating value={Math.round(product.rating || 0)} />
            <span className="text-sm font-bold">{(product.rating || 0).toFixed(1)}</span>
            <span className="text-sm text-slate-400">({reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-5">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl line-through text-slate-400">₹{product.originalPrice}</span>
              )}
              {discountPct > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-black px-2.5 py-1 rounded-full">{discountPct}% off</span>
              )}
            </div>
            {product.flashSale?.active && (
              <div className="flex items-center gap-2 mt-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg w-fit">
                <span className="text-sm material-symbols-outlined">timer</span>
                Flash sale price — limited time!
              </div>
            )}
          </div>

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 rounded-xl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="flex items-center justify-center text-xl font-bold transition-colors w-11 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">−</button>
              <span className="w-10 font-bold text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                className="flex items-center justify-center text-xl font-bold transition-colors w-11 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">+</button>
            </div>
            {product.stock > 0 ? (
              <button onClick={handleAddToCart} disabled={adding}
                className="flex items-center justify-center flex-1 gap-2 text-sm font-bold text-white transition-all shadow-lg h-11 bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 shadow-primary/25">
                {adding ? <span className="text-base material-symbols-outlined animate-spin">progress_activity</span>
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
            <button onClick={() => navigate('/login')} className="w-full mb-4 text-sm font-bold text-white transition-all h-11 bg-primary rounded-xl hover:bg-primary/90">
              Login to Add to Cart
            </button>
          )}

          {/* Stock + delivery info */}
          <div className="flex items-center gap-2 mb-5 text-xs font-semibold">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}>
              {product.stock > 0 ? `In stock · ${product.stock} units available` : 'Out of stock'}
            </span>
          </div>

          {/* Delivery badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: 'local_shipping', label: 'Free Delivery', sub: 'Orders over ₹500' },
              { icon: 'verified', label: 'Quality Check', sub: '100% guaranteed' },
              { icon: 'cached', label: 'Easy Returns', sub: '7-day policy' },
            ].map(d => (
              <div key={d.label} className="p-3 text-center border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-100 dark:border-slate-700">
                <span className="block mb-1 text-xl material-symbols-outlined text-primary">{d.icon}</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{d.label}</p>
                <p className="text-[10px] text-slate-400">{d.sub}</p>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="space-y-2">
            {accordions.map((acc, i) => (
              <Accordion key={i} icon={acc.icon} title={acc.title === 'Customer Reviews' ? `Customer Reviews (${reviews.length})` : acc.title} defaultOpen={acc.defaultOpen}>
                {/* Plain text content */}
                {acc.content && <p className="text-sm text-slate-600 dark:text-slate-400">{acc.content}</p>}

                {/* Nutrition Facts — category-specific values */}
                {acc.type === 'nutrition' && (
                  <div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {(NUTRITION_BY_CATEGORY[product.category] || NUTRITION_BY_CATEGORY['Fruits & Vegetables']).map(([k,v]) => (
                        <div key={k} className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1.5">
                          <span className="text-slate-500">{k}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{v}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-slate-400">* Per 100g serving. Values are approximate.</p>
                  </div>
                )}

                {/* Storage — food (category-specific) */}
                {acc.type === 'storage_food' && (
                  <ul className="space-y-2 text-xs">
                    {(product.storage?.length > 0
                      ? product.storage
                      : STORAGE_BY_CATEGORY[product.category] || STORAGE_BY_CATEGORY['Fruits & Vegetables']
                    ).map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-secondary text-sm flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* How to use — category-specific */}
                {acc.type === 'how_to_use' && (
                  <ul className="space-y-2 text-xs">
                    {(product.howToUse?.length > 0
                      ? product.howToUse
                      : HOW_TO_USE_BY_CATEGORY[product.category] || HOW_TO_USE_BY_CATEGORY['Beauty & Hygiene']
                    ).map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i+1}</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Storage — non-food (category-specific) */}
                {acc.type === 'storage_nonfood' && (
                  <ul className="space-y-2 text-xs">
                    {(product.storage?.length > 0
                      ? product.storage
                      : STORAGE_BY_CATEGORY[product.category] || STORAGE_BY_CATEGORY['Beauty & Hygiene']
                    ).map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-secondary text-sm flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Reviews */}
                {acc.type === 'reviews' && (
                  <div>
                    {user?.role === 'customer' && (
                      <form onSubmit={handleReview} className="p-4 mb-5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <p className="mb-3 text-xs font-bold">Write a Review</p>
                        <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} size="text-lg" />
                        <textarea required rows={3} placeholder="Share your experience..."
                          className="w-full p-3 mt-3 text-xs bg-white border outline-none resize-none border-slate-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-primary/30"
                          value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
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
                  </div>
                )}
              </Accordion>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black">You Might Also Like</h2>
            <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View All <span className="text-sm material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map(p => (
              <Link key={p._id} to={`/products/${p._id}`}
                className="overflow-hidden transition-all bg-white border group dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1">
                <div className="overflow-hidden aspect-square bg-slate-50 dark:bg-slate-800">
                  <img src={p.image || PLACEHOLDER} alt={p.name} className="object-cover w-full h-full transition-transform group-hover:scale-105"
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