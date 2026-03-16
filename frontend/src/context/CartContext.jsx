import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCart, addToCart as apiAddToCart, updateCartItem,
  removeFromCart as apiRemoveFromCart, clearCart as apiClearCart,
  getWishlist, toggleWishlist as apiToggleWishlist,
} from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]         = useState({ items: [] });
  const [wishlist, setWishlist] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!user || user.role !== 'customer') { setCart({ items: [] }); return; }
    try { const { data } = await getCart(); setCart(data); } catch (_) {}
  }, [user]);

  const fetchWishlist = useCallback(async () => {
    if (!user || user.role !== 'customer') { setWishlist([]); return; }
    try {
      const { data } = await getWishlist();
      // backend returns the Wishlist document: { _id, user, products: [...] }
      setWishlist(data.products || []);
    } catch (_) {}
  }, [user]);

  useEffect(() => { fetchCart(); fetchWishlist(); }, [fetchCart, fetchWishlist]);

  // Used by ProductDetails: addToCart(productId, qty)
  const addToCart = async (productId, quantity = 1) => {
    const { data } = await apiAddToCart({ productId, quantity });
    // backend returns the populated cart document
    setCart(data);
    return data;
  };

  // Used by Cart: updateQuantity(productId, qty) — removes if qty <= 0
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) { await removeFromCart(productId); return; }
    const { data } = await updateCartItem(productId, { quantity });
    setCart(data);
  };

  // Used by Cart: removeFromCart(productId)
  const removeFromCart = async (productId) => {
    const { data } = await apiRemoveFromCart(productId);
    setCart(data);
  };

  // Used by Cart: clearCart()
  const clearCart = async () => {
    await apiClearCart();
    setCart({ items: [] });
  };

  // Used by ProductCard / ProductDetails: toggleWishlist(productId)
  const toggleWishlist = async (productId) => {
    const { data } = await apiToggleWishlist(productId);
    // backend returns { wishlist: { products: [...] }, added: bool }
    setWishlist(data.wishlist?.products || []);
  };

  // Used by ProductCard / ProductDetails: isInWishlist(productId)
  const isInWishlist = (productId) =>
    wishlist.some(p => String(p._id || p) === String(productId));

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, wishlist, cartCount, cartTotal,
      addToCart, updateQuantity, removeFromCart, clearCart,
      toggleWishlist, isInWishlist,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
