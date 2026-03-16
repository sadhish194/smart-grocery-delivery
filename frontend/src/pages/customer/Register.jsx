import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const user = await register(form);
      if (user.role === 'delivery') navigate('/delivery', { replace: true });
      else navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-primary">🛒 FreshMart</Link>
          <h1 className="text-2xl font-bold mt-4 mb-1">Create an account</h1>
          <p className="text-slate-500 text-sm">Join thousands of happy customers</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl shadow-slate-100/50 dark:shadow-none">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-5">
              {error}
            </div>
          )}

          {/* Role Toggle */}
          <div className="flex mb-6 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {['customer', 'delivery'].map(r => (
              <button key={r} type="button"
                onClick={() => setForm(f => ({ ...f, role: r }))}
                className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${form.role === r ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}>
                {r === 'customer' ? '🛍️ Customer' : '🚴 Delivery Partner'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',            label: 'Full Name',        type: 'text',     placeholder: 'John Doe',           autocomplete: 'name' },
              { key: 'email',           label: 'Email',            type: 'email',    placeholder: 'you@example.com',    autocomplete: 'email' },
              { key: 'phone',           label: 'Phone Number',     type: 'tel',      placeholder: '9876543210',         autocomplete: 'tel' },
              { key: 'password',        label: 'Password',         type: 'password', placeholder: 'Min 6 characters',   autocomplete: 'new-password' },
              { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••',           autocomplete: 'new-password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">{f.label}</label>
                <input type={f.type} required autoComplete={f.autocomplete} placeholder={f.placeholder}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 mt-2">
              {loading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
