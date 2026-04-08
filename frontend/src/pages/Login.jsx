import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      login(data);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'provider' ? '/provider-dashboard' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-slate-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-100/40 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="card-elevated p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Fixify" className="w-12 h-12 rounded-xl object-cover" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to your Fixify account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com" className="input-field !pl-12" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••" className="input-field !pl-12 !pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><LogIn className="w-5 h-5" /> Sign In</>}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-primary-50 border border-primary-100">
            <p className="text-xs font-semibold text-primary-700 mb-2">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div><p className="font-medium text-slate-700">Customer</p><p>rahul@test.com</p></div>
              <div><p className="font-medium text-slate-700">Provider</p><p>amit@test.com</p></div>
              <p className="col-span-2 text-slate-400 mt-1">Password: password123</p>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
