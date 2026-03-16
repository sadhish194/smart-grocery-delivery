// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const categories = [
//   {
//     icon: 'local_shipping',
//     color: 'bg-violet-100 text-violet-600',
//     title: 'Orders & Delivery',
//     desc: 'Track your order, change delivery times, or report issues.',
//   },
//   {
//     icon: 'payments',
//     color: 'bg-emerald-100 text-emerald-600',
//     title: 'Payments & Refunds',
//     desc: 'Manage billing, request refunds, and view transaction history.',
//   },
//   {
//     icon: 'lock',
//     color: 'bg-violet-100 text-violet-600',
//     title: 'Account & Security',
//     desc: 'Reset passwords, update profile, and manage privacy settings.',
//   },
//   {
//     icon: 'sell',
//     color: 'bg-emerald-100 text-emerald-600',
//     title: 'Promotions',
//     desc: 'Apply promo codes, gift cards, and loyalty reward points.',
//   },
// ];

// const faqs = [
//   {
//     q: 'How do I track my delivery in real-time?',
//     a: 'Once your order is out for delivery, you can track the driver\'s location live through the "Orders" tab in your account. You\'ll also receive SMS notifications at key milestones.',
//   },
//   {
//     q: 'What happens if an item is missing from my order?',
//     a: 'If an item is missing or damaged, please report it within 24 hours via the app. Go to \'Orders\', select the specific order, and click \'Report an Issue\' to receive an immediate refund or redelivery.',
//   },
//   {
//     q: 'Can I cancel my order after it has been placed?',
//     a: 'Orders can be cancelled free of charge until the store starts picking your items. Usually, this is about 1–2 hours before your scheduled delivery slot.',
//   },
//   {
//     q: 'What are the delivery fees?',
//     a: 'Delivery fees vary based on your distance from the store and the size of the order. Orders above ₹500 get free delivery. Subscribe to Smart Pass for unlimited free deliveries.',
//   },
//   {
//     q: 'How do I apply a coupon or promo code?',
//     a: 'You can apply a coupon code on the Checkout page in the "Coupon Code" field. Valid codes will instantly deduct the discount from your order total.',
//   },
//   {
//     q: 'What payment methods are accepted?',
//     a: 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. All online payments are secured with 256-bit encryption.',
//   },
// ];

// const FAQ = ({ q, a }) => {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
//       <button
//         onClick={() => setOpen(o => !o)}
//         className="flex items-center justify-between w-full gap-4 py-5 text-left transition-colors hover:text-primary"
//       >
//         <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{q}</span>
//         <span className={`material-symbols-outlined text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
//           expand_more
//         </span>
//       </button>
//       {open && (
//         <p className="pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{a}</p>
//       )}
//     </div>
//   );
// };

// const Help = () => {
//   const [query, setQuery] = useState('');
//   const [searched, setSearched] = useState('');
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const filtered = searched
//     ? faqs.filter(f => f.q.toLowerCase().includes(searched.toLowerCase()) || f.a.toLowerCase().includes(searched.toLowerCase()))
//     : faqs;

//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-950">

//       {/* ── Hero ── */}
//       <div className="relative px-4 py-20 overflow-hidden text-center bg-gradient-to-br from-slate-100 via-violet-50 to-emerald-50 dark:from-slate-900 dark:via-violet-950/30 dark:to-slate-900">
//         {/* Decorative blobs */}
//         <div className="absolute top-0 -translate-y-1/2 rounded-full left-1/4 w-72 h-72 bg-violet-200/40 dark:bg-violet-800/20 blur-3xl" />
//         <div className="absolute bottom-0 w-56 h-56 translate-y-1/2 rounded-full right-1/4 bg-emerald-200/40 dark:bg-emerald-800/20 blur-3xl" />

//         <div className="relative max-w-2xl mx-auto">
//           <h1 className="mb-4 text-5xl font-black leading-tight text-slate-900 dark:text-white">
//             How can we help?
//           </h1>
//           <p className="mb-10 text-base leading-relaxed text-slate-500 dark:text-slate-400">
//             Search our help center for instant answers to common questions<br className="hidden sm:block" />
//             about your delivery, billing, and more.
//           </p>

//           {/* Search bar */}
//           <div className="flex items-center max-w-xl gap-2 px-4 py-2 mx-auto bg-white border shadow-lg dark:bg-slate-800 rounded-2xl shadow-slate-200/60 dark:shadow-none border-slate-100 dark:border-slate-700">
//             <span className="material-symbols-outlined text-slate-400">search</span>
//             <input
//               value={query}
//               onChange={e => setQuery(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && setSearched(query)}
//               placeholder="Search for articles, tracking, or billing help..."
//               className="flex-1 py-1 text-sm bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
//             />
//             <button
//               onClick={() => setSearched(query)}
//               className="flex-shrink-0 px-5 py-2 text-sm font-bold text-white transition-all shadow-md bg-primary rounded-xl hover:bg-primary/90 shadow-primary/25"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Browse by Category ── */}
//       <div className="max-w-5xl px-4 py-16 mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-xl font-black text-slate-900 dark:text-white">Browse by Category</h2>
//           <button className="text-sm font-semibold text-primary hover:underline">View all topics</button>
//         </div>
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {categories.map(cat => (
//             <div key={cat.title}
//               className="p-6 transition-all duration-200 bg-white border cursor-pointer dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 group">
//               <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
//                 <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
//               </div>
//               <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">{cat.title}</h3>
//               <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{cat.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── FAQ ── */}
//       <div className="px-4 py-16 bg-slate-50 dark:bg-slate-900/50">
//         <div className="max-w-3xl mx-auto">
//           <div className="mb-10 text-center">
//             <h2 className="mb-3 text-3xl font-black text-slate-900 dark:text-white">
//               Frequently Asked Questions
//             </h2>
//             <p className="text-sm text-slate-500 dark:text-slate-400">
//               Quick answers to the questions we get asked the most.
//             </p>
//           </div>

//           {searched && (
//             <div className="flex items-center gap-2 mb-6">
//               <span className="text-sm text-slate-500">Results for "<span className="font-semibold text-slate-700 dark:text-slate-200">{searched}</span>"</span>
//               <button onClick={() => { setSearched(''); setQuery(''); }}
//                 className="ml-2 text-xs text-primary hover:underline">Clear</button>
//             </div>
//           )}

//           <div className="px-6 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
//             {filtered.length > 0
//               ? filtered.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)
//               : (
//                 <div className="py-12 text-center text-slate-400">
//                   <span className="block mb-3 text-4xl material-symbols-outlined">search_off</span>
//                   <p className="font-semibold">No results found</p>
//                   <p className="mt-1 text-sm">Try a different search term or browse by category above</p>
//                 </div>
//               )
//             }
//           </div>

//           {/* Quick links */}
//           <div className="flex flex-wrap justify-center gap-2 mt-8">
//             {['Track my order', 'Request refund', 'Change address', 'Cancel order', 'Apply coupon'].map(tag => (
//               <button key={tag} onClick={() => { setQuery(tag); setSearched(tag); }}
//                 className="px-4 py-2 text-xs font-medium transition-all bg-white border rounded-full dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary">
//                 {tag}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Still need help? ── */}
//       <div className="px-4 py-16">
//         <div className="relative max-w-5xl p-10 mx-auto overflow-hidden bg-primary rounded-3xl">
//           {/* Decorative circles */}
//           <div className="absolute rounded-full -bottom-10 -left-10 w-44 h-44 bg-white/10" />
//           <div className="absolute w-24 h-24 rounded-full -top-6 left-32 bg-white/10" />

//           <div className="relative grid items-center grid-cols-1 gap-10 md:grid-cols-2">
//             {/* Left text */}
//             <div>
//               <h2 className="mb-4 text-3xl font-black leading-tight text-white">Still need help?</h2>
//               <p className="mb-6 text-sm leading-relaxed text-white/80">
//                 Our support team is available 24/7 to help you with any questions or concerns you might have.
//               </p>
//               <div className="space-y-3">
//                 {[
//                   'Average chat response: < 2 minutes',
//                   'Multi-language support available',
//                 ].map(t => (
//                   <div key={t} className="flex items-center gap-2 text-sm text-white">
//                     <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full bg-emerald-400">
//                       <span className="text-xs text-white material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
//                     </span>
//                     {t}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right contact options */}
//             <div className="space-y-3">
//               {[
//                 { icon: 'chat', label: 'Live Chat', sub: 'Fastest way to get help', href: '#' },
//                 { icon: 'mail', label: 'Email Support', sub: 'help@smartgrocery.com', href: 'mailto:help@smartgrocery.com' },
//                 { icon: 'call', label: 'Call Us', sub: '1-800-SMART-GROCERY', href: 'tel:18007627786' },
//               ].map(opt => (
//                 <a key={opt.label} href={opt.href}
//                   className="flex items-center gap-4 px-5 py-4 transition-all bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-2xl group">
//                   <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 transition-all bg-white/20 rounded-xl group-hover:bg-white/30">
//                     <span className="text-lg text-white material-symbols-outlined">{opt.icon}</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-white">{opt.label}</p>
//                     <p className="text-xs text-white/70">{opt.sub}</p>
//                   </div>
//                   <span className="ml-auto transition-colors material-symbols-outlined text-white/50 group-hover:text-white">chevron_right</span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Help;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChatBot } from '../../components/ChatBot';

const categories = [
  {
    icon: 'local_shipping',
    color: 'bg-violet-100 text-violet-600',
    title: 'Orders & Delivery',
    desc: 'Track your order, change delivery times, or report issues.',
  },
  {
    icon: 'payments',
    color: 'bg-emerald-100 text-emerald-600',
    title: 'Payments & Refunds',
    desc: 'Manage billing, request refunds, and view transaction history.',
  },
  {
    icon: 'lock',
    color: 'bg-violet-100 text-violet-600',
    title: 'Account & Security',
    desc: 'Reset passwords, update profile, and manage privacy settings.',
  },
  {
    icon: 'sell',
    color: 'bg-emerald-100 text-emerald-600',
    title: 'Promotions',
    desc: 'Apply promo codes, gift cards, and loyalty reward points.',
  },
];

const faqs = [
  {
    q: 'How do I track my delivery in real-time?',
    a: 'Once your order is out for delivery, you can track the driver\'s location live through the "Orders" tab in your account. You\'ll also receive SMS notifications at key milestones.',
  },
  {
    q: 'What happens if an item is missing from my order?',
    a: 'If an item is missing or damaged, please report it within 24 hours via the app. Go to \'Orders\', select the specific order, and click \'Report an Issue\' to receive an immediate refund or redelivery.',
  },
  {
    q: 'Can I cancel my order after it has been placed?',
    a: 'Orders can be cancelled free of charge until the store starts picking your items. Usually, this is about 1–2 hours before your scheduled delivery slot.',
  },
  {
    q: 'What are the delivery fees?',
    a: 'Delivery fees vary based on your distance from the store and the size of the order. Orders above ₹500 get free delivery. Subscribe to Smart Pass for unlimited free deliveries.',
  },
  {
    q: 'How do I apply a coupon or promo code?',
    a: 'You can apply a coupon code on the Checkout page in the "Coupon Code" field. Valid codes will instantly deduct the discount from your order total.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. All online payments are secured with 256-bit encryption.',
  },
];

const FAQ = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full gap-4 py-5 text-left transition-colors hover:text-primary"
      >
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{q}</span>
        <span className={`material-symbols-outlined text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{a}</p>
      )}
    </div>
  );
};

const Help = () => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const filtered = searched
    ? faqs.filter(f => f.q.toLowerCase().includes(searched.toLowerCase()) || f.a.toLowerCase().includes(searched.toLowerCase()))
    : faqs;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">

      {/* ── Hero ── */}
      <div className="relative px-4 py-20 overflow-hidden text-center bg-gradient-to-br from-slate-100 via-violet-50 to-emerald-50 dark:from-slate-900 dark:via-violet-950/30 dark:to-slate-900">
        {/* Decorative blobs */}
        <div className="absolute top-0 -translate-y-1/2 rounded-full left-1/4 w-72 h-72 bg-violet-200/40 dark:bg-violet-800/20 blur-3xl" />
        <div className="absolute bottom-0 w-56 h-56 translate-y-1/2 rounded-full right-1/4 bg-emerald-200/40 dark:bg-emerald-800/20 blur-3xl" />

        <div className="relative max-w-2xl mx-auto">
          <h1 className="mb-4 text-5xl font-black leading-tight text-slate-900 dark:text-white">
            How can we help?
          </h1>
          <p className="mb-10 text-base leading-relaxed text-slate-500 dark:text-slate-400">
            Search our help center for instant answers to common questions<br className="hidden sm:block" />
            about your delivery, billing, and more.
          </p>

          {/* Search bar */}
          <div className="flex items-center max-w-xl gap-2 px-4 py-2 mx-auto bg-white border shadow-lg dark:bg-slate-800 rounded-2xl shadow-slate-200/60 dark:shadow-none border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400">search</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setSearched(query)}
              placeholder="Search for articles, tracking, or billing help..."
              className="flex-1 py-1 text-sm bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
            />
            <button
              onClick={() => setSearched(query)}
              className="flex-shrink-0 px-5 py-2 text-sm font-bold text-white transition-all shadow-md bg-primary rounded-xl hover:bg-primary/90 shadow-primary/25"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── Browse by Category ── */}
      <div className="max-w-5xl px-4 py-16 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Browse by Category</h2>
          <button className="text-sm font-semibold text-primary hover:underline">View all topics</button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(cat => (
            <div key={cat.title}
              className="p-6 transition-all duration-200 bg-white border cursor-pointer dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 group">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
              </div>
              <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">{cat.title}</h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="px-4 py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-black text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quick answers to the questions we get asked the most.
            </p>
          </div>

          {searched && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-slate-500">Results for "<span className="font-semibold text-slate-700 dark:text-slate-200">{searched}</span>"</span>
              <button onClick={() => { setSearched(''); setQuery(''); }}
                className="ml-2 text-xs text-primary hover:underline">Clear</button>
            </div>
          )}

          <div className="px-6 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            {filtered.length > 0
              ? filtered.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)
              : (
                <div className="py-12 text-center text-slate-400">
                  <span className="block mb-3 text-4xl material-symbols-outlined">search_off</span>
                  <p className="font-semibold">No results found</p>
                  <p className="mt-1 text-sm">Try a different search term or browse by category above</p>
                </div>
              )
            }
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['Track my order', 'Request refund', 'Change address', 'Cancel order', 'Apply coupon'].map(tag => (
              <button key={tag} onClick={() => { setQuery(tag); setSearched(tag); }}
                className="px-4 py-2 text-xs font-medium transition-all bg-white border rounded-full dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI Chat Section ── */}
      <div className="max-w-5xl px-4 py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <span className="text-sm material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              AI-POWERED SUPPORT
            </div>
            <h2 className="mb-4 text-3xl font-black leading-tight text-slate-900 dark:text-white">
              Chat with Genie,<br />your AI assistant
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Get instant answers about your orders, delivery status, coupons, and products — without waiting for a human agent.
            </p>
            <ul className="space-y-3">
              {[
                { icon: 'track_changes', text: 'Real-time order tracking & status' },
                { icon: 'sell', text: 'Coupon codes & discount info' },
                { icon: 'inventory_2', text: 'Product availability & prices' },
                { icon: 'assignment_return', text: 'Returns, refunds & cancellations' },
              ].map(f => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-center flex-shrink-0 rounded-lg w-7 h-7 bg-primary/10">
                    <span className="text-sm material-symbols-outlined text-primary">{f.icon}</span>
                  </div>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
          {/* Right: embedded chat */}
          <div>
            <ChatBot mode="embed" />
          </div>
        </div>
      </div>

      {/* ── Still need help? ── */}
      <div className="px-4 py-16">
        <div className="relative max-w-5xl p-10 mx-auto overflow-hidden bg-primary rounded-3xl">
          {/* Decorative circles */}
          <div className="absolute rounded-full -bottom-10 -left-10 w-44 h-44 bg-white/10" />
          <div className="absolute w-24 h-24 rounded-full -top-6 left-32 bg-white/10" />

          <div className="relative grid items-center grid-cols-1 gap-10 md:grid-cols-2">
            {/* Left text */}
            <div>
              <h2 className="mb-4 text-3xl font-black leading-tight text-white">Still need help?</h2>
              <p className="mb-6 text-sm leading-relaxed text-white/80">
                Our support team is available 24/7 to help you with any questions or concerns you might have.
              </p>
              <div className="space-y-3">
                {[
                  'Average chat response: < 2 minutes',
                  'Multi-language support available',
                ].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm text-white">
                    <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full bg-emerald-400">
                      <span className="text-xs text-white material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </span>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right contact options */}
            <div className="space-y-3">
              {[
                { icon: 'chat', label: 'Live Chat', sub: 'Fastest way to get help', href: '#' },
                { icon: 'mail', label: 'Email Support', sub: 'help@smartgrocery.com', href: 'mailto:help@smartgrocery.com' },
                { icon: 'call', label: 'Call Us', sub: '1-800-SMART-GROCERY', href: 'tel:18007627786' },
              ].map(opt => (
                <a key={opt.label} href={opt.href}
                  className="flex items-center gap-4 px-5 py-4 transition-all bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-2xl group">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 transition-all bg-white/20 rounded-xl group-hover:bg-white/30">
                    <span className="text-lg text-white material-symbols-outlined">{opt.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{opt.label}</p>
                    <p className="text-xs text-white/70">{opt.sub}</p>
                  </div>
                  <span className="ml-auto transition-colors material-symbols-outlined text-white/50 group-hover:text-white">chevron_right</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
