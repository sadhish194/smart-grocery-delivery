import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';
import { Loader } from '../../components/SharedComponents';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name:     user?.name     || '',
    email:    user?.email    || '',
    phone:    user?.phone    || '',
    password: '',
    address: {
      street:  user?.address?.street  || '',
      city:    user?.address?.city    || '',
      state:   user?.address?.state   || '',
      zipCode: user?.address?.zipCode || '',
    },
  });
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    const payload = { name: form.name, phone: form.phone, address: form.address };
    if (form.password) payload.password = form.password;
    try {
      const { data } = await updateProfile(payload);
      updateUser(data);
      setSuccess('Profile updated successfully!');
      setForm(f => ({ ...f, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  if (!user) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-8">My Profile</h1>

      {/* Avatar Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 mb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl font-black">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-black">{user.name}</h2>
          <p className="text-slate-500 text-sm">{user.email}</p>
          <span className="mt-1 inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full capitalize">{user.role}</span>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>{success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h3 className="font-bold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">Full Name</label>
              <input type="text" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">Email</label>
              <input type="email" value={form.email} disabled
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-100 dark:bg-slate-800 outline-none opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">Phone</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">New Password</label>
              <input type="password" placeholder="Leave blank to keep current"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h3 className="font-bold mb-4">Delivery Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">Street Address</label>
              <input type="text" placeholder="123 Main St"
                value={form.address.street}
                onChange={e => setForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            {[
              { key: 'city',    label: 'City',     placeholder: 'Mumbai' },
              { key: 'state',   label: 'State',    placeholder: 'Maharashtra' },
              { key: 'zipCode', label: 'ZIP Code', placeholder: '400001' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">{f.label}</label>
                <input type="text" placeholder={f.placeholder}
                  value={form.address[f.key]}
                  onChange={e => setForm(p => ({ ...p, address: { ...p.address, [f.key]: e.target.value } }))}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
          {saving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
