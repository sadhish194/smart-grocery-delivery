import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from || '/';

  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin')    navigate('/admin', { replace: true });
      else if (user.role === 'delivery') navigate('/delivery', { replace: true });
      else navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const DEMO = [
    { label: 'Admin',    email: 'admin@demo.com',    pwd: 'admin123' },
    { label: 'Customer', email: 'customer@demo.com', pwd: 'cust123'  },
    { label: 'Delivery', email: 'delivery@demo.com', pwd: 'del123'   },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-primary">🛒 FreshMart</Link>
          <h1 className="text-2xl font-bold mt-4 mb-1">Welcome back!</h1>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl shadow-slate-100/50 dark:shadow-none">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-5">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
              <input type="email" required autoComplete="email" placeholder="you@example.com"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Password</label>
              <input type="password" required autoComplete="current-password" placeholder="••••••••"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 mt-2">
              {loading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-3 text-center">🧪 Demo Credentials</p>
          <div className="space-y-2">
            {DEMO.map(d => (
              <button key={d.label} onClick={() => setForm({ email: d.email, password: d.pwd })}
                className="w-full text-left text-xs bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border border-amber-200 dark:border-amber-700 hover:border-primary/40 hover:bg-primary/5 transition-all">
                <span className="font-bold text-primary">{d.label}:</span>{' '}
                <span className="text-slate-600 dark:text-slate-400">{d.email}</span>{' / '}
                <span className="text-slate-500">{d.pwd}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
