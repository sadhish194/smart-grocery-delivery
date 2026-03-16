import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-1.5 rounded-lg text-white">
                <span className="material-symbols-outlined">shopping_basket</span>
              </div>
              <span className="text-xl font-bold text-primary">SmartGrocery</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Freshness delivered to your doorstep. Shop smarter, live better.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Snacks'].map(c => (
                <li key={c}><Link to={`/products?category=${c}`} className="hover:text-primary transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base">email</span> support@smartgrocery.com</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base">phone</span> +1 800 123 4567</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base">location_on</span> 123 Market St, NYC</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 text-center text-sm text-slate-500">
          © 2024 SmartGrocery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
