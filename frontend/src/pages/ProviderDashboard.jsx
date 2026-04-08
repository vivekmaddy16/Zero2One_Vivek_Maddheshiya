import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, CheckCircle, XCircle, IndianRupee,
  Plus, Edit3, Trash2, Package, TrendingUp, Users,
  Loader, MessageSquare, X
} from 'lucide-react';
import { getProviderRequests, getMyServices, getBookingStats, updateBookingStatus,
  createService, updateService, deleteService } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { color: 'status-pending', icon: Clock, label: 'Pending' },
  confirmed: { color: 'status-confirmed', icon: CheckCircle, label: 'Confirmed' },
  in_progress: { color: 'status-in_progress', icon: Loader, label: 'In Progress' },
  completed: { color: 'status-completed', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: 'status-cancelled', icon: XCircle, label: 'Cancelled' },
};

export default function ProviderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', category: 'electrician', price: '', priceUnit: 'fixed', image: ''
  });

  useEffect(() => { loadData(); }, [filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rRes, sRes, stRes] = await Promise.all([
        getProviderRequests({ status: filter }), getMyServices(), getBookingStats()
      ]);
      setRequests(rRes.data); setServices(sRes.data); setStats(stRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, s) => {
    try { await updateBookingStatus(id, s); toast.success(`Booking ${s}`); loadData(); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) { await updateService(editingService._id, serviceForm); toast.success('Updated'); }
      else { await createService(serviceForm); toast.success('Created'); }
      resetForm(); loadData();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    try { await deleteService(id); toast.success('Deleted'); loadData(); }
    catch { toast.error('Failed to delete'); }
  };

  const editSvc = (s) => {
    setEditingService(s);
    setServiceForm({ title: s.title, description: s.description, category: s.category, price: s.price, priceUnit: s.priceUnit, image: s.image || '' });
    setShowServiceForm(true);
  };

  const resetForm = () => {
    setShowServiceForm(false); setEditingService(null);
    setServiceForm({ title: '', description: '', category: 'electrician', price: '', priceUnit: 'fixed', image: '' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Provider <span className="gradient-text">Dashboard</span></h1>
          <p className="text-slate-500 mt-1">Manage your services and requests</p>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Requests', value: stats.totalBookings, icon: Package, color: 'text-primary-600', bg: 'bg-primary-50' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Active', value: stats.confirmed + stats.in_progress, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Earnings', value: `₹${stats.totalEarnings?.toLocaleString()}`, icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50' },
            ].map((s, i) => (
              <div key={i} className="card p-4">
                <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('requests')}
            className={`chip ${tab === 'requests' ? 'chip-active' : 'chip-inactive'}`}>
            📋 Requests ({requests.length})
          </button>
          <button onClick={() => setTab('services')}
            className={`chip ${tab === 'services' ? 'chip-active' : 'chip-inactive'}`}>
            🛠️ My Services ({services.length})
          </button>
        </div>

        {/* Requests */}
        {tab === 'requests' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'pending', 'confirmed', 'in_progress', 'completed'].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f ? 'bg-primary-100 text-primary-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}>
                  {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </button>
              ))}
            </div>

            {loading ? <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="card p-6 h-28 skeleton" />)}</div>
            : requests.length === 0 ? (
              <div className="card p-12 text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No requests yet</h3>
                <p className="text-slate-500 mt-2">They'll appear when customers book your services.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((b, i) => {
                  const cfg = statusConfig[b.status]; const Icon = cfg.icon;
                  return (
                    <motion.div key={b._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }} className="card p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800">{b.serviceId?.title}</h3>
                              <p className="text-sm text-slate-500">Customer: {b.userId?.name}</p>
                            </div>
                            <span className={`status-badge ${cfg.color} flex items-center gap-1`}><Icon className="w-3 h-3" />{cfg.label}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(b.scheduledDate).toLocaleDateString('en-IN')}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{b.timeSlot}</span>
                            <span className="flex items-center gap-1 text-primary-600 font-semibold"><IndianRupee className="w-4 h-4" />{b.totalAmount?.toLocaleString()}</span>
                          </div>
                          {b.address && <p className="mt-2 text-sm text-slate-400">📍 {b.address}</p>}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {b.status === 'pending' && (<>
                              <button onClick={() => handleStatusUpdate(b._id, 'confirmed')} className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100">✓ Accept</button>
                              <button onClick={() => handleStatusUpdate(b._id, 'cancelled')} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100">✕ Decline</button>
                            </>)}
                            {b.status === 'confirmed' && <button onClick={() => handleStatusUpdate(b._id, 'in_progress')} className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100">🔄 Start Work</button>}
                            {b.status === 'in_progress' && <button onClick={() => handleStatusUpdate(b._id, 'completed')} className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100">✓ Mark Done</button>}
                            <button onClick={() => navigate(`/chat?to=${b.userId?._id}`)} className="px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Chat</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Services */}
        {tab === 'services' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-500">{services.length} services listed</p>
              <button onClick={() => { resetForm(); setShowServiceForm(true); }} className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Service</button>
            </div>

            {showServiceForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetForm}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                  className="card-elevated p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                    <button onClick={resetForm} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div><label className="text-sm text-slate-600 mb-1 block">Title</label>
                      <input type="text" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="input-field" required placeholder="e.g. Home Wiring" /></div>
                    <div><label className="text-sm text-slate-600 mb-1 block">Description</label>
                      <textarea value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="input-field resize-none" rows={3} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm text-slate-600 mb-1 block">Category</label>
                        <select value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} className="input-field">
                          {['electrician','plumber','tutor','delivery','cleaning','painting','carpentry','other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                        </select></div>
                      <div><label className="text-sm text-slate-600 mb-1 block">Price Type</label>
                        <select value={serviceForm.priceUnit} onChange={e => setServiceForm({...serviceForm, priceUnit: e.target.value})} className="input-field">
                          <option value="fixed">Fixed</option><option value="per_hour">Per Hour</option>
                        </select></div>
                    </div>
                    <div><label className="text-sm text-slate-600 mb-1 block">Price (₹)</label>
                      <input type="number" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} className="input-field" required min="0" /></div>
                    <div><label className="text-sm text-slate-600 mb-1 block">Image URL (optional)</label>
                      <input type="url" value={serviceForm.image} onChange={e => setServiceForm({...serviceForm, image: e.target.value})} className="input-field" placeholder="https://..." /></div>
                    <button type="submit" className="btn-primary w-full">{editingService ? 'Update' : 'Create'} Service</button>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {services.length === 0 ? (
              <div className="card p-12 text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No services yet</h3>
                <p className="text-slate-500 mt-2">Create your first listing to get bookings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s, i) => (
                  <motion.div key={s._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} className="card p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-xl shrink-0">
                          {s.category === 'electrician' ? '⚡' : s.category === 'plumber' ? '🔧' : s.category === 'tutor' ? '📚' : '🚚'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{s.title}</h3>
                          <p className="text-sm text-slate-500 capitalize">{s.category}</p>
                          <p className="text-sm text-primary-600 font-semibold mt-1">₹{s.price?.toLocaleString()} / {s.priceUnit === 'per_hour' ? 'hr' : 'fixed'}</p>
                          {s.totalRatings > 0 && <p className="text-xs text-slate-400 mt-1">⭐ {s.avgRating} ({s.totalRatings})</p>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => editSvc(s)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteService(s._id)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
