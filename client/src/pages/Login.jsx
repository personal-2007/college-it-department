import { useState } from 'react';
import { ArrowUpRight, Check, Eye, EyeOff, Fingerprint, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(form);
      if (response.role === 'admin') navigate('/admin/dashboard');
      else if (response.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      const message = err?.message;
      setError(message === 'Invalid login credentials' ? 'Invalid email or password. Please try again.' : (message || 'Unable to connect to Supabase. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell min-h-screen px-4 py-6 sm:px-8 lg:px-12">
      <div className="login-aurora login-aurora-one" />
      <div className="login-aurora login-aurora-two" />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[30px] border border-white/10 bg-[#080b1b]/80 shadow-[0_30px_100px_rgba(0,0,0,0.5)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="login-visual relative overflow-hidden px-7 py-8 text-white sm:px-12 sm:py-12 lg:px-16 lg:py-14">
          <div className="login-grid absolute inset-0 opacity-50" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-2 shadow-[0_0_25px_rgba(124,58,237,0.3)]">
                <img src="/college-logo.png" alt="Mahendra Engineering College logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-violet-200">MEC / IT CORE</p>
                <p className="mt-1 text-xs text-slate-400">Mahendra Engineering College</p>
              </div>
            </div>

            <div className="my-auto max-w-xl py-16">
              <h1 className="max-w-lg text-5xl font-bold leading-[1.03] tracking-tight sm:text-6xl">Shape the future of <span className="login-gradient-text">technology.</span></h1>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">One intelligent space for learning, assessment and the ideas that move your department forward.</p>
              <div className="mt-10 flex flex-wrap gap-3 text-xs text-slate-300">
                {['Learn', 'Build', 'Innovate'].map((item) => <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"><Check className="h-3.5 w-3.5 text-cyan-300" />{item}</span>)}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-500">
              <span>Information Technology Department</span>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />Systems online</div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#0b0f24]/90 px-6 py-10 sm:px-12 lg:px-14">
          <div className="login-card w-full max-w-md rounded-[26px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-9">
            <div className="mb-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/30 bg-gradient-to-br from-violet-500/30 to-blue-500/20 text-violet-200 shadow-[0_0_28px_rgba(139,92,246,0.35)]"><Fingerprint className="h-7 w-7" /></div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">Secure access</p>
              <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back!</h2>
              <p className="mt-2 text-sm text-slate-400">Login to your account to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Email</label>
                <div className="login-input-wrap relative">
                  <User className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-500 transition-colors" />
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:bg-violet-950/20 focus:shadow-[0_0_22px_rgba(139,92,246,0.15)]"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Password</label>
                <div className="login-input-wrap relative">
                  <Lock className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:bg-violet-950/20 focus:shadow-[0_0_22px_rgba(139,92,246,0.15)]"
                    placeholder="Password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-3.5 text-slate-500 transition hover:text-violet-300" aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-slate-400">
                  <input type="checkbox" className="login-checkbox" />
                  Remember Me
                </label>
              </div>

              {error && <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

              <button type="submit" disabled={loading} className="login-submit group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 px-4 py-3.5 text-sm font-bold tracking-[0.18em] text-white transition disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'SIGNING IN...' : 'LOGIN'} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
