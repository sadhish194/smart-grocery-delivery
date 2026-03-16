// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { createOrder, validateCoupon } from '../../services/api';

// const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80';
// const PAYMENT_METHODS = [
//   { id: 'UPI',        label: 'UPI (Google Pay, PhonePe, Paytm)', icon: 'qr_code_2' },
//   { id: 'Card',       label: 'Credit / Debit Card',               icon: 'credit_card' },
//   { id: 'NetBanking', label: 'Net Banking',                        icon: 'account_balance' },
//   { id: 'COD',        label: 'Cash on Delivery',                   icon: 'payments' },
// ];

// const Checkout = () => {
//   const { user } = useAuth();
//   const { cart, cartTotal } = useCart();
//   const navigate = useNavigate();

//   const [address, setAddress] = useState({
//     street:  user?.address?.street  || '',
//     city:    user?.address?.city    || '',
//     state:   user?.address?.state   || '',
//     zipCode: user?.address?.zipCode || '',
//     phone:   user?.phone            || '',
//   });
//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const [couponCode, setCouponCode]       = useState('');
//   const [discount, setDiscount]           = useState(0);
//   const [couponMsg, setCouponMsg]         = useState('');
//   const [loading, setLoading]             = useState(false);
//   const [error, setError]                 = useState('');

//   const deliveryCharge = cartTotal > 500 ? 0 : 40;
//   const total = cartTotal - discount + deliveryCharge;

//   if (!cart || cart.items.length === 0) {
//     navigate('/cart');
//     return null;
//   }

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) return;
//     setCouponMsg('');
//     try {
//       const { data } = await validateCoupon({ code: couponCode, amount: cartTotal });
//       setDiscount(data.discount);
//       setCouponMsg(`✓ Saved ₹${data.discount.toFixed(2)}!`);
//     } catch (err) {
//       setCouponMsg(err.response?.data?.message || 'Invalid coupon');
//       setDiscount(0);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     const { street, city, state, zipCode, phone } = address;
//     if (!street || !city || !state || !zipCode || !phone) {
//       setError('Please fill in all address fields'); return;
//     }
//     setLoading(true); setError('');
//     try {
//       const { data } = await createOrder({ address, paymentMethod, couponCode: couponCode || undefined });
//       navigate(`/order-success/${data._id}`);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Order failed. Please try again.');
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="px-4 py-8 mx-auto max-w-7xl">
//       <h1 className="flex items-center gap-2 mb-6 text-2xl font-black">
//         <span className="material-symbols-outlined text-primary">shopping_basket</span> Checkout
//       </h1>

//       {error && (
//         <div className="px-4 py-3 mb-4 text-sm text-red-700 border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 rounded-xl">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
//         {/* ── Left column ── */}
//         <div className="space-y-6 lg:col-span-8">

//           {/* Cart Items Summary */}
//           <div className="bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//             <div className="p-5 border-b border-slate-100 dark:border-slate-800">
//               <h2 className="font-bold">Items in Cart ({cart.items.length})</h2>
//             </div>
//             <div className="divide-y divide-slate-100 dark:divide-slate-800">
//               {cart.items.map(item => (
//                 <div key={item.product?._id} className="flex items-center gap-4 p-4">
//                   <img src={item.product?.image || PLACEHOLDER} alt={item.product?.name}
//                     className="flex-shrink-0 object-cover w-14 h-14 rounded-xl"
//                     onError={e => { e.target.src = PLACEHOLDER; }} />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold truncate">{item.product?.name}</p>
//                     <p className="text-xs text-slate-500">Qty: {item.quantity} · {item.product?.unit}</p>
//                   </div>
//                   <p className="font-bold text-primary shrink-0">₹{(item.product?.price * item.quantity).toFixed(2)}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Delivery Address */}
//           <div className="p-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//             <h2 className="flex items-center gap-2 mb-4 font-bold">
//               <span className="material-symbols-outlined text-primary">location_on</span> Delivery Address
//             </h2>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div className="sm:col-span-2">
//                 <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">Street Address *</label>
//                 <input type="text" required placeholder="123 Main St, Apt 4B"
//                   className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/30 outline-none"
//                   value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
//               </div>
//               {[
//                 { key: 'city',    label: 'City *',       placeholder: 'Mumbai' },
//                 { key: 'state',   label: 'State *',      placeholder: 'Maharashtra' },
//                 { key: 'zipCode', label: 'ZIP Code *',   placeholder: '400001' },
//                 { key: 'phone',   label: 'Phone No. *',  placeholder: '9876543210' },
//               ].map(f => (
//                 <div key={f.key}>
//                   <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">{f.label}</label>
//                   <input type="text" required placeholder={f.placeholder}
//                     className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/30 outline-none"
//                     value={address[f.key]} onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className="p-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//             <h2 className="flex items-center gap-2 mb-4 font-bold">
//               <span className="material-symbols-outlined text-primary">payments</span> Payment Method
//             </h2>
//             <div className="space-y-3">
//               {PAYMENT_METHODS.map(pm => (
//                 <label key={pm.id}
//                   className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === pm.id ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'}`}>
//                   <input type="radio" name="payment" value={pm.id}
//                     checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)}
//                     className="w-4 h-4 text-primary accent-primary" />
//                   <span className="text-xl material-symbols-outlined text-primary">{pm.icon}</span>
//                   <span className="text-sm font-semibold">{pm.label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── Right column ── */}
//         <div className="lg:col-span-4">
//           <div className="sticky p-6 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 top-20">
//             <h2 className="mb-5 text-lg font-bold">Price Details</h2>

//             {/* Coupon */}
//             <div className="mb-5">
//               <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">Coupon Code</label>
//               <div className="flex gap-2">
//                 <input type="text" placeholder="FRESH20" value={couponCode}
//                   onChange={e => setCouponCode(e.target.value.toUpperCase())}
//                   className="flex-1 px-3 py-2 text-sm font-semibold tracking-widest uppercase border outline-none border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/30" />
//                 <button onClick={handleApplyCoupon}
//                   className="px-4 py-2 text-sm font-bold text-white transition-all bg-primary rounded-xl hover:bg-primary/90">
//                   Apply
//                 </button>
//               </div>
//               {couponMsg && (
//                 <p className={`text-xs mt-1.5 font-semibold ${couponMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-500'}`}>
//                   {couponMsg}
//                 </p>
//               )}
//             </div>

//             {/* Price breakdown */}
//             <div className="mb-5 space-y-3 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-slate-500">Subtotal</span>
//                 <span>₹{cartTotal.toFixed(2)}</span>
//               </div>
//               {discount > 0 && (
//                 <div className="flex justify-between font-semibold text-emerald-600">
//                   <span>Coupon Discount</span>
//                   <span>-₹{discount.toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-500">Delivery</span>
//                 <span className={deliveryCharge === 0 ? 'text-emerald-500 font-semibold' : ''}>
//                   {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
//                 </span>
//               </div>
//               <div className="flex justify-between pt-3 text-lg font-black border-t border-slate-100 dark:border-slate-800">
//                 <span>Total</span>
//                 <span className="text-primary">₹{total.toFixed(2)}</span>
//               </div>
//             </div>

//             <button onClick={handlePlaceOrder} disabled={loading}
//               className="flex items-center justify-center w-full gap-2 py-4 text-base font-black text-white transition-all shadow-lg bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 shadow-primary/20">
//               {loading
//                 ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
//                 : <span className="material-symbols-outlined">lock</span>}
//               {loading ? 'Placing Order…' : 'Place Order'}
//             </button>
//             <p className="flex items-center justify-center gap-1 mt-3 text-xs text-center text-slate-400">
//               <span className="text-xs material-symbols-outlined">security</span>
//               Secure SSL encrypted payment
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { validateCoupon } from '../../services/api';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&q=80';

const PAYMENT_METHODS = [
  { id: 'Card',       label: 'Credit / Debit Card', icon: 'credit_card',            desc: 'Visa, Mastercard, RuPay' },
  { id: 'UPI',        label: 'UPI',                  icon: 'qr_code_2',              desc: 'GPay, PhonePe, Paytm, BHIM' },
  { id: 'NetBanking', label: 'Net Banking',           icon: 'account_balance',        desc: 'SBI, HDFC, ICICI, Axis & more' },
  { id: 'Wallet',     label: 'Wallets',               icon: 'account_balance_wallet', desc: 'Paytm, Amazon Pay, Freecharge' },
  { id: 'COD',        label: 'Cash on Delivery',      icon: 'payments',               desc: 'Pay when order arrives' },
];

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) { resolve(true); return; }
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || ''),
});

const Checkout = () => {
  const { user } = useAuth();
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();

  const [step, setStep]                   = useState(1);
  const [address, setAddress]             = useState({
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', zipCode: user?.address?.zipCode || '',
    phone: user?.phone || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [couponCode, setCouponCode]       = useState('');
  const [discount, setDiscount]           = useState(0);
  const [couponMsg, setCouponMsg]         = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');

  const deliveryCharge = cartTotal > 500 ? 0 : 40;
  const total = cartTotal - discount + deliveryCharge;

  useEffect(() => { loadRazorpay(); }, []);

  if (!cart || cart.items?.length === 0) { navigate('/cart'); return null; }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg('');
    try {
      const { data } = await validateCoupon({ code: couponCode, amount: cartTotal });
      setDiscount(data.discount);
      setCouponMsg('Saved Rs.' + data.discount.toFixed(2) + '!');
    } catch (err) {
      setCouponMsg(err.response?.data?.message || 'Invalid coupon');
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    setError(''); setLoading(true);
    try {
      if (paymentMethod === 'COD') {
        const res = await fetch('/api/orders', {
          method: 'POST', headers: authHeader(),
          body: JSON.stringify({ address, paymentMethod: 'COD', couponCode }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Order failed');
        navigate('/order-success/' + data._id);
        return;
      }

      // Create Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST', headers: authHeader(),
        body: JSON.stringify({ address, paymentMethod, couponCode }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Payment setup failed');

      const { razorpayOrderId, orderId, amountInPaise, keyId } = orderData;
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Could not load payment gateway. Check your internet.');

      const rzpMethodMap = { Card: 'card', UPI: 'upi', NetBanking: 'netbanking', Wallet: 'wallet' };

      await new Promise((resolve, reject) => {
        const options = {
          key: keyId,
          amount: amountInPaise,
          currency: 'INR',
          name: 'Smart Grocery',
          description: 'Order #' + orderId.toString().slice(-8).toUpperCase(),
          order_id: razorpayOrderId,
          method: rzpMethodMap[paymentMethod],
          prefill: { name: user.name, email: user.email, contact: address.phone || user.phone || '' },
          theme: { color: '#6e3dff' },
          handler: async (response) => {
            try {
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST', headers: authHeader(),
                body: JSON.stringify({
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData.message);
              navigate('/order-success/' + orderId);
              resolve();
            } catch (err) { reject(err); }
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled.')) },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (r) => reject(new Error(r.error.description || 'Payment failed')));
        rzp.open();
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, field, placeholder, type = 'text' }) => (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-slate-600 dark:text-slate-400">{label}</label>
      <input type={type} value={address[field]} placeholder={placeholder}
        onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))}
        className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-800 outline-none focus:border-primary transition-colors" />
    </div>
  );

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto">
      <h1 className="mb-8 text-2xl font-black">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Left: Steps */}
        <div className="space-y-5 lg:col-span-2">
          {/* Step tabs */}
          <div className="flex items-center gap-3">
            {[{ n: 1, label: 'Delivery Address', icon: 'location_on' }, { n: 2, label: 'Payment', icon: 'payment' }].map((s, i) => (
              <div key={s.n} className="flex items-center flex-1 gap-2">
                {i > 0 && <div className={'h-0.5 w-8 flex-shrink-0 ' + (step >= s.n ? 'bg-primary' : 'bg-slate-200')} />}
                <button onClick={() => (s.n === 1 || step > s.n) && setStep(s.n)}
                  className={'flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ' +
                    (step === s.n ? 'bg-primary text-white shadow-md shadow-primary/25' :
                     step > s.n  ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400')}>
                  <span className="text-sm material-symbols-outlined"
                    style={{ fontVariationSettings: step >= s.n ? "'FILL' 1" : "'FILL' 0" }}>{s.icon}</span>
                  <span className="hidden sm:block">{s.label}</span>
                  {step > s.n && <span className="ml-auto text-sm material-symbols-outlined">check_circle</span>}
                </button>
              </div>
            ))}
          </div>

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="p-6 space-y-4 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
              <h2 className="flex items-center gap-2 text-lg font-black">
                <span className="material-symbols-outlined text-primary">location_on</span> Delivery Address
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-2">
                  <InputField label="Street / Flat / Area *" field="street" placeholder="e.g. 12 MG Road, Koramangala" />
                </div>
                <InputField label="City *"     field="city"    placeholder="e.g. Bengaluru" />
                <InputField label="State *"    field="state"   placeholder="e.g. Karnataka" />
                <InputField label="PIN Code *" field="zipCode" placeholder="e.g. 560034" />
                <InputField label="Phone *"    field="phone"   placeholder="e.g. 9876543210" type="tel" />
              </div>
              {error && <p className="text-sm font-medium text-red-500">{error}</p>}
              <button onClick={() => {
                if (!address.street || !address.city || !address.state || !address.zipCode || !address.phone) {
                  setError('Please fill in all address fields');
                } else { setError(''); setStep(2); }
              }} className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-all shadow-lg bg-primary rounded-xl hover:bg-primary/90 shadow-primary/20">
                Continue to Payment <span className="text-sm material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="p-6 space-y-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
              <h2 className="flex items-center gap-2 text-lg font-black">
                <span className="material-symbols-outlined text-primary">payment</span> Choose Payment Method
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                    className={'flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ' +
                      (paymentMethod === m.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40')}>
                    <div className={'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ' +
                      (paymentMethod === m.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')}>
                      <span className="material-symbols-outlined">{m.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={'font-bold text-sm ' + (paymentMethod === m.id ? 'text-primary' : '')}>{m.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
                    </div>
                    {paymentMethod === m.id && (
                      <span className="flex-shrink-0 material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Info box */}
              {paymentMethod !== 'COD' && (
                <div className="flex items-start gap-3 p-4 border bg-primary/5 border-primary/15 rounded-xl">
                  <span className="flex-shrink-0 material-symbols-outlined text-primary">info</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {paymentMethod === 'UPI'        && 'A Razorpay popup will open. Enter your UPI ID or scan QR with any UPI app.'}
                    {paymentMethod === 'Card'       && 'Enter card details securely in the Razorpay popup. Supports Visa, Mastercard & RuPay.'}
                    {paymentMethod === 'NetBanking' && 'You will be redirected to your bank login. Supports 50+ banks including SBI, HDFC & ICICI.'}
                    {paymentMethod === 'Wallet'     && 'Pay using Paytm, Amazon Pay, Mobikwik or Freecharge via Razorpay.'}
                  </p>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="flex items-start gap-3 p-4 text-sm border bg-amber-50 dark:bg-amber-950/20 border-amber-200 rounded-xl text-amber-700 dark:text-amber-300">
                  <span className="flex-shrink-0 material-symbols-outlined">payments</span>
                  Pay in cash when your order arrives. Please keep exact change ready.
                </div>
              )}

              {/* Razorpay badge */}
              {paymentMethod !== 'COD' && (
                <div className="flex flex-wrap items-center gap-4">
                  {['Secured by Razorpay', 'PCI DSS Compliant', '256-bit SSL'].map(t => (
                    <div key={t} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="text-xs material-symbols-outlined text-emerald-500">verified_user</span>{t}
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 border border-red-200 bg-red-50 dark:bg-red-950/20 rounded-xl">
                  <span className="text-sm material-symbols-outlined">error</span>{error}
                </div>
              )}

              <button onClick={handlePlaceOrder} disabled={loading}
                className="flex items-center justify-center w-full gap-3 py-4 text-base font-black text-white transition-all shadow-xl bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 shadow-primary/25">
                {loading
                  ? <><span className="material-symbols-outlined animate-spin">progress_activity</span>Processing...</>
                  : <><span className="material-symbols-outlined">lock</span>
                    {paymentMethod === 'COD' ? 'Place Order' : 'Pay'} - Rs.{total.toFixed(2)}</>}
              </button>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="space-y-4">
          <div className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <h2 className="flex items-center justify-between mb-4 font-bold">
              Order Summary <span className="text-xs font-normal text-slate-400">{cart.items?.length} items</span>
            </h2>
            <div className="pr-1 space-y-3 overflow-y-auto max-h-64">
              {cart.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.product?.image || PLACEHOLDER} alt={item.product?.name}
                    className="flex-shrink-0 object-cover w-12 h-12 border rounded-xl border-slate-100"
                    onError={e => { e.target.src = PLACEHOLDER; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{item.product?.name}</p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="flex-shrink-0 text-sm font-bold">Rs.{(item.product?.price * item.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon */}
          <div className="p-5 bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <label className="block mb-3 text-sm font-bold">Coupon Code</label>
            <div className="flex gap-2">
              <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. FRESH20"
                className="flex-1 px-3 py-2 text-sm font-bold tracking-widest uppercase border-2 outline-none border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary" />
              <button onClick={handleApplyCoupon}
                className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90">Apply</button>
            </div>
            {couponMsg && (
              <p className={'text-xs mt-2 font-semibold ' + (couponMsg.startsWith('Saved') ? 'text-emerald-600' : 'text-red-500')}>{couponMsg}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {['FRESH20', 'SAVE50', 'NEWUSER'].map(c => (
                <button key={c} onClick={() => setCouponCode(c)}
                  className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-all">{c}</button>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="p-5 space-y-3 text-sm bg-white border dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>Rs.{cartTotal.toFixed(2)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between font-semibold text-emerald-600"><span>Coupon</span><span>-Rs.{discount.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Delivery</span>
              <span className={deliveryCharge === 0 ? 'text-emerald-500 font-semibold' : ''}>
                {deliveryCharge === 0 ? 'FREE' : 'Rs.' + deliveryCharge}
              </span>
            </div>
            <div className="flex justify-between pt-3 text-lg font-black border-t border-slate-100 dark:border-slate-800">
              <span>Total</span><span className="text-primary">Rs.{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;