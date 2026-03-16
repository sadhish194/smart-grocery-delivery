// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';
// import { getMyOrders, getProducts } from '../services/api';
// import { useNavigate, useLocation } from 'react-router-dom';

// // ── Quick action chips ────────────────────────────────────────────────────────
// const QUICK_ACTIONS = [
//   { label: '📦 Track my order', prompt: 'Where is my latest order?' },
//   { label: '🛒 What\'s in my cart?', prompt: 'What items are in my cart?' },
//   { label: '🏷️ Any coupons?', prompt: 'What coupon codes are available?' },
//   { label: '🚚 Delivery fees?', prompt: 'What are the delivery charges?' },
//   { label: '↩️ Return policy', prompt: 'What is your return and refund policy?' },
//   { label: '🥦 Fresh produce?', prompt: 'What fresh vegetables and fruits do you have?' },
// ];

// // ── Build context-aware system prompt ────────────────────────────────────────
// const buildSystemPrompt = ({ user, orders, cart, products }) => {
//   const now = new Date().toLocaleString('en-IN');

//   let orderContext = 'User is not logged in.';
//   if (user) {
//     orderContext = `Logged-in user: ${user.name} (${user.email}), role: ${user.role}.\n`;

//     if (orders && orders.length > 0) {
//       orderContext += `\nTheir recent orders (latest first):\n`;
//       orders.slice(0, 5).forEach((o, i) => {
//         orderContext += `  ${i + 1}. Order #${o._id.slice(-8).toUpperCase()} — Status: ${o.orderStatus} — ₹${o.totalPrice} — ${o.items.length} item(s)`;
//         if (o.address) orderContext += ` — Deliver to: ${o.address.city}`;
//         if (o.deliveryPerson) orderContext += ` — Rider: ${o.deliveryPerson.name}`;
//         orderContext += `\n`;
//       });
//     } else {
//       orderContext += 'User has no orders yet.\n';
//     }

//     if (cart && cart.items && cart.items.length > 0) {
//       orderContext += `\nCart has ${cart.items.length} item(s): `;
//       orderContext += cart.items.map(i => `${i.product?.name || 'item'} x${i.quantity}`).join(', ') + '.\n';
//     } else {
//       orderContext += 'Cart is empty.\n';
//     }
//   }

//   let productContext = '';
//   if (products && products.length > 0) {
//     productContext = `\nAvailable featured products (sample): `;
//     productContext += products.slice(0, 8).map(p => `${p.name} (₹${p.price}/${p.unit || 'unit'})`).join(', ') + '.';
//   }

//   return `You are Genie 🧞, the friendly AI shopping assistant for Smart Grocery — an online grocery delivery app in India.

// Current date/time: ${now}

// STORE POLICIES:
// - Free delivery on orders above ₹500; otherwise ₹40 delivery charge
// - Active coupon codes: FRESH20 (20% off, max ₹100, min order ₹200), SAVE50 (₹50 flat off, min ₹500), NEWUSER (15% off, max ₹75, min ₹100)
// - Orders can be cancelled before the store starts picking (usually within 1–2 hours)
// - Missing/damaged items must be reported within 24 hours via the app
// - Delivery takes 30–60 minutes depending on location
// - We deliver 7 days a week, 8 AM to 10 PM

// USER CONTEXT:
// ${orderContext}${productContext}

// BEHAVIOR RULES:
// - Be warm, helpful, and concise. Use emojis sparingly but naturally.
// - When user asks about their order status, give the exact status from context above.
// - When user asks about cart, tell them exactly what's in it.
// - Suggest relevant products, coupons, or actions based on what they ask.
// - If they want to navigate somewhere, tell them to click the link (you can't navigate for them, but tell them where to go).
// - If you don't know something specific, say so honestly and suggest they contact support.
// - Keep responses under 120 words unless the user asks for detailed info.
// - Format lists with bullet points when showing multiple items.
// - Always respond in the same language the user writes in.`;
// };

// // ── Call Claude API ───────────────────────────────────────────────────────────
// const callClaude = async (messages, systemPrompt) => {
//   const response = await fetch('https://api.anthropic.com/v1/messages', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       model: 'claude-sonnet-4-6',
//       max_tokens: 1000,
//       system: systemPrompt,
//       messages: messages.map(m => ({ role: m.role, content: m.content })),
//     }),
//   });
//   if (!response.ok) throw new Error('API error');
//   const data = await response.json();
//   return data.content?.[0]?.text || 'Sorry, I had trouble responding. Please try again.';
// };

// // ── Detect action intents for quick-action buttons in bot replies ─────────────
// const detectActions = (text) => {
//   const actions = [];
//   if (/order|track|delivery/i.test(text)) actions.push({ label: 'View Orders', path: '/orders' });
//   if (/cart|checkout/i.test(text)) actions.push({ label: 'Go to Cart', path: '/cart' });
//   if (/product|shop|browse|vegetable|fruit|dairy/i.test(text)) actions.push({ label: 'Browse Products', path: '/products' });
//   if (/coupon|promo|discount/i.test(text)) actions.push({ label: 'Go to Checkout', path: '/checkout' });
//   if (/help|support|contact/i.test(text)) actions.push({ label: 'Help Center', path: '/help' });
//   return actions.slice(0, 2); // max 2 action buttons
// };

// // ── Message bubble ────────────────────────────────────────────────────────────
// const MessageBubble = ({ msg, navigate }) => {
//   const isBot = msg.role === 'assistant';
//   const actions = isBot ? detectActions(msg.content) : [];

//   return (
//     <div className={`flex gap-2 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
//       {/* Avatar */}
//       {isBot ? (
//         <div className="flex items-center justify-center flex-shrink-0 text-xs font-black text-white rounded-full shadow w-7 h-7 bg-primary">G</div>
//       ) : (
//         <div className="flex items-center justify-center flex-shrink-0 text-xs rounded-full w-7 h-7 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
//           <span className="text-sm material-symbols-outlined">person</span>
//         </div>
//       )}
//       <div className={`max-w-[82%] space-y-1.5`}>
//         <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
//           ${isBot
//             ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm'
//             : 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20'}`}>
//           {msg.content}
//         </div>
//         {/* Action buttons */}
//         {actions.length > 0 && (
//           <div className="flex gap-2 flex-wrap pt-0.5">
//             {actions.map(a => (
//               <button key={a.path} onClick={() => navigate(a.path)}
//                 className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full font-semibold hover:bg-primary hover:text-white transition-all">
//                 {a.label} →
//               </button>
//             ))}
//           </div>
//         )}
//         <p className="text-[10px] text-slate-400 px-1">
//           {new Date(msg.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
//         </p>
//       </div>
//     </div>
//   );
// };

// // ── Typing indicator ──────────────────────────────────────────────────────────
// const TypingIndicator = () => (
//   <div className="flex items-start gap-2">
//     <div className="flex items-center justify-center text-xs font-black text-white rounded-full shadow w-7 h-7 bg-primary">G</div>
//     <div className="px-4 py-3 bg-white border rounded-tl-sm shadow-sm dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl">
//       <div className="flex items-center h-4 gap-1">
//         {[0, 1, 2].map(i => (
//           <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
//             style={{ animationDelay: `${i * 0.15}s` }} />
//         ))}
//       </div>
//     </div>
//   </div>
// );

// // ── Main ChatBot component ────────────────────────────────────────────────────
// // mode: 'float' (bubble) | 'embed' (inline in Help page)
// export const ChatBot = ({ mode = 'float' }) => {
//   const { user } = useAuth();
//   const { cart } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [open, setOpen] = useState(mode === 'embed');
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: `Hi${user ? ` ${user.name?.split(' ')[0]}` : ''}! 👋 I'm Genie, your Smart Grocery assistant. I can help you track orders, find products, apply coupons, and more. What can I do for you today?`,
//       ts: Date.now(),
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [unread, setUnread] = useState(0);
//   const [hasLoadedCtx, setHasLoadedCtx] = useState(false);
//   const bottomRef = useRef(null);
//   const inputRef = useRef(null);

//   // Load context data once
//   useEffect(() => {
//     if (!hasLoadedCtx) {
//       setHasLoadedCtx(true);
//       if (user) {
//         getMyOrders().then(r => setOrders(r.data || [])).catch(() => {});
//       }
//       getProducts({ limit: 20 }).then(r => setProducts(r.data?.products || [])).catch(() => {});
//     }
//   }, [user, hasLoadedCtx]);

//   // Auto-scroll
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, loading]);

//   // Track unread when closed
//   useEffect(() => {
//     if (!open && messages.length > 1) setUnread(u => u + 1);
//   }, [messages.length]);

//   // Clear unread on open
//   useEffect(() => {
//     if (open) { setUnread(0); inputRef.current?.focus(); }
//   }, [open]);

//   const systemPrompt = buildSystemPrompt({ user, orders, cart, products });

//   const sendMessage = useCallback(async (text) => {
//     const userText = (text || input).trim();
//     if (!userText || loading) return;
//     setInput('');

//     const userMsg = { role: 'user', content: userText, ts: Date.now() };
//     const newMessages = [...messages, userMsg];
//     setMessages(newMessages);
//     setLoading(true);

//     try {
//       const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
//       const reply = await callClaude(apiMessages, systemPrompt);
//       setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
//     } catch {
//       setMessages(prev => [...prev, {
//         role: 'assistant',
//         content: '⚠️ I\'m having trouble connecting right now. Please try again in a moment or contact our support team.',
//         ts: Date.now(),
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   }, [input, messages, loading, systemPrompt]);

//   const handleKey = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
//   };

//   const clearChat = () => {
//     setMessages([{
//       role: 'assistant',
//       content: `Hi again${user ? ` ${user.name?.split(' ')[0]}` : ''}! 👋 How can I help you today?`,
//       ts: Date.now(),
//     }]);
//   };

//   // ── EMBED MODE (inside Help page) ─────────────────────────────────────────
//   if (mode === 'embed') {
//     return (
//       <div className="flex flex-col overflow-hidden bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800" style={{ height: '560px' }}>
//         {/* Header */}
//         <div className="flex items-center justify-between flex-shrink-0 px-5 py-4 bg-primary">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center font-black text-white rounded-full w-9 h-9 bg-white/20">G</div>
//             <div>
//               <p className="text-sm font-black text-white">Genie — AI Assistant</p>
//               <div className="flex items-center gap-1.5">
//                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
//                 <span className="text-xs text-white/70">Online · Usually replies instantly</span>
//               </div>
//             </div>
//           </div>
//           <button onClick={clearChat} title="Clear chat"
//             className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
//             <span className="text-sm material-symbols-outlined text-white/80">refresh</span>
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950">
//           {messages.map((msg, i) => <MessageBubble key={i} msg={msg} navigate={navigate} />)}
//           {loading && <TypingIndicator />}
//           <div ref={bottomRef} />
//         </div>

//         {/* Quick actions */}
//         {messages.length <= 1 && (
//           <div className="flex flex-wrap gap-2 px-4 py-2 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
//             {QUICK_ACTIONS.slice(0, 3).map(a => (
//               <button key={a.prompt} onClick={() => sendMessage(a.prompt)}
//                 className="text-xs bg-primary/8 text-primary border border-primary/15 px-3 py-1.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
//                 {a.label}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Input */}
//         <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
//           <div className="flex items-end gap-2 px-4 py-2 transition-all border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
//             <textarea
//               ref={inputRef}
//               rows={1}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKey}
//               placeholder="Ask me anything about your orders, products..."
//               className="flex-1 py-1 text-sm bg-transparent outline-none resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 max-h-24"
//             />
//             <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
//               className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white transition-all rounded-lg shadow-md bg-primary disabled:opacity-40 hover:bg-primary/90 shadow-primary/25">
//               <span className="text-sm material-symbols-outlined">send</span>
//             </button>
//           </div>
//           <p className="text-[10px] text-slate-400 text-center mt-2">Powered by Claude AI · Smart Grocery</p>
//         </div>
//       </div>
//     );
//   }

//   // ── FLOAT MODE (bubble) ────────────────────────────────────────────────────
//   return (
//     <>
//       {/* Chat window */}
//       <div className={`fixed bottom-24 right-5 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 origin-bottom-right
//         ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}
//         style={{ height: open ? '520px' : 0 }}>

//         {/* Header */}
//         <div className="bg-primary px-4 py-3.5 flex items-center justify-between flex-shrink-0">
//           <div className="flex items-center gap-2.5">
//             <div className="flex items-center justify-center w-8 h-8 text-sm font-black text-white rounded-full bg-white/20">G</div>
//             <div>
//               <p className="text-sm font-black text-white">Genie</p>
//               <div className="flex items-center gap-1">
//                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
//                 <span className="text-xs text-white/70">AI Assistant · Online</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-1">
//             <button onClick={clearChat} title="New chat"
//               className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
//               <span className="text-sm material-symbols-outlined text-white/80">refresh</span>
//             </button>
//             <button onClick={() => setOpen(false)}
//               className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
//               <span className="text-sm text-white material-symbols-outlined">keyboard_arrow_down</span>
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950">
//           {messages.map((msg, i) => <MessageBubble key={i} msg={msg} navigate={navigate} />)}
//           {loading && <TypingIndicator />}
//           <div ref={bottomRef} />
//         </div>

//         {/* Quick actions (shown only at start) */}
//         {messages.length <= 1 && (
//           <div className="px-3 py-2 flex gap-1.5 flex-wrap border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
//             {QUICK_ACTIONS.map(a => (
//               <button key={a.prompt} onClick={() => sendMessage(a.prompt)}
//                 className="text-[11px] bg-primary/8 text-primary border border-primary/15 px-2.5 py-1 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
//                 {a.label}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Input */}
//         <div className="flex-shrink-0 px-3 py-3 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
//           <div className="flex items-end gap-2 px-3 py-2 transition-all border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
//             <textarea
//               ref={inputRef}
//               rows={1}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKey}
//               placeholder="Ask about orders, products, coupons..."
//               className="flex-1 bg-transparent outline-none text-sm resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 py-0.5 max-h-20"
//             />
//             <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
//               className="flex items-center justify-center flex-shrink-0 text-white transition-all rounded-lg w-7 h-7 bg-primary disabled:opacity-40 hover:bg-primary/90">
//               <span className="text-sm material-symbols-outlined">send</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Floating bubble button */}
//       <button
//         onClick={() => setOpen(o => !o)}
//         className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300
//           ${open ? 'bg-slate-700 rotate-0' : 'bg-primary hover:scale-110'} shadow-primary/30`}>
//         <span className={`material-symbols-outlined text-white text-2xl transition-all duration-200 ${open ? '' : ''}`}
//           style={{ fontVariationSettings: "'FILL' 1" }}>
//           {open ? 'close' : 'smart_toy'}
//         </span>
//         {/* Unread badge */}
//         {!open && unread > 0 && (
//           <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
//             {unread}
//           </span>
//         )}
//       </button>
//     </>
//   );
// };

// export default ChatBot;


// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';
// import { getMyOrders, getProducts } from '../services/api';
// import { useNavigate, useLocation } from 'react-router-dom';

// // ── Quick action chips ────────────────────────────────────────────────────────
// const QUICK_ACTIONS = [
//   { label: '📦 Track my order', prompt: 'Where is my latest order?' },
//   { label: '🛒 What\'s in my cart?', prompt: 'What items are in my cart?' },
//   { label: '🏷️ Any coupons?', prompt: 'What coupon codes are available?' },
//   { label: '🚚 Delivery fees?', prompt: 'What are the delivery charges?' },
//   { label: '↩️ Return policy', prompt: 'What is your return and refund policy?' },
//   { label: '🥦 Fresh produce?', prompt: 'What fresh vegetables and fruits do you have?' },
// ];

// // ── Build context-aware system prompt ────────────────────────────────────────
// const buildSystemPrompt = ({ user, orders, cart, products }) => {
//   const now = new Date().toLocaleString('en-IN');

//   let orderContext = 'User is not logged in.';
//   if (user) {
//     orderContext = `Logged-in user: ${user.name} (${user.email}), role: ${user.role}.\n`;

//     if (orders && orders.length > 0) {
//       orderContext += `\nTheir recent orders (latest first):\n`;
//       orders.slice(0, 5).forEach((o, i) => {
//         orderContext += `  ${i + 1}. Order #${o._id.slice(-8).toUpperCase()} — Status: ${o.orderStatus} — ₹${o.totalPrice} — ${o.items.length} item(s)`;
//         if (o.address) orderContext += ` — Deliver to: ${o.address.city}`;
//         if (o.deliveryPerson) orderContext += ` — Rider: ${o.deliveryPerson.name}`;
//         orderContext += `\n`;
//       });
//     } else {
//       orderContext += 'User has no orders yet.\n';
//     }

//     if (cart && cart.items && cart.items.length > 0) {
//       orderContext += `\nCart has ${cart.items.length} item(s): `;
//       orderContext += cart.items.map(i => `${i.product?.name || 'item'} x${i.quantity}`).join(', ') + '.\n';
//     } else {
//       orderContext += 'Cart is empty.\n';
//     }
//   }

//   let productContext = '';
//   if (products && products.length > 0) {
//     productContext = `\nAvailable featured products (sample): `;
//     productContext += products.slice(0, 8).map(p => `${p.name} (₹${p.price}/${p.unit || 'unit'})`).join(', ') + '.';
//   }

//   return `You are Genie 🧞, the friendly AI shopping assistant for Smart Grocery — an online grocery delivery app in India.

// Current date/time: ${now}

// STORE POLICIES:
// - Free delivery on orders above ₹500; otherwise ₹40 delivery charge
// - Active coupon codes: FRESH20 (20% off, max ₹100, min order ₹200), SAVE50 (₹50 flat off, min ₹500), NEWUSER (15% off, max ₹75, min ₹100)
// - Orders can be cancelled before the store starts picking (usually within 1–2 hours)
// - Missing/damaged items must be reported within 24 hours via the app
// - Delivery takes 30–60 minutes depending on location
// - We deliver 7 days a week, 8 AM to 10 PM

// USER CONTEXT:
// ${orderContext}${productContext}

// BEHAVIOR RULES:
// - Be warm, helpful, and concise. Use emojis sparingly but naturally.
// - When user asks about their order status, give the exact status from context above.
// - When user asks about cart, tell them exactly what's in it.
// - Suggest relevant products, coupons, or actions based on what they ask.
// - If they want to navigate somewhere, tell them to click the link (you can't navigate for them, but tell them where to go).
// - If you don't know something specific, say so honestly and suggest they contact support.
// - Keep responses under 120 words unless the user asks for detailed info.
// - Format lists with bullet points when showing multiple items.
// - Always respond in the same language the user writes in.`;
// };

// // ── Call Claude via backend proxy (avoids CORS) ───────────────────────────────
// const callClaude = async (messages, systemPrompt) => {
//   const response = await fetch('/api/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ messages, systemPrompt }),
//   });
//   if (!response.ok) {
//     const err = await response.json().catch(() => ({}));
//     throw new Error(err.message || 'Chat error');
//   }
//   const data = await response.json();
//   return data.reply || 'Sorry, I had trouble responding. Please try again.';
// };

// // ── Detect action intents for quick-action buttons in bot replies ─────────────
// const detectActions = (text) => {
//   const actions = [];
//   if (/order|track|delivery/i.test(text)) actions.push({ label: 'View Orders', path: '/orders' });
//   if (/cart|checkout/i.test(text)) actions.push({ label: 'Go to Cart', path: '/cart' });
//   if (/product|shop|browse|vegetable|fruit|dairy/i.test(text)) actions.push({ label: 'Browse Products', path: '/products' });
//   if (/coupon|promo|discount/i.test(text)) actions.push({ label: 'Go to Checkout', path: '/checkout' });
//   if (/help|support|contact/i.test(text)) actions.push({ label: 'Help Center', path: '/help' });
//   return actions.slice(0, 2); // max 2 action buttons
// };

// // ── Message bubble ────────────────────────────────────────────────────────────
// const MessageBubble = ({ msg, navigate }) => {
//   const isBot = msg.role === 'assistant';
//   const actions = isBot ? detectActions(msg.content) : [];

//   return (
//     <div className={`flex gap-2 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
//       {/* Avatar */}
//       {isBot ? (
//         <div className="flex items-center justify-center flex-shrink-0 text-xs font-black text-white rounded-full shadow w-7 h-7 bg-primary">G</div>
//       ) : (
//         <div className="flex items-center justify-center flex-shrink-0 text-xs rounded-full w-7 h-7 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
//           <span className="text-sm material-symbols-outlined">person</span>
//         </div>
//       )}
//       <div className={`max-w-[82%] space-y-1.5`}>
//         <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
//           ${isBot
//             ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm'
//             : 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20'}`}>
//           {msg.content}
//         </div>
//         {/* Action buttons */}
//         {actions.length > 0 && (
//           <div className="flex gap-2 flex-wrap pt-0.5">
//             {actions.map(a => (
//               <button key={a.path} onClick={() => navigate(a.path)}
//                 className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full font-semibold hover:bg-primary hover:text-white transition-all">
//                 {a.label} →
//               </button>
//             ))}
//           </div>
//         )}
//         <p className="text-[10px] text-slate-400 px-1">
//           {new Date(msg.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
//         </p>
//       </div>
//     </div>
//   );
// };

// // ── Typing indicator ──────────────────────────────────────────────────────────
// const TypingIndicator = () => (
//   <div className="flex items-start gap-2">
//     <div className="flex items-center justify-center text-xs font-black text-white rounded-full shadow w-7 h-7 bg-primary">G</div>
//     <div className="px-4 py-3 bg-white border rounded-tl-sm shadow-sm dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl">
//       <div className="flex items-center h-4 gap-1">
//         {[0, 1, 2].map(i => (
//           <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
//             style={{ animationDelay: `${i * 0.15}s` }} />
//         ))}
//       </div>
//     </div>
//   </div>
// );

// // ── Main ChatBot component ────────────────────────────────────────────────────
// // mode: 'float' (bubble) | 'embed' (inline in Help page)
// export const ChatBot = ({ mode = 'float' }) => {
//   const { user } = useAuth();
//   const { cart } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [open, setOpen] = useState(mode === 'embed');
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: `Hi${user ? ` ${user.name?.split(' ')[0]}` : ''}! 👋 I'm Genie, your Smart Grocery assistant. I can help you track orders, find products, apply coupons, and more. What can I do for you today?`,
//       ts: Date.now(),
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [unread, setUnread] = useState(0);
//   const [hasLoadedCtx, setHasLoadedCtx] = useState(false);
//   const bottomRef = useRef(null);
//   const inputRef = useRef(null);

//   // Load context data once
//   useEffect(() => {
//     if (!hasLoadedCtx) {
//       setHasLoadedCtx(true);
//       if (user) {
//         getMyOrders().then(r => setOrders(r.data || [])).catch(() => {});
//       }
//       getProducts({ limit: 20 }).then(r => setProducts(r.data?.products || [])).catch(() => {});
//     }
//   }, [user, hasLoadedCtx]);

//   // Auto-scroll
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, loading]);

//   // Track unread when closed
//   useEffect(() => {
//     if (!open && messages.length > 1) setUnread(u => u + 1);
//   }, [messages.length]);

//   // Clear unread on open
//   useEffect(() => {
//     if (open) { setUnread(0); inputRef.current?.focus(); }
//   }, [open]);

//   const systemPrompt = buildSystemPrompt({ user, orders, cart, products });

//   const sendMessage = useCallback(async (text) => {
//     const userText = (text || input).trim();
//     if (!userText || loading) return;
//     setInput('');

//     const userMsg = { role: 'user', content: userText, ts: Date.now() };
//     const newMessages = [...messages, userMsg];
//     setMessages(newMessages);
//     setLoading(true);

//     try {
//       const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
//       const reply = await callClaude(apiMessages, systemPrompt);
//       setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
//     } catch (err) {
//       const msg = err.message?.includes('API_KEY')
//         ? '⚠️ Chatbot not configured yet. Add your ANTHROPIC_API_KEY to backend/.env and restart the server.'
//         : '⚠️ I\'m having trouble connecting. Make sure the backend server is running, then try again.';
//       setMessages(prev => [...prev, { role: 'assistant', content: msg, ts: Date.now() }]);
//     } finally {
//       setLoading(false);
//     }
//   }, [input, messages, loading, systemPrompt]);

//   const handleKey = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
//   };

//   const clearChat = () => {
//     setMessages([{
//       role: 'assistant',
//       content: `Hi again${user ? ` ${user.name?.split(' ')[0]}` : ''}! 👋 How can I help you today?`,
//       ts: Date.now(),
//     }]);
//   };

//   // ── EMBED MODE (inside Help page) ─────────────────────────────────────────
//   if (mode === 'embed') {
//     return (
//       <div className="flex flex-col overflow-hidden bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800" style={{ height: '560px' }}>
//         {/* Header */}
//         <div className="flex items-center justify-between flex-shrink-0 px-5 py-4 bg-primary">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center font-black text-white rounded-full w-9 h-9 bg-white/20">G</div>
//             <div>
//               <p className="text-sm font-black text-white">Genie — AI Assistant</p>
//               <div className="flex items-center gap-1.5">
//                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
//                 <span className="text-xs text-white/70">Online · Usually replies instantly</span>
//               </div>
//             </div>
//           </div>
//           <button onClick={clearChat} title="Clear chat"
//             className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
//             <span className="text-sm material-symbols-outlined text-white/80">refresh</span>
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950">
//           {messages.map((msg, i) => <MessageBubble key={i} msg={msg} navigate={navigate} />)}
//           {loading && <TypingIndicator />}
//           <div ref={bottomRef} />
//         </div>

//         {/* Quick actions */}
//         {messages.length <= 1 && (
//           <div className="flex flex-wrap gap-2 px-4 py-2 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
//             {QUICK_ACTIONS.slice(0, 3).map(a => (
//               <button key={a.prompt} onClick={() => sendMessage(a.prompt)}
//                 className="text-xs bg-primary/8 text-primary border border-primary/15 px-3 py-1.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
//                 {a.label}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Input */}
//         <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
//           <div className="flex items-end gap-2 px-4 py-2 transition-all border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
//             <textarea
//               ref={inputRef}
//               rows={1}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKey}
//               placeholder="Ask me anything about your orders, products..."
//               className="flex-1 py-1 text-sm bg-transparent outline-none resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 max-h-24"
//             />
//             <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
//               className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white transition-all rounded-lg shadow-md bg-primary disabled:opacity-40 hover:bg-primary/90 shadow-primary/25">
//               <span className="text-sm material-symbols-outlined">send</span>
//             </button>
//           </div>
//           <p className="text-[10px] text-slate-400 text-center mt-2">Powered by Claude AI · Smart Grocery</p>
//         </div>
//       </div>
//     );
//   }

//   // ── FLOAT MODE (bubble) ────────────────────────────────────────────────────
//   return (
//     <>
//       {/* Chat window */}
//       <div className={`fixed bottom-24 right-5 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 origin-bottom-right
//         ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}
//         style={{ height: open ? '520px' : 0 }}>

//         {/* Header */}
//         <div className="bg-primary px-4 py-3.5 flex items-center justify-between flex-shrink-0">
//           <div className="flex items-center gap-2.5">
//             <div className="flex items-center justify-center w-8 h-8 text-sm font-black text-white rounded-full bg-white/20">G</div>
//             <div>
//               <p className="text-sm font-black text-white">Genie</p>
//               <div className="flex items-center gap-1">
//                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
//                 <span className="text-xs text-white/70">AI Assistant · Online</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-1">
//             <button onClick={clearChat} title="New chat"
//               className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
//               <span className="text-sm material-symbols-outlined text-white/80">refresh</span>
//             </button>
//             <button onClick={() => setOpen(false)}
//               className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
//               <span className="text-sm text-white material-symbols-outlined">keyboard_arrow_down</span>
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950">
//           {messages.map((msg, i) => <MessageBubble key={i} msg={msg} navigate={navigate} />)}
//           {loading && <TypingIndicator />}
//           <div ref={bottomRef} />
//         </div>

//         {/* Quick actions (shown only at start) */}
//         {messages.length <= 1 && (
//           <div className="px-3 py-2 flex gap-1.5 flex-wrap border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
//             {QUICK_ACTIONS.map(a => (
//               <button key={a.prompt} onClick={() => sendMessage(a.prompt)}
//                 className="text-[11px] bg-primary/8 text-primary border border-primary/15 px-2.5 py-1 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
//                 {a.label}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Input */}
//         <div className="flex-shrink-0 px-3 py-3 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
//           <div className="flex items-end gap-2 px-3 py-2 transition-all border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
//             <textarea
//               ref={inputRef}
//               rows={1}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKey}
//               placeholder="Ask about orders, products, coupons..."
//               className="flex-1 bg-transparent outline-none text-sm resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 py-0.5 max-h-20"
//             />
//             <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
//               className="flex items-center justify-center flex-shrink-0 text-white transition-all rounded-lg w-7 h-7 bg-primary disabled:opacity-40 hover:bg-primary/90">
//               <span className="text-sm material-symbols-outlined">send</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Floating bubble button */}
//       <button
//         onClick={() => setOpen(o => !o)}
//         className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300
//           ${open ? 'bg-slate-700 rotate-0' : 'bg-primary hover:scale-110'} shadow-primary/30`}>
//         <span className={`material-symbols-outlined text-white text-2xl transition-all duration-200 ${open ? '' : ''}`}
//           style={{ fontVariationSettings: "'FILL' 1" }}>
//           {open ? 'close' : 'smart_toy'}
//         </span>
//         {/* Unread badge */}
//         {!open && unread > 0 && (
//           <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
//             {unread}
//           </span>
//         )}
//       </button>
//     </>
//   );
// };

// export default ChatBot;

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';
// import { getMyOrders, getProducts } from '../services/api';
// import { useNavigate, useLocation } from 'react-router-dom';

// // ── Quick action chips ────────────────────────────────────────────────────────
// const QUICK_ACTIONS = [
//   { label: '📦 Track my order', prompt: 'Where is my latest order?' },
//   { label: '🛒 What\'s in my cart?', prompt: 'What items are in my cart?' },
//   { label: '🏷️ Any coupons?', prompt: 'What coupon codes are available?' },
//   { label: '🚚 Delivery fees?', prompt: 'What are the delivery charges?' },
//   { label: '↩️ Return policy', prompt: 'What is your return and refund policy?' },
//   { label: '🥦 Fresh produce?', prompt: 'What fresh vegetables and fruits do you have?' },
// ];

// // ── Build context-aware system prompt ────────────────────────────────────────
// const buildSystemPrompt = ({ user, orders, cart, products }) => {
//   const now = new Date().toLocaleString('en-IN');

//   let orderContext = 'User is not logged in.';
//   if (user) {
//     orderContext = `Logged-in user: ${user.name} (${user.email}), role: ${user.role}.\n`;

//     if (orders && orders.length > 0) {
//       orderContext += `\nTheir recent orders (latest first):\n`;
//       orders.slice(0, 5).forEach((o, i) => {
//         orderContext += `  ${i + 1}. Order #${o._id.slice(-8).toUpperCase()} — Status: ${o.orderStatus} — ₹${o.totalPrice} — ${o.items.length} item(s)`;
//         if (o.address) orderContext += ` — Deliver to: ${o.address.city}`;
//         if (o.deliveryPerson) orderContext += ` — Rider: ${o.deliveryPerson.name}`;
//         orderContext += `\n`;
//       });
//     } else {
//       orderContext += 'User has no orders yet.\n';
//     }

//     if (cart && cart.items && cart.items.length > 0) {
//       orderContext += `\nCart has ${cart.items.length} item(s): `;
//       orderContext += cart.items.map(i => `${i.product?.name || 'item'} x${i.quantity}`).join(', ') + '.\n';
//     } else {
//       orderContext += 'Cart is empty.\n';
//     }
//   }

//   let productContext = '';
//   if (products && products.length > 0) {
//     productContext = `\nAvailable featured products (sample): `;
//     productContext += products.slice(0, 8).map(p => `${p.name} (₹${p.price}/${p.unit || 'unit'})`).join(', ') + '.';
//   }

//   return `You are Genie 🧞, the friendly AI shopping assistant for Smart Grocery — an online grocery delivery app in India.

// Current date/time: ${now}

// STORE POLICIES:
// - Free delivery on orders above ₹500; otherwise ₹40 delivery charge
// - Active coupon codes: FRESH20 (20% off, max ₹100, min order ₹200), SAVE50 (₹50 flat off, min ₹500), NEWUSER (15% off, max ₹75, min ₹100)
// - Orders can be cancelled before the store starts picking (usually within 1–2 hours)
// - Missing/damaged items must be reported within 24 hours via the app
// - Delivery takes 30–60 minutes depending on location
// - We deliver 7 days a week, 8 AM to 10 PM

// USER CONTEXT:
// ${orderContext}${productContext}

// BEHAVIOR RULES:
// - Be warm, helpful, and concise. Use emojis sparingly but naturally.
// - When user asks about their order status, give the exact status from context above.
// - When user asks about cart, tell them exactly what's in it.
// - Suggest relevant products, coupons, or actions based on what they ask.
// - If they want to navigate somewhere, tell them to click the link (you can't navigate for them, but tell them where to go).
// - If you don't know something specific, say so honestly and suggest they contact support.
// - Keep responses under 120 words unless the user asks for detailed info.
// - Format lists with bullet points when showing multiple items.
// - Always respond in the same language the user writes in.`;
// };

// // ── Call Claude via backend proxy (avoids CORS) ───────────────────────────────
// const callClaude = async (messages, systemPrompt) => {
//   const response = await fetch('/api/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ messages, systemPrompt }),
//   });
//   if (!response.ok) {
//     const err = await response.json().catch(() => ({}));
//     throw new Error(err.message || 'Chat error');
//   }
//   const data = await response.json();
//   return data.reply || 'Sorry, I had trouble responding. Please try again.';
// };

// // ── Detect action intents for quick-action buttons in bot replies ─────────────
// const detectActions = (text) => {
//   const actions = [];
//   if (/order|track|delivery/i.test(text)) actions.push({ label: 'View Orders', path: '/orders' });
//   if (/cart|checkout/i.test(text)) actions.push({ label: 'Go to Cart', path: '/cart' });
//   if (/product|shop|browse|vegetable|fruit|dairy/i.test(text)) actions.push({ label: 'Browse Products', path: '/products' });
//   if (/coupon|promo|discount/i.test(text)) actions.push({ label: 'Go to Checkout', path: '/checkout' });
//   if (/help|support|contact/i.test(text)) actions.push({ label: 'Help Center', path: '/help' });
//   return actions.slice(0, 2); // max 2 action buttons
// };

// // ── Message bubble ────────────────────────────────────────────────────────────
// const MessageBubble = ({ msg, navigate }) => {
//   const isBot = msg.role === 'assistant';
//   const actions = isBot ? detectActions(msg.content) : [];

//   return (
//     <div className={`flex gap-2 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
//       {/* Avatar */}
//       {isBot ? (
//         <div className="flex items-center justify-center flex-shrink-0 text-xs font-black text-white rounded-full shadow w-7 h-7 bg-primary">G</div>
//       ) : (
//         <div className="flex items-center justify-center flex-shrink-0 text-xs rounded-full w-7 h-7 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
//           <span className="text-sm material-symbols-outlined">person</span>
//         </div>
//       )}
//       <div className={`max-w-[82%] space-y-1.5`}>
//         <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
//           ${isBot
//             ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm'
//             : 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20'}`}>
//           {msg.content}
//         </div>
//         {/* Action buttons */}
//         {actions.length > 0 && (
//           <div className="flex gap-2 flex-wrap pt-0.5">
//             {actions.map(a => (
//               <button key={a.path} onClick={() => navigate(a.path)}
//                 className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full font-semibold hover:bg-primary hover:text-white transition-all">
//                 {a.label} →
//               </button>
//             ))}
//           </div>
//         )}
//         <p className="text-[10px] text-slate-400 px-1">
//           {new Date(msg.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
//         </p>
//       </div>
//     </div>
//   );
// };

// // ── Typing indicator ──────────────────────────────────────────────────────────
// const TypingIndicator = () => (
//   <div className="flex items-start gap-2">
//     <div className="flex items-center justify-center text-xs font-black text-white rounded-full shadow w-7 h-7 bg-primary">G</div>
//     <div className="px-4 py-3 bg-white border rounded-tl-sm shadow-sm dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl">
//       <div className="flex items-center h-4 gap-1">
//         {[0, 1, 2].map(i => (
//           <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
//             style={{ animationDelay: `${i * 0.15}s` }} />
//         ))}
//       </div>
//     </div>
//   </div>
// );

// // ── Main ChatBot component ────────────────────────────────────────────────────
// // mode: 'float' (bubble) | 'embed' (inline in Help page)
// export const ChatBot = ({ mode = 'float' }) => {
//   const { user } = useAuth();
//   const { cart } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [open, setOpen] = useState(mode === 'embed');
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: `Hi${user ? ` ${user.name?.split(' ')[0]}` : ''}! 👋 I'm Genie, your Smart Grocery assistant. I can help you track orders, find products, apply coupons, and more. What can I do for you today?`,
//       ts: Date.now(),
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [unread, setUnread] = useState(0);
//   const [hasLoadedCtx, setHasLoadedCtx] = useState(false);
//   const bottomRef = useRef(null);
//   const inputRef = useRef(null);

//   // Load context data once
//   useEffect(() => {
//     if (!hasLoadedCtx) {
//       setHasLoadedCtx(true);
//       if (user) {
//         getMyOrders().then(r => setOrders(r.data || [])).catch(() => {});
//       }
//       getProducts({ limit: 20 }).then(r => setProducts(r.data?.products || [])).catch(() => {});
//     }
//   }, [user, hasLoadedCtx]);

//   // Auto-scroll
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, loading]);

//   // Track unread when closed
//   useEffect(() => {
//     if (!open && messages.length > 1) setUnread(u => u + 1);
//   }, [messages.length]);

//   // Clear unread on open
//   useEffect(() => {
//     if (open) { setUnread(0); inputRef.current?.focus(); }
//   }, [open]);

//   const systemPrompt = buildSystemPrompt({ user, orders, cart, products });

//   const sendMessage = useCallback(async (text) => {
//     const userText = (text || input).trim();
//     if (!userText || loading) return;
//     setInput('');

//     const userMsg = { role: 'user', content: userText, ts: Date.now() };
//     const newMessages = [...messages, userMsg];
//     setMessages(newMessages);
//     setLoading(true);

//     try {
//       const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
//       const reply = await callClaude(apiMessages, systemPrompt);
//       setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
//     } catch (err) {
//       const msg = err.message?.includes('GEMINI')
//         ? '⚠️ Chatbot not configured yet. Add your GEMINI_API_KEY to backend/.env and restart the server.'
//         : '⚠️ I\'m having trouble connecting. Make sure the backend server is running, then try again.';
//       setMessages(prev => [...prev, { role: 'assistant', content: msg, ts: Date.now() }]);
//     } finally {
//       setLoading(false);
//     }
//   }, [input, messages, loading, systemPrompt]);

//   const handleKey = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
//   };

//   const clearChat = () => {
//     setMessages([{
//       role: 'assistant',
//       content: `Hi again${user ? ` ${user.name?.split(' ')[0]}` : ''}! 👋 How can I help you today?`,
//       ts: Date.now(),
//     }]);
//   };

//   // ── EMBED MODE (inside Help page) ─────────────────────────────────────────
//   if (mode === 'embed') {
//     return (
//       <div className="flex flex-col overflow-hidden bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800" style={{ height: '560px' }}>
//         {/* Header */}
//         <div className="flex items-center justify-between flex-shrink-0 px-5 py-4 bg-primary">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center font-black text-white rounded-full w-9 h-9 bg-white/20">G</div>
//             <div>
//               <p className="text-sm font-black text-white">Genie — AI Assistant</p>
//               <div className="flex items-center gap-1.5">
//                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
//                 <span className="text-xs text-white/70">Online · Usually replies instantly</span>
//               </div>
//             </div>
//           </div>
//           <button onClick={clearChat} title="Clear chat"
//             className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
//             <span className="text-sm material-symbols-outlined text-white/80">refresh</span>
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950">
//           {messages.map((msg, i) => <MessageBubble key={i} msg={msg} navigate={navigate} />)}
//           {loading && <TypingIndicator />}
//           <div ref={bottomRef} />
//         </div>

//         {/* Quick actions */}
//         {messages.length <= 1 && (
//           <div className="flex flex-wrap gap-2 px-4 py-2 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
//             {QUICK_ACTIONS.slice(0, 3).map(a => (
//               <button key={a.prompt} onClick={() => sendMessage(a.prompt)}
//                 className="text-xs bg-primary/8 text-primary border border-primary/15 px-3 py-1.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
//                 {a.label}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Input */}
//         <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
//           <div className="flex items-end gap-2 px-4 py-2 transition-all border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
//             <textarea
//               ref={inputRef}
//               rows={1}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKey}
//               placeholder="Ask me anything about your orders, products..."
//               className="flex-1 py-1 text-sm bg-transparent outline-none resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 max-h-24"
//             />
//             <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
//               className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white transition-all rounded-lg shadow-md bg-primary disabled:opacity-40 hover:bg-primary/90 shadow-primary/25">
//               <span className="text-sm material-symbols-outlined">send</span>
//             </button>
//           </div>
//           <p className="text-[10px] text-slate-400 text-center mt-2">Powered by Claude AI · Smart Grocery</p>
//         </div>
//       </div>
//     );
//   }

//   // ── FLOAT MODE (bubble) ────────────────────────────────────────────────────
//   return (
//     <>
//       {/* Chat window */}
//       <div className={`fixed bottom-24 right-5 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 origin-bottom-right
//         ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}
//         style={{ height: open ? '520px' : 0 }}>

//         {/* Header */}
//         <div className="bg-primary px-4 py-3.5 flex items-center justify-between flex-shrink-0">
//           <div className="flex items-center gap-2.5">
//             <div className="flex items-center justify-center w-8 h-8 text-sm font-black text-white rounded-full bg-white/20">G</div>
//             <div>
//               <p className="text-sm font-black text-white">Genie</p>
//               <div className="flex items-center gap-1">
//                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
//                 <span className="text-xs text-white/70">AI Assistant · Online</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-1">
//             <button onClick={clearChat} title="New chat"
//               className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
//               <span className="text-sm material-symbols-outlined text-white/80">refresh</span>
//             </button>
//             <button onClick={() => setOpen(false)}
//               className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
//               <span className="text-sm text-white material-symbols-outlined">keyboard_arrow_down</span>
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950">
//           {messages.map((msg, i) => <MessageBubble key={i} msg={msg} navigate={navigate} />)}
//           {loading && <TypingIndicator />}
//           <div ref={bottomRef} />
//         </div>

//         {/* Quick actions (shown only at start) */}
//         {messages.length <= 1 && (
//           <div className="px-3 py-2 flex gap-1.5 flex-wrap border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
//             {QUICK_ACTIONS.map(a => (
//               <button key={a.prompt} onClick={() => sendMessage(a.prompt)}
//                 className="text-[11px] bg-primary/8 text-primary border border-primary/15 px-2.5 py-1 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
//                 {a.label}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Input */}
//         <div className="flex-shrink-0 px-3 py-3 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
//           <div className="flex items-end gap-2 px-3 py-2 transition-all border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
//             <textarea
//               ref={inputRef}
//               rows={1}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKey}
//               placeholder="Ask about orders, products, coupons..."
//               className="flex-1 bg-transparent outline-none text-sm resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 py-0.5 max-h-20"
//             />
//             <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
//               className="flex items-center justify-center flex-shrink-0 text-white transition-all rounded-lg w-7 h-7 bg-primary disabled:opacity-40 hover:bg-primary/90">
//               <span className="text-sm material-symbols-outlined">send</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Floating bubble button */}
//       <button
//         onClick={() => setOpen(o => !o)}
//         className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300
//           ${open ? 'bg-slate-700 rotate-0' : 'bg-primary hover:scale-110'} shadow-primary/30`}>
//         <span className={`material-symbols-outlined text-white text-2xl transition-all duration-200 ${open ? '' : ''}`}
//           style={{ fontVariationSettings: "'FILL' 1" }}>
//           {open ? 'close' : 'smart_toy'}
//         </span>
//         {/* Unread badge */}
//         {!open && unread > 0 && (
//           <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
//             {unread}
//           </span>
//         )}
//       </button>
//     </>
//   );
// };

// export default ChatBot;


import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getMyOrders, getProducts } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

// ── Quick action chips ────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: '📦 Track my order', prompt: 'Where is my latest order?' },
  { label: '🛒 What\'s in my cart?', prompt: 'What items are in my cart?' },
  { label: '🏷️ Any coupons?', prompt: 'What coupon codes are available?' },
  { label: '🚚 Delivery fees?', prompt: 'What are the delivery charges?' },
  { label: '↩️ Return policy', prompt: 'What is your return and refund policy?' },
  { label: '🥦 Fresh produce?', prompt: 'What fresh vegetables and fruits do you have?' },
];

// ── Build context-aware system prompt ────────────────────────────────────────
const buildSystemPrompt = ({ user, orders, cart, products }) => {
  const now = new Date().toLocaleString('en-IN');

  let orderContext = 'User is not logged in.';
  if (user) {
    orderContext = `Logged-in user: ${user.name} (${user.email}), role: ${user.role}.\n`;

    if (orders && orders.length > 0) {
      orderContext += `\nTheir recent orders (latest first):\n`;
      orders.slice(0, 5).forEach((o, i) => {
        orderContext += `  ${i + 1}. Order #${o._id.slice(-8).toUpperCase()} — Status: ${o.orderStatus} — ₹${o.totalPrice} — ${o.items.length} item(s)`;
        if (o.address) orderContext += ` — Deliver to: ${o.address.city}`;
        if (o.deliveryPerson) orderContext += ` — Rider: ${o.deliveryPerson.name}`;
        orderContext += `\n`;
      });
    } else {
      orderContext += 'User has no orders yet.\n';
    }

    if (cart && cart.items && cart.items.length > 0) {
      orderContext += `\nCart has ${cart.items.length} item(s): `;
      orderContext += cart.items.map(i => `${i.product?.name || 'item'} x${i.quantity}`).join(', ') + '.\n';
    } else {
      orderContext += 'Cart is empty.\n';
    }
  }

  let productContext = '';
  if (products && products.length > 0) {
    productContext = `\nAvailable featured products (sample): `;
    productContext += products.slice(0, 8).map(p => `${p.name} (₹${p.price}/${p.unit || 'unit'})`).join(', ') + '.';
  }

  return `You are Genie 🧞, the friendly AI shopping assistant for Smart Grocery — an online grocery delivery app in India.

Current date/time: ${now}

STORE POLICIES:
- Free delivery on orders above ₹500; otherwise ₹40 delivery charge
- Active coupon codes: FRESH20 (20% off, max ₹100, min order ₹200), SAVE50 (₹50 flat off, min ₹500), NEWUSER (15% off, max ₹75, min ₹100)
- Orders can be cancelled before the store starts picking (usually within 1–2 hours)
- Missing/damaged items must be reported within 24 hours via the app
- Delivery takes 30–60 minutes depending on location
- We deliver 7 days a week, 8 AM to 10 PM

USER CONTEXT:
${orderContext}${productContext}

BEHAVIOR RULES:
- Be warm, helpful, and concise. Use emojis sparingly but naturally.
- When user asks about their order status, give the exact status from context above.
- When user asks about cart, tell them exactly what's in it.
- Suggest relevant products, coupons, or actions based on what they ask.
- If they want to navigate somewhere, tell them to click the link (you can't navigate for them, but tell them where to go).
- If you don't know something specific, say so honestly and suggest they contact support.
- Keep responses under 120 words unless the user asks for detailed info.
- Format lists with bullet points when showing multiple items.
- Always respond in the same language the user writes in.`;
};

// ── Call Claude via backend proxy (avoids CORS) ───────────────────────────────
const callClaude = async (messages, systemPrompt) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Chat error');
  }
  const data = await response.json();
  return data.reply || 'Sorry, I had trouble responding. Please try again.';
};

// ── Detect action intents for quick-action buttons in bot replies ─────────────
const detectActions = (text) => {
  const actions = [];
  if (/order|track|delivery/i.test(text)) actions.push({ label: 'View Orders', path: '/orders' });
  if (/cart|checkout/i.test(text)) actions.push({ label: 'Go to Cart', path: '/cart' });
  if (/product|shop|browse|vegetable|fruit|dairy/i.test(text)) actions.push({ label: 'Browse Products', path: '/products' });
  if (/coupon|promo|discount/i.test(text)) actions.push({ label: 'Go to Checkout', path: '/checkout' });
  if (/help|support|contact/i.test(text)) actions.push({ label: 'Help Center', path: '/help' });
  return actions.slice(0, 2); // max 2 action buttons
};

// ── Message bubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ msg, navigate }) => {
  const isBot = msg.role === 'assistant';
  const actions = isBot ? detectActions(msg.content) : [];

  return (
    <div className={`flex gap-2 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
      {/* Avatar */}
      {isBot ? (
        <div className="flex items-center justify-center flex-shrink-0 text-xs font-black text-white rounded-full shadow w-7 h-7 bg-primary">G</div>
      ) : (
        <div className="flex items-center justify-center flex-shrink-0 text-xs rounded-full w-7 h-7 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          <span className="text-sm material-symbols-outlined">person</span>
        </div>
      )}
      <div className={`max-w-[82%] space-y-1.5`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${isBot
            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm'
            : 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20'}`}>
          {msg.content}
        </div>
        {/* Action buttons */}
        {actions.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-0.5">
            {actions.map(a => (
              <button key={a.path} onClick={() => navigate(a.path)}
                className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full font-semibold hover:bg-primary hover:text-white transition-all">
                {a.label} →
              </button>
            ))}
          </div>
        )}
        <p className="text-[10px] text-slate-400 px-1">
          {new Date(msg.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// ── Typing indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-start gap-2">
    <div className="flex items-center justify-center text-xs font-black text-white rounded-full shadow w-7 h-7 bg-primary">G</div>
    <div className="px-4 py-3 bg-white border rounded-tl-sm shadow-sm dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl">
      <div className="flex items-center h-4 gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  </div>
);

// ── Main ChatBot component ────────────────────────────────────────────────────
// mode: 'float' (bubble) | 'embed' (inline in Help page)
export const ChatBot = ({ mode = 'float' }) => {
  const { user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(mode === 'embed');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi${user ? ` ${user.name?.split(' ')[0]}` : ''}! 👋 I'm Genie, your Smart Grocery assistant. I can help you track orders, find products, apply coupons, and more. What can I do for you today?`,
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [unread, setUnread] = useState(0);
  const [hasLoadedCtx, setHasLoadedCtx] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load context data once
  useEffect(() => {
    if (!hasLoadedCtx) {
      setHasLoadedCtx(true);
      if (user) {
        getMyOrders().then(r => setOrders(r.data || [])).catch(() => {});
      }
      getProducts({ limit: 20 }).then(r => setProducts(r.data?.products || [])).catch(() => {});
    }
  }, [user, hasLoadedCtx]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Track unread when closed
  useEffect(() => {
    if (!open && messages.length > 1) setUnread(u => u + 1);
  }, [messages.length]);

  // Clear unread on open
  useEffect(() => {
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [open]);

  const systemPrompt = buildSystemPrompt({ user, orders, cart, products });

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: userText, ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(apiMessages, systemPrompt);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
    } catch (err) {
      const msg = err.message?.includes('QUOTA_EXCEEDED')
        ? '⚠️ Gemini API quota exceeded on this key. Fix: Go to **aistudio.google.com** → create a **new project** → generate a new API key → update GEMINI_API_KEY in backend/.env → restart server.'
        : err.message?.includes('GEMINI_API_KEY')
        ? '⚠️ Chatbot not configured. Add GEMINI_API_KEY to backend/.env and restart the server.'
        : '⚠️ Could not connect to the chat service. Make sure the backend is running.';
      setMessages(prev => [...prev, { role: 'assistant', content: msg, ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, systemPrompt]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Hi again${user ? ` ${user.name?.split(' ')[0]}` : ''}! 👋 How can I help you today?`,
      ts: Date.now(),
    }]);
  };

  // ── EMBED MODE (inside Help page) ─────────────────────────────────────────
  if (mode === 'embed') {
    return (
      <div className="flex flex-col overflow-hidden bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800" style={{ height: '560px' }}>
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0 px-5 py-4 bg-primary">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center font-black text-white rounded-full w-9 h-9 bg-white/20">G</div>
            <div>
              <p className="text-sm font-black text-white">Genie — AI Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/70">Online · Usually replies instantly</span>
              </div>
            </div>
          </div>
          <button onClick={clearChat} title="Clear chat"
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <span className="text-sm material-symbols-outlined text-white/80">refresh</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} navigate={navigate} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick actions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-4 py-2 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
            {QUICK_ACTIONS.slice(0, 3).map(a => (
              <button key={a.prompt} onClick={() => sendMessage(a.prompt)}
                className="text-xs bg-primary/8 text-primary border border-primary/15 px-3 py-1.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-end gap-2 px-4 py-2 transition-all border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about your orders, products..."
              className="flex-1 py-1 text-sm bg-transparent outline-none resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 max-h-24"
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white transition-all rounded-lg shadow-md bg-primary disabled:opacity-40 hover:bg-primary/90 shadow-primary/25">
              <span className="text-sm material-symbols-outlined">send</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">Powered by Claude AI · Smart Grocery</p>
        </div>
      </div>
    );
  }

  // ── FLOAT MODE (bubble) ────────────────────────────────────────────────────
  return (
    <>
      {/* Chat window */}
      <div className={`fixed bottom-24 right-5 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 origin-bottom-right
        ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}
        style={{ height: open ? '520px' : 0 }}>

        {/* Header */}
        <div className="bg-primary px-4 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 text-sm font-black text-white rounded-full bg-white/20">G</div>
            <div>
              <p className="text-sm font-black text-white">Genie</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/70">AI Assistant · Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clearChat} title="New chat"
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
              <span className="text-sm material-symbols-outlined text-white/80">refresh</span>
            </button>
            <button onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
              <span className="text-sm text-white material-symbols-outlined">keyboard_arrow_down</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} navigate={navigate} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick actions (shown only at start) */}
        {messages.length <= 1 && (
          <div className="px-3 py-2 flex gap-1.5 flex-wrap border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            {QUICK_ACTIONS.map(a => (
              <button key={a.prompt} onClick={() => sendMessage(a.prompt)}
                className="text-[11px] bg-primary/8 text-primary border border-primary/15 px-2.5 py-1 rounded-full font-medium hover:bg-primary hover:text-white transition-all">
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex-shrink-0 px-3 py-3 bg-white border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-end gap-2 px-3 py-2 transition-all border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about orders, products, coupons..."
              className="flex-1 bg-transparent outline-none text-sm resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 py-0.5 max-h-20"
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="flex items-center justify-center flex-shrink-0 text-white transition-all rounded-lg w-7 h-7 bg-primary disabled:opacity-40 hover:bg-primary/90">
              <span className="text-sm material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating bubble button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300
          ${open ? 'bg-slate-700 rotate-0' : 'bg-primary hover:scale-110'} shadow-primary/30`}>
        <span className={`material-symbols-outlined text-white text-2xl transition-all duration-200 ${open ? '' : ''}`}
          style={{ fontVariationSettings: "'FILL' 1" }}>
          {open ? 'close' : 'smart_toy'}
        </span>
        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unread}
          </span>
        )}
      </button>
    </>
  );
};

export default ChatBot;
