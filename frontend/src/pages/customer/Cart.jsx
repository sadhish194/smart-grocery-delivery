import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Loader } from '../../components/SharedComponents';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80';

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryCharge = cartTotal > 500 ? 0 : 40;
  const total = cartTotal + deliveryCharge;

  if (!cart) return <Loader />;

  if (cart.items.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-black mb-2">Your cart is empty</h2>
      <p className="text-slate-500 mb-6">Looks like you haven't added any products yet.</p>
      <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
        Shop Now
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Shopping Cart</h1>
        <button onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
          <span className="material-symbols-outlined text-sm">delete</span> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold">Items ({cart.items.length})</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {cart.items.map(item => (
              <div key={item.product?._id} className="flex items-center gap-4 p-5">
                <img
                  src={item.product?.image || PLACEHOLDER}
                  alt={item.product?.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-0.5 truncate">{item.product?.name}</p>
                  <p className="text-xs text-slate-500 mb-2">{item.product?.category} · {item.product?.unit}</p>
                  <p className="text-primary font-bold">₹{item.product?.price}</p>
                </div>
                {/* Quantity control */}
                <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <div className="text-right min-w-[80px] shrink-0">
                  <p className="font-bold">₹{(item.product?.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.product._id)}
                    className="text-red-400 hover:text-red-600 mt-1 transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sticky top-20">
            <h2 className="font-bold text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className={`font-semibold ${deliveryCharge === 0 ? 'text-emerald-500' : ''}`}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-slate-400">
                  Add ₹{(500 - cartTotal).toFixed(0)} more for free delivery
                </p>
              )}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-black text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">payment</span>
              Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center mt-3 text-sm text-primary hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
