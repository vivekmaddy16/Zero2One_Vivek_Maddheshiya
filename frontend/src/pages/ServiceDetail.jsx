import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, IndianRupee, Calendar, Phone, MessageSquare, Shield, CheckCircle } from 'lucide-react';
import { getService, getServiceRatings } from '../api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const categoryIcons = { electrician: '⚡', plumber: '🔧', tutor: '📚', delivery: '🚚', cleaning: '🧹', painting: '🎨', carpentry: '🪚', other: '🛠️' };

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadService(); }, [id]);

  const loadService = async () => {
    try {
      const [sRes, rRes] = await Promise.all([getService(id), getServiceRatings(id)]);
      setService(sRes.data);
      setRatings(rRes.data);
    } catch { toast.error('Service not found'); navigate('/services'); }
    finally { setLoading(false); }
  };

  const handleBook = () => {
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    if (user.role !== 'customer') { toast.error('Only customers can book'); return; }
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto"><div className="h-72 skeleton rounded-2xl mb-6" /><div className="h-8 w-1/2 skeleton mb-4" /><div className="h-4 w-full skeleton mb-2" /></div>
      </div>
    );
  }
  if (!service) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden h-72 shadow-soft">
              {service.image ? <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gradient-to-br from-primary-400/30 to-accent-400/30 flex items-center justify-center text-8xl">{categoryIcons[service.category]}</div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/90 text-slate-700 shadow-sm capitalize">
                  {categoryIcons[service.category]} {service.category}
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{service.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {service.totalRatings > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(service.avgRating)} size="sm" />
                    <span className="text-sm text-slate-500">{service.avgRating} ({service.totalRatings} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-slate-500">
                  <Shield className="w-4 h-4 text-emerald-500" /><span className="text-sm">Verified Provider</span>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">About this Service</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Reviews ({ratings.length})</h3>
              {ratings.length === 0 ? <p className="text-slate-500">No reviews yet.</p> : (
                <div className="space-y-4">
                  {ratings.map((r) => (
                    <div key={r._id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{r.userId?.name?.charAt(0) || 'U'}</span>
                          </div>
                          <div><p className="text-sm font-medium text-slate-800">{r.userId?.name}</p><StarRating rating={r.rating} size="sm" /></div>
                        </div>
                        <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      {r.review && <p className="text-sm text-slate-600 mt-2">{r.review}</p>}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="card p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-center gap-1 mb-1">
                  <IndianRupee className="w-6 h-6 text-primary-600" />
                  <span className="text-3xl font-bold text-primary-600">{service.price?.toLocaleString()}</span>
                </div>
                <span className="text-sm text-slate-500">{service.priceUnit === 'per_hour' ? 'per hour' : 'fixed price'}</span>
              </div>
              <div className="space-y-3 mb-6">
                {['Instant booking confirmation', 'Free cancellation up to 24hrs', 'Satisfaction guaranteed'].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><span className="text-sm">{t}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleBook} className="btn-primary w-full flex items-center justify-center gap-2 !py-4 text-lg">
                <Calendar className="w-5 h-5" /> Book Now
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card p-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Service Provider</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{service.providerId?.name?.charAt(0)}</span>
                </div>
                <div><p className="font-semibold text-slate-800">{service.providerId?.name}</p><p className="text-sm text-slate-500 capitalize">{service.category} Expert</p></div>
              </div>
              {service.providerId?.bio && <p className="text-sm text-slate-600 mb-4">{service.providerId.bio}</p>}
              <div className="space-y-2">
                {service.providerId?.location && <div className="flex items-center gap-2 text-sm text-slate-500"><MapPin className="w-4 h-4" />{service.providerId.location}</div>}
                {service.providerId?.phone && <div className="flex items-center gap-2 text-sm text-slate-500"><Phone className="w-4 h-4" />{service.providerId.phone}</div>}
              </div>
              {typeof service.providerId?.lat === 'number' && typeof service.providerId?.lng === 'number' ? (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Provider location</h3>
                  <MapView
                    markers={[
                      {
                        id: 'provider',
                        label: 'Provider',
                        lat: service.providerId.lat,
                        lng: service.providerId.lng,
                        color: '#2563eb'
                      },
                      user?.lat && user?.lng && {
                        id: 'customer',
                        label: 'You',
                        lat: user.lat,
                        lng: user.lng,
                        color: '#059669'
                      }
                    ].filter(Boolean)}
                    center={{ lat: service.providerId.lat, lng: service.providerId.lng }}
                    zoom={11}
                  />
                </div>
              ) : (
                <p className="mt-6 text-sm text-slate-500">Provider location coordinates are not available.</p>
              )}
              {user && user.role === 'customer' && (
                <button onClick={() => navigate(`/chat?to=${service.providerId._id}`)}
                  className="btn-secondary w-full mt-4 flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Message Provider
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
