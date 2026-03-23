// import { Link } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import { useState } from 'react';

// const CATEGORY_EMOJI = {
//   'Fruits & Vegetables':     { emoji: '🥦', bg: 'from-green-50 to-emerald-100' },
//   'Bakery, Cakes & Dairy':   { emoji: '🥛', bg: 'from-blue-50 to-sky-100' },
//   'Beverages':               { emoji: '🥤', bg: 'from-purple-50 to-violet-100' },
//   'Beauty & Hygiene':        { emoji: '🧴', bg: 'from-pink-50 to-rose-100' },
//   'Cleaning & Household':    { emoji: '🧹', bg: 'from-slate-50 to-gray-100' },
//   'Eggs, Meat & Fish':       { emoji: '🥩', bg: 'from-red-50 to-rose-100' },
//   'Foodgrains, Oil & Masala':{ emoji: '🫙', bg: 'from-orange-50 to-amber-100' },
//   'Gourmet & World Food':    { emoji: '🍜', bg: 'from-yellow-50 to-amber-100' },
//   'Kitchen, Garden & Pets':  { emoji: '🍳', bg: 'from-cyan-50 to-teal-100' },
//   'Snacks & Branded Foods':  { emoji: '🍿', bg: 'from-yellow-50 to-orange-100' },
//   'Baby Care':               { emoji: '🍼', bg: 'from-blue-50 to-indigo-100' },
// };

// const ProductImage = ({ src, name, category }) => {
//   const [status, setStatus] = useState('loading');
//   const fallback = CATEGORY_EMOJI[category] || { emoji: '🛒', bg: 'from-slate-50 to-slate-100' };

//   return (
//     <div className="relative w-full h-full">
//       {status === 'loading' && (
//         <div className={`absolute inset-0 bg-gradient-to-br ${fallback.bg} flex flex-col items-center justify-center gap-1 animate-pulse`}>
//           <span className="text-4xl">{fallback.emoji}</span>
//           <span className="text-xs font-medium text-slate-400">Loading...</span>
//         </div>
//       )}
//       {status === 'error' && (
//         <div className={`absolute inset-0 bg-gradient-to-br ${fallback.bg} flex flex-col items-center justify-center gap-2`}>
//           <span className="text-5xl">{fallback.emoji}</span>
//           <span className="px-2 text-xs font-medium text-center text-slate-500 line-clamp-2">{name}</span>
//         </div>
//       )}
//       {src && (
//         <img
//           src={src}
//           alt={name}
//           loading="lazy"
//           onLoad={() => setStatus('loaded')}
//           onError={() => setStatus('error')}
//           className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500
//             ${status === 'loaded' ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
//         />
//       )}
//       {!src && status === 'loading' && setStatus('error')}
//     </div>
//   );
// };

// export default function ProductCard({ product }) {
//   const { addToCart, toggleWishlist, isInWishlist } = useCart();
//   const { user } = useAuth();
//   const [adding, setAdding] = useState(false);
//   const [added, setAdded] = useState(false);

//   const inWishlist = user ? isInWishlist(product._id) : false;

//   const handleAddToCart = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!user || user.role !== 'customer') return;
//     setAdding(true);
//     try {
//       await addToCart(product._id, 1);
//       setAdded(true);
//       setTimeout(() => setAdded(false), 1500);
//     } catch (_) {}
//     finally { setAdding(false); }
//   };

//   const handleWishlist = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!user || user.role !== 'customer') return;
//     try { await toggleWishlist(product._id); } catch (_) {}
//   };

//   // Safe values — guard against null/undefined/0
//   const price         = Number(product.price)         || 0;
//   const originalPrice = Number(product.originalPrice) || 0;
//   const discount      = Number(product.discount)      || 0;
//   const flashSale     = product.flashSale?.active ? product.flashSale : null;

//   // Only show discount badge if there is a real discount
//   const discountPct = originalPrice > price && originalPrice > 0
//     ? Math.round(((originalPrice - price) / originalPrice) * 100)
//     : discount > 0 ? discount : 0;

//   // Only show strikethrough if original is genuinely higher
//   const showOriginal = originalPrice > price && originalPrice > 0;

//   return (
//     <Link to={`/products/${product._id}`}
//       className={`flex flex-col overflow-hidden transition-all duration-300 bg-white border group dark:bg-slate-900 rounded-2xl hover:shadow-xl hover:-translate-y-1
//         ${flashSale ? 'border-orange-400 shadow-orange-100 dark:shadow-orange-900/20' : 'border-slate-200 dark:border-slate-800 hover:shadow-primary/10'}`}>

//       {/* Image */}
//       <div className="relative overflow-hidden aspect-square">
//         <ProductImage src={product.image} name={product.name} category={product.category} />

//         {/* Flash sale badge — takes priority over regular discount */}
//         {flashSale ? (
//           <span className="absolute z-10 flex items-center gap-1 px-2 py-1 text-xs font-black text-white bg-orange-500 rounded-full shadow top-2 left-2 animate-pulse">
//             ⚡ {flashSale.discount}% OFF
//           </span>
//         ) : discountPct > 0 ? (
//           <span className="absolute z-10 px-2 py-1 text-xs font-black text-white rounded-full shadow top-2 left-2 bg-secondary">
//             {discountPct}% OFF
//           </span>
//         ) : null}

//         {product.isOrganic && (
//           <span className="absolute z-10 px-2 py-1 text-xs font-bold text-white rounded-full shadow top-2 right-2 bg-emerald-500">
//             Organic
//           </span>
//         )}
//         {user?.role === 'customer' && (
//           <button onClick={handleWishlist}
//             className={`absolute bottom-2 right-2 p-1.5 rounded-full shadow-md transition-all z-10
//               ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}>
//             <span className="text-base material-symbols-outlined"
//               style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
//           </button>
//         )}
//       </div>

//       {/* Info */}
//       <div className="flex flex-col flex-1 p-3">
//         <p className="mb-1 text-xs font-bold tracking-wider uppercase text-primary">{product.category}</p>
//         <h3 className="flex-1 text-sm font-semibold leading-snug line-clamp-2 text-slate-800 dark:text-slate-200">{product.name}</h3>

//         {/* Stars */}
//         <div className="flex items-center gap-0.5 my-2">
//           {[1,2,3,4,5].map(s => (
//             <span key={s}
//               className={`material-symbols-outlined text-xs ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
//               style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//           ))}
//           <span className="ml-1 text-xs text-slate-400">({product.numReviews})</span>
//         </div>

//         {/* Flash sale timer */}
//         {flashSale?.endTime && (
//           <div className="flex items-center gap-1 mb-1.5 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded-lg">
//             <span className="text-xs material-symbols-outlined">timer</span>
//             Flash sale ends: {new Date(flashSale.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
//           </div>
//         )}

//         {/* Price row */}
//         <div className="flex items-center justify-between pt-1 mt-auto">
//           <div className="flex flex-wrap items-center gap-1">
//             <span className={`text-base font-black ${flashSale ? 'text-orange-600' : 'text-primary'}`}>₹{price}</span>
//             {showOriginal && (
//               <span className="text-xs line-through text-slate-400">₹{originalPrice}</span>
//             )}
//             {!flashSale && product.priceChangePercent && Math.abs(product.priceChangePercent) >= 1 ? (
//               <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
//                 ${product.priceChangePercent > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
//                 <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>
//                   {product.priceChangePercent > 0 ? 'trending_up' : 'trending_down'}
//                 </span>
//                 {product.priceChangePercent > 0 ? '+' : ''}{Number(product.priceChangePercent).toFixed(1)}%
//               </span>
//             ) : null}
//           </div>

//           {user?.role === 'customer' && (
//             product.stock > 0 ? (
//               <button onClick={handleAddToCart} disabled={adding}
//                 className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm
//                   ${added ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary/90 disabled:opacity-60'}`}>
//                 {adding
//                   ? <span className="text-sm material-symbols-outlined animate-spin">progress_activity</span>
//                   : added
//                   ? <span className="text-sm material-symbols-outlined">check</span>
//                   : <span className="text-sm material-symbols-outlined">add</span>}
//                 {added ? 'Added!' : 'Add'}
//               </button>
//             ) : (
//               <span className="text-xs font-semibold text-red-400">Out of stock</span>
//             )
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const CATEGORY_EMOJI = {
  'Fruits & Vegetables':     { emoji: '🥦', bg: 'from-green-50 to-emerald-100' },
  'Bakery, Cakes & Dairy':   { emoji: '🥛', bg: 'from-blue-50 to-sky-100' },
  'Beverages':               { emoji: '🥤', bg: 'from-purple-50 to-violet-100' },
  'Beauty & Hygiene':        { emoji: '🧴', bg: 'from-pink-50 to-rose-100' },
  'Cleaning & Household':    { emoji: '🧹', bg: 'from-slate-50 to-gray-100' },
  'Eggs, Meat & Fish':       { emoji: '🥩', bg: 'from-red-50 to-rose-100' },
  'Foodgrains, Oil & Masala':{ emoji: '🫙', bg: 'from-orange-50 to-amber-100' },
  'Gourmet & World Food':    { emoji: '🍜', bg: 'from-yellow-50 to-amber-100' },
  'Kitchen, Garden & Pets':  { emoji: '🍳', bg: 'from-cyan-50 to-teal-100' },
  'Snacks & Branded Foods':  { emoji: '🍿', bg: 'from-yellow-50 to-orange-100' },
  'Baby Care':               { emoji: '🍼', bg: 'from-blue-50 to-indigo-100' },
};

const ProductImage = ({ src, name, category }) => {
  const [status, setStatus] = useState('loading');
  const fallback = CATEGORY_EMOJI[category] || { emoji: '🛒', bg: 'from-slate-50 to-slate-100' };

  return (
    <div className="relative w-full h-full">
      {status === 'loading' && (
        <div className={`absolute inset-0 bg-gradient-to-br ${fallback.bg} flex flex-col items-center justify-center gap-1 animate-pulse`}>
          <span className="text-4xl">{fallback.emoji}</span>
          <span className="text-xs font-medium text-slate-400">Loading...</span>
        </div>
      )}
      {status === 'error' && (
        <div className={`absolute inset-0 bg-gradient-to-br ${fallback.bg} flex flex-col items-center justify-center gap-2`}>
          <span className="text-5xl">{fallback.emoji}</span>
          <span className="px-2 text-xs font-medium text-center text-slate-500 line-clamp-2">{name}</span>
        </div>
      )}
      {src && (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500
            ${status === 'loaded' ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
        />
      )}
      {!src && status === 'loading' && setStatus('error')}
    </div>
  );
};

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const inWishlist = user ? isInWishlist(product._id) : false;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.role !== 'customer') return;
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (_) {}
    finally { setAdding(false); }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.role !== 'customer') return;
    try { await toggleWishlist(product._id); } catch (_) {}
  };

  // Safe values — guard against null/undefined/0
  const price         = Number(product.price)         || 0;
  const originalPrice = Number(product.originalPrice) || 0;
  const discount      = Number(product.discount)      || 0;
  const flashSale     = product.flashSale?.active ? product.flashSale : null;

  // Only show discount badge if there is a real discount
  const discountPct = originalPrice > price && originalPrice > 0
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : discount > 0 ? discount : 0;

  // Only show strikethrough if original is genuinely higher
  const showOriginal = originalPrice > price && originalPrice > 0;

  return (
    <Link to={`/products/${product._id}`}
      className={`flex flex-col overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900 border group rounded-2xl hover:shadow-xl hover:-translate-y-1
        ${flashSale ? 'border-orange-400 shadow-orange-100' : 'border-slate-200 dark:border-slate-800 hover:shadow-primary/10'}`}>

      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <ProductImage src={product.image} name={product.name} category={product.category} />

        {/* Flash sale badge — takes priority over regular discount */}
        {flashSale ? (
          <span className="absolute z-10 flex items-center gap-1 px-2 py-1 text-xs font-black text-white bg-orange-500 rounded-full shadow top-2 left-2 animate-pulse">
            ⚡ {flashSale.discount}% OFF
          </span>
        ) : discountPct > 0 ? (
          <span className="absolute z-10 px-2 py-1 text-xs font-black text-white rounded-full shadow top-2 left-2 bg-secondary">
            {discountPct}% OFF
          </span>
        ) : null}

        {product.isOrganic && (
          <span className="absolute z-10 px-2 py-1 text-xs font-bold text-white rounded-full shadow top-2 right-2 bg-emerald-500">
            Organic
          </span>
        )}
        {user?.role === 'customer' && (
          <button onClick={handleWishlist}
            className={`absolute bottom-2 right-2 p-1.5 rounded-full shadow-md transition-all z-10
              ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}>
            <span className="text-base material-symbols-outlined"
              style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        <p className="mb-1 text-xs font-bold tracking-wider uppercase text-primary">{product.category}</p>
        <h3 className="flex-1 text-sm font-semibold leading-snug line-clamp-2 text-slate-800 dark:text-slate-200">{product.name}</h3>

        {/* Stars */}
        <div className="flex items-center gap-0.5 my-2">
          {[1,2,3,4,5].map(s => (
            <span key={s}
              className={`material-symbols-outlined text-xs ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
              style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          ))}
          <span className="ml-1 text-xs text-slate-400">({product.numReviews})</span>
        </div>

        {/* Flash sale timer */}
        {flashSale?.endTime && (
          <div className="flex items-center gap-1 mb-1.5 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded-lg">
            <span className="text-xs material-symbols-outlined">timer</span>
            Flash sale ends: {new Date(flashSale.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="flex flex-wrap items-center gap-1">
            <span className={`text-base font-black ${flashSale ? 'text-orange-600' : 'text-primary'}`}>₹{price}</span>
            {showOriginal && (
              <span className="text-xs line-through text-slate-400">₹{originalPrice}</span>
            )}
            {!flashSale && product.priceChangePercent && Math.abs(product.priceChangePercent) >= 1 ? (
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${product.priceChangePercent > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>
                  {product.priceChangePercent > 0 ? 'trending_up' : 'trending_down'}
                </span>
                {product.priceChangePercent > 0 ? '+' : ''}{Number(product.priceChangePercent).toFixed(1)}%
              </span>
            ) : null}
          </div>

          {user?.role === 'customer' && (
            product.stock > 0 ? (
              <button onClick={handleAddToCart} disabled={adding}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm
                  ${added ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary/90 disabled:opacity-60'}`}>
                {adding
                  ? <span className="text-sm material-symbols-outlined animate-spin">progress_activity</span>
                  : added
                  ? <span className="text-sm material-symbols-outlined">check</span>
                  : <span className="text-sm material-symbols-outlined">add</span>}
                {added ? 'Added!' : 'Add'}
              </button>
            ) : (
              <span className="text-xs font-semibold text-red-400">Out of stock</span>
            )
          )}
        </div>
      </div>
    </Link>
  );
}