import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';

const highlights = [
  'Clear provider profiles and pricing',
  'Simple booking and payment flow',
  'Status updates and in-app messaging',
];

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginUser(formData);
      login(data);
      toast.success(`Welcome back, ${data.user.name}`);
      navigate(data.user.role === 'provider' ? '/provider-dashboard' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="section-shell grid items-center gap-8 lg:grid-cols-[1.05fr_440px]">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <div className="card-elevated overflow-hidden">
            <div className="bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(47,155,89,0.12),transparent_22%)] p-10">
              <span className="eyebrow">Trust-first experience</span>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-tight text-ink-900">
                Sign in to the version of Fixify built around confidence.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                The UI direction you chose keeps trust, pricing, and booking clarity visible across the full product.
              </p>

              <div className="mt-8 grid gap-4">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[24px] border border-[#eadfc8] bg-white/80 px-5 py-4 backdrop-blur">
                    <ShieldCheck className="h-5 w-5 text-accent-600" />
                    <span className="text-sm text-ink-900">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-[#eadfc8] bg-white/70 p-6 backdrop-blur">
                <p className="text-sm text-slate-500">Demo accounts</p>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    Customer: <span className="font-semibold">rahul@test.com</span>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    Provider: <span className="font-semibold">amit@test.com</span>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    Password: <span className="font-semibold">password123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-8 sm:p-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f2e4c5] bg-white shadow-soft">
              <img src="/logo.png" alt="Fixify" className="h-10 w-10 rounded-xl object-cover" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink-900">Fixify</p>
              <p className="text-sm text-slate-500">Trusted local services</p>
            </div>
          </Link>

          <div className="mt-8">
            <span className="eyebrow">Sign in</span>
            <h2 className="mt-5 font-display text-4xl font-semibold text-ink-900">Welcome back</h2>
            <p className="mt-3 text-slate-600">Access bookings, provider dashboards, payments, and chat.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className="input-field !pl-12"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  className="input-field !pl-12 !pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary inline-flex w-full items-center justify-center gap-2 !py-4 text-base">
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign in to Fixify
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Do not have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-700 transition-colors hover:text-primary-800">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
