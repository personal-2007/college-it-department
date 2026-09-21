import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updatePassword } from '../services/authService';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    try { await updatePassword(password); setMessage('Password updated. Redirecting to login...'); setTimeout(() => navigate('/login'), 1200); } catch (err) { setError(err.message || 'Unable to update the password.'); }
  };

  return <div className="section-shell py-16"><div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft"><h1 className="text-3xl font-bold text-slate-900">Reset Password</h1><p className="mt-3 text-slate-600">Choose a new password for your Supabase Auth account.</p><form onSubmit={handleSubmit} className="mt-6 space-y-4"><input type="password" required minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="w-full rounded-xl border border-slate-200 px-4 py-3" /><input type="password" required minLength="6" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" className="w-full rounded-xl border border-slate-200 px-4 py-3" /><button className="gradient-button w-full">Update Password</button></form>{message && <p className="mt-4 text-sm text-green-600">{message}</p>}{error && <p className="mt-4 text-sm text-red-600">{error}</p>}<Link to="/login" className="mt-5 inline-flex text-sm font-semibold text-primaryBlue">Back to login</Link></div></div>;
}