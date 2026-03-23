import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTime) - new Date();
      if (diff <= 0) { setTimeLeft(''); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endTime]);
  return timeLeft;
};

const FlashSaleCard = ({ sale }) => {
  const navigate = useNavigate();
  const timeLeft = useCountdown(sale.endTime);
  if (!timeLeft) return null;

  return (
    <div className="flex items-center justify-between gap-4 p-4 text-white transition-all cursor-pointer rounded-2xl hover:opacity-95"
      style={{ backgroundColor: sale.bannerColor || '#6e3dff' }}
      onClick={() => navigate(`/products?sale=${sale._id}`)}>
      <div className="flex items-center gap-3">
        <span className="text-2xl material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
        <div>
          <p className="text-lg font-black">{sale.title}</p>
          <p className="text-sm text-white/80">{sale.description || `Up to ${sale.discount}% off selected items`}</p>
        </div>
      </div>
      <div className="flex-shrink-0 text-center">
        <p className="mb-1 text-xs font-bold tracking-widest uppercase text-white/70">Ends in</p>
        <p className="text-2xl font-black tracking-wider tabular-nums">{timeLeft}</p>
        <span className="inline-block px-3 py-1 mt-2 text-xs font-black text-white rounded-full bg-white/20">
          {sale.discount}% OFF
        </span>
      </div>
    </div>
  );
};

export default function FlashSaleBanner() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch('/api/features/flash-sales')
      .then(r => r.json()).then(data => { if (Array.isArray(data)) setSales(data); })
      .catch(() => {});
  }, []);

  if (!sales.length) return null;

  return (
    <div className="space-y-3">
      {sales.map(sale => <FlashSaleCard key={sale._id} sale={sale} />)}
    </div>
  );
}