import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateProfile } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await updateProfile(formData);
      updateUser(data);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="pb-16 pt-28">
      <div className="section-shell">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="card-elevated overflow-hidden">
              <div className="bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(47,155,89,0.12),transparent_22%)] p-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-primary-100 bg-white text-3xl font-bold text-ink-900">
                  {user?.name?.charAt(0)?.toUpperCase() || 'F'}
                </div>
                <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900">{user?.name}</h1>
                <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-700">
                  <ShieldCheck className="h-4 w-4" />
                  {user?.role === 'provider' ? 'Service provider account' : 'Customer account'}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Account details</p>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-primary-700" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-primary-700" />
                  Joined {memberSince}
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-primary-700" />
                  Trust-first profile presentation enabled
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card-elevated p-8 sm:p-10">
            <span className="eyebrow">Profile settings</span>
            <h2 className="mt-5 font-display text-4xl font-semibold text-ink-900">Edit your information</h2>
            <p className="mt-3 text-slate-600">Keep your profile details accurate so other people can trust what they see.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Full name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    className="input-field !pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    className="input-field !pl-12"
                    placeholder="Optional phone number"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-600">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input type="email" value={user?.email} disabled className="input-field !pl-12 !bg-slate-50 !text-slate-400" />
              </div>
              <p className="mt-2 text-xs text-slate-400">Email is locked because it is used for account identity.</p>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-600">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={(event) => setFormData({ ...formData, location: event.target.value })}
                  className="input-field !pl-12"
                  placeholder="City, state, or service area"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Bio <span className="font-normal text-slate-400">({formData.bio.length}/500)</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
                  rows={5}
                  maxLength={500}
                  className="input-field !pl-12 resize-none"
                  placeholder={
                    user?.role === 'provider'
                      ? 'Describe your experience, specialties, and what customers can expect from your service.'
                      : 'Share a short note about yourself if you want providers to know more about your preferences.'
                  }
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-8 inline-flex w-full items-center justify-center gap-2 !py-4 text-base">
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save changes
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
