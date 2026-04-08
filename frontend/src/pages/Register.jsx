import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
  Wrench,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';

const roleCards = [
  {
    value: 'customer',
    title: 'Customer',
    description: 'Find verified providers, compare prices, and manage bookings with confidence.',
    icon: ShieldCheck,
  },
  {
    value: 'provider',
    title: 'Provider',
    description: 'Create clear service listings, manage requests, and build trust through better presentation.',
    icon: Wrench,
  },
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await registerUser(formData);
      login(data);
      toast.success(`Welcome to Fixify, ${data.user.name}`);
      navigate(data.user.role === 'provider' ? '/provider-dashboard' : '/services');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="section-shell grid items-center gap-8 lg:grid-cols-[1.05fr_520px]">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <div className="card-elevated overflow-hidden">
            <div className="bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(47,155,89,0.12),transparent_22%)] p-10">
              <span className="eyebrow">Create your Fixify account</span>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-tight text-ink-900">
                Join the trust-first marketplace experience you selected.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                Whether you are booking help or offering services, this design direction centers on transparency and calm,
                practical flows.
              </p>

              <div className="mt-8 space-y-4">
                {roleCards.map((role) => (
                  <div key={role.value} className="rounded-[28px] border border-[#eadfc8] bg-white/80 p-5 backdrop-blur">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl border border-accent-100 bg-accent-50 p-3">
                        <role.icon className="h-5 w-5 text-accent-700" />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-ink-900">{role.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{role.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
            <span className="eyebrow">Register</span>
            <h2 className="mt-5 font-display text-4xl font-semibold text-ink-900">Create your account</h2>
            <p className="mt-3 text-slate-600">Choose a role, complete your profile basics, and step into the new Fixify experience.</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {roleCards.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => updateField('role', role.value)}
                className={`rounded-[28px] border p-5 text-left transition-all ${
                  formData.role === role.value
                    ? 'border-accent-200 bg-accent-50 shadow-soft'
                    : 'border-[#eadfc8] bg-white hover:border-primary-200'
                }`}
              >
                <div className="w-fit rounded-2xl border border-primary-100 bg-primary-50 p-3 text-primary-700">
                  <role.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink-900">{role.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{role.description}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Full name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="input-field !pl-12"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className="input-field !pl-12"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  className="input-field !pl-12 !pr-12"
                  placeholder="At least 6 characters"
                  minLength={6}
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

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className="input-field !pl-12"
                    placeholder="Optional phone number"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(event) => updateField('location', event.target.value)}
                    className="input-field !pl-12"
                    placeholder="City or locality"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary inline-flex w-full items-center justify-center gap-2 !py-4 text-base">
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Create Fixify account
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-700 transition-colors hover:text-primary-800">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
