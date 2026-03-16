import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);
export const getProfile   = ()     => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts        = (params)     => API.get('/products', { params });
export const getFeaturedProducts = ()          => API.get('/products/featured');
export const getProductById     = (id)         => API.get(`/products/${id}`);
export const createReview       = (id, data)   => API.post(`/products/${id}/reviews`, data);
export const createProduct      = (data)       => API.post('/products', data);
export const updateProduct      = (id, data)   => API.put(`/products/${id}`, data);
export const deleteProduct      = (id)         => API.delete(`/products/${id}`);
// aliases used by ManageProducts
export const adminCreateProduct = createProduct;
export const adminUpdateProduct = updateProduct;
export const adminDeleteProduct = deleteProduct;

// ── Cart ──────────────────────────────────────────────────────────────────────
export const getCart         = ()           => API.get('/cart');
export const addToCart       = (data)       => API.post('/cart', data);
export const updateCartItem  = (pid, data)  => API.put(`/cart/${pid}`, data);
export const removeFromCart  = (pid)        => API.delete(`/cart/${pid}`);
export const clearCart       = ()           => API.delete('/cart');
export const getWishlist     = ()           => API.get('/cart/wishlist/all');
export const toggleWishlist  = (pid)        => API.post(`/cart/wishlist/${pid}`);

// ── Orders ────────────────────────────────────────────────────────────────────
export const createOrder    = (data) => API.post('/orders', data);
export const getMyOrders    = ()     => API.get('/orders/my');
export const getOrderById   = (id)   => API.get(`/orders/${id}`);
export const validateCoupon = (data) => API.post('/orders/coupon', data);

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAnalytics          = ()          => API.get('/admin/analytics');
export const getAllOrders           = (params)    => API.get('/admin/orders', { params });
export const assignDeliveryPerson  = (id, data)  => API.put(`/admin/orders/${id}/assign`, data);
export const cancelOrderAdmin      = (id)        => API.put(`/admin/orders/${id}/cancel`);
export const getAllUsers            = (params)    => API.get('/admin/users', { params });
export const toggleUserStatus      = (id)        => API.put(`/admin/users/${id}/toggle`);
export const getDeliveryPersons    = ()          => API.get('/admin/delivery-persons');
export const getCoupons            = ()          => API.get('/admin/coupons');
export const createCoupon          = (data)      => API.post('/admin/coupons', data);

// ── Delivery ──────────────────────────────────────────────────────────────────
export const getAssignedOrders      = ()    => API.get('/delivery/orders');
export const getCompletedDeliveries = ()    => API.get('/delivery/completed');
export const getDeliveryStats       = ()    => API.get('/delivery/stats');
export const acceptOrder            = (id)  => API.put(`/delivery/orders/${id}/accept`);
export const outForDelivery         = (id)  => API.put(`/delivery/orders/${id}/out-for-delivery`);
export const markDelivered          = (id)  => API.put(`/delivery/orders/${id}/delivered`);

export default API;
