import { useState } from 'react';
import { requestPasswordReset } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try { await requestPasswordReset(email); setMessage('Check your email for a password reset link.'); } catch (err) { setError(err.message || 'Unable to send the reset email.'); }
  };

  return (
    <div className="section-shell py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Forgot Password</h1>
        <p className="mt-3 text-slate-600">Enter your account email and Supabase Auth will send a recovery link.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="w-full rounded-xl border border-slate-200 px-4 py-3" /><button className="gradient-button w-full">Send Reset Link</button></form>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
