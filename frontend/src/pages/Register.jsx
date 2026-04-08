import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer', phone: '', location: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await registerUser(formData);
      login(data);
      toast.success(`Welcome to Fixify, ${data.user.name}!`);
      navigate(data.user.role === 'provider' ? '/provider-dashboard' : '/services');
    } catch (error) { toast.error(error.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const update = (field, value) => setFormData({ ...formData, [field]: value });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-slate-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent-100/40 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="card-elevated p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Fixify" className="w-12 h-12 rounded-xl object-cover" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
            <p className="text-slate-500 mt-2">Join the Fixify community</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'customer', label: 'Customer', desc: 'Book services', emoji: '👤' },
              { value: 'provider', label: 'Provider', desc: 'Offer services', emoji: '🛠️' },
            ].map((role) => (
              <button key={role.value} type="button" onClick={() => update('role', role.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                  formData.role === role.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}>
                <span className="text-2xl block mb-1">{role.emoji}</span>
                <p className={`text-sm font-semibold ${formData.role === role.value ? 'text-primary-700' : 'text-slate-700'}`}>{role.label}</p>
                <p className="text-xs text-slate-400">{role.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={formData.name} onChange={(e) => update('name', e.target.value)}
                placeholder="Full Name" className="input-field !pl-12" required />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)}
                placeholder="Email Address" className="input-field !pl-12" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type={showPassword ? 'text' : 'password'} value={formData.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Password (min 6 characters)" className="input-field !pl-12 !pr-12" required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)}
                placeholder="Phone Number" className="input-field !pl-12" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={formData.location} onChange={(e) => update('location', e.target.value)}
                placeholder="City, State" className="input-field !pl-12" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><UserPlus className="w-5 h-5" /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
