import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, IndianRupee, Star, CreditCard, MessageSquare, Loader } from 'lucide-react';
import { getMyBookings, getBookingStats, updateBookingStatus, getRecommendations } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RatingModal from '../components/RatingModal';
import PaymentModal from '../components/PaymentModal';
import ServiceCard from '../components/ServiceCard';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { color: 'status-pending', icon: Clock, label: 'Pending' },
  confirmed: { color: 'status-confirmed', icon: CheckCircle, label: 'Confirmed' },
  in_progress: { color: 'status-in_progress', icon: Loader, label: 'In Progress' },
  completed: { color: 'status-completed', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: 'status-cancelled', icon: XCircle, label: 'Cancelled' },
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [ratingBooking, setRatingBooking] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);

  useEffect(() => { loadData(); }, [filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bRes, sRes, rRes] = await Promise.all([
        getMyBookings({ status: filter }), getBookingStats(),
        getRecommendations().catch(() => ({ data: [] }))
      ]);
      setBookings(bRes.data); setStats(sRes.data); setRecommendations(rRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try { await updateBookingStatus(id, 'cancelled'); toast.success('Cancelled'); loadData(); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-slate-500 mt-1">Here's your bookings overview</p>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-primary-600', bg: 'bg-primary-50' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Total Spent', value: `₹${stats.totalEarnings?.toLocaleString()}`, icon: IndianRupee, color: 'text-primary-600', bg: 'bg-primary-50' },
            ].map((s, i) => (
              <div key={i} className="card p-4">
                <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`chip ${filter === f ? 'chip-active' : 'chip-inactive'}`}>
              {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="card p-6 h-28 skeleton" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No bookings yet</h3>
            <p className="text-slate-500 mb-6">Start exploring and book your first service!</p>
            <button onClick={() => navigate('/services')} className="btn-primary">Browse Services</button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => {
              const cfg = statusConfig[b.status];
              const Icon = cfg.icon;
              return (
                <motion.div key={b._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }} className="card p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-3xl shrink-0">
                      {b.serviceId?.category === 'electrician' ? '⚡' : b.serviceId?.category === 'plumber' ? '🔧' : b.serviceId?.category === 'tutor' ? '📚' : '🚚'}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{b.serviceId?.title}</h3>
                          <p className="text-sm text-slate-500">by {b.providerId?.name}</p>
                        </div>
                        <span className={`status-badge ${cfg.color} flex items-center gap-1`}><Icon className="w-3 h-3" />{cfg.label}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(b.scheduledDate).toLocaleDateString('en-IN')}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{b.timeSlot}</span>
                        <span className="flex items-center gap-1 text-primary-600 font-semibold"><IndianRupee className="w-4 h-4" />{b.totalAmount?.toLocaleString()}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {b.status === 'pending' && (
                          <button onClick={() => handleCancel(b._id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                        )}
                        {b.status === 'completed' && !b.isPaid && (
                          <button onClick={() => setPaymentBooking(b)}
                            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> Pay Now
                          </button>
                        )}
                        {b.status === 'completed' && (
                          <button onClick={() => setRatingBooking(b)}
                            className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 flex items-center gap-1">
                            <Star className="w-3 h-3" /> Rate
                          </button>
                        )}
                        <button onClick={() => navigate(`/chat?to=${b.providerId?._id}`)}
                          className="px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Recommended <span className="gradient-text">For You</span></h2>
            <p className="text-slate-500 mb-6">Based on your booking history</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((s, i) => <ServiceCard key={s._id} service={s} index={i} />)}
            </div>
          </motion.div>
        )}
      </div>

      {ratingBooking && <RatingModal booking={ratingBooking} onClose={() => setRatingBooking(null)} onRated={loadData} />}
      {paymentBooking && <PaymentModal booking={paymentBooking} onClose={() => setPaymentBooking(null)} onPaid={loadData} />}
    </div>
  );
}
