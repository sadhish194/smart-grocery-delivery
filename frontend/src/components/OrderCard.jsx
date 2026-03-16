import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Assigned: 'bg-blue-100 text-blue-700',
  Accepted: 'bg-indigo-100 text-indigo-700',
  OutForDelivery: 'bg-orange-100 text-orange-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function OrderCard({ order }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Order ID</p>
          <p className="font-mono text-sm font-bold">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[order.orderStatus]}`}>{order.orderStatus}</span>
      </div>
      <div className="flex gap-3 mb-4 overflow-x-auto hide-scrollbar">
        {order.items?.slice(0, 4).map((item, i) => (
          <img key={i} src={item.image || `https://placehold.co/60x60/f0f0f0/999?text=${encodeURIComponent(item.name[0])}`}
            alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-800" />
        ))}
        {order.items?.length > 4 && (
          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">+{order.items.length - 4}</div>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-slate-500">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · </span>
          <span className="font-bold text-primary">₹{order.totalPrice?.toFixed(2)}</span>
        </div>
        <Link to={`/orders/${order._id}`} className="flex items-center gap-1 text-primary font-semibold hover:underline">
          Track <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
      <p className="text-xs text-slate-400 mt-2">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
    </div>
  );
}
