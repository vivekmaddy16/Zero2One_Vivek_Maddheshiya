import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  IndianRupee,
  Loader,
  MessageSquare,
  Package,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  createService,
  deleteService,
  getBookingStats,
  getMyServices,
  getProviderRequests,
  updateBookingStatus,
  updateService,
} from '../api';
import { useAuth } from '../context/AuthContext';
import { formatPriceUnit, formatStatusLabel, getServiceMeta } from '../utils/serviceMeta';

const statusConfig = {
  pending: { color: 'status-pending', icon: Clock, label: 'Pending' },
  confirmed: { color: 'status-confirmed', icon: CheckCircle2, label: 'Confirmed' },
  in_progress: { color: 'status-in_progress', icon: Loader, label: 'In Progress' },
  completed: { color: 'status-completed', icon: CheckCircle2, label: 'Completed' },
  cancelled: { color: 'status-cancelled', icon: XCircle, label: 'Cancelled' },
};

const initialServiceForm = {
  title: '',
  description: '',
  category: 'electrician',
  price: '',
  priceUnit: 'fixed',
  image: '',
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
  const [serviceForm, setServiceForm] = useState(initialServiceForm);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [requestResponse, serviceResponse, statsResponse] = await Promise.all([
          getProviderRequests({ status: filter }),
          getMyServices(),
          getBookingStats(),
        ]);

        setRequests(requestResponse.data);
        setServices(serviceResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filter]);

  const refreshData = async () => {
    try {
      const [requestResponse, serviceResponse, statsResponse] = await Promise.all([
        getProviderRequests({ status: filter }),
        getMyServices(),
        getBookingStats(),
      ]);

      setRequests(requestResponse.data);
      setServices(serviceResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking marked ${formatStatusLabel(status).toLowerCase()}`);
      refreshData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setServiceForm(initialServiceForm);
    setShowServiceForm(false);
  };

  const handleServiceSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingService) {
        await updateService(editingService._id, serviceForm);
        toast.success('Service updated');
      } else {
        await createService(serviceForm);
        toast.success('Service created');
      }

      resetForm();
      refreshData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Delete this service?')) return;

    try {
      await deleteService(id);
      toast.success('Service deleted');
      refreshData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const editService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      priceUnit: service.priceUnit,
      image: service.image || '',
    });
    setShowServiceForm(true);
  };

  return (
    <div className="pb-16 pt-28">
      <div className="section-shell">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated overflow-hidden">
          <div className="grid gap-8 bg-[radial-gradient(circle_at_top_right,rgba(52,113,245,0.18),transparent_28%)] p-8 lg:grid-cols-[1fr_360px] lg:p-10">
            <div>
              <span className="eyebrow">Provider workspace</span>
              <h1 className="mt-5 font-display text-4xl font-semibold text-ink-900">
                Run your Fixify listings with more trust and less clutter.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Manage service requests, update listings, and keep communication clear from one dashboard for {user?.name}.
              </p>
            </div>

            <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-soft-lg">
              <p className="text-sm text-slate-300">Provider goal</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">Clarity builds credibility</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Clean request states, service cards, and quick action buttons help providers feel organized and trustworthy.
              </p>
            </div>
          </div>
        </motion.div>

        {stats ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: 'Total requests', value: stats.totalBookings, icon: Package },
              { label: 'Pending', value: stats.pending, icon: Clock },
              { label: 'Active jobs', value: (stats.confirmed || 0) + (stats.in_progress || 0), icon: Users },
              { label: 'Completed', value: stats.completed, icon: CheckCircle2 },
              { label: 'Earnings', value: stats.totalEarnings?.toLocaleString(), icon: IndianRupee, prefix: 'Rs ' },
            ].map((item) => (
              <div key={item.label} className="card px-5 py-5">
                <div className="mb-4 inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="font-display text-3xl font-semibold text-ink-900">
                  {item.prefix || ''}
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { id: 'requests', label: `Requests (${requests.length})` },
            { id: 'services', label: `My Services (${services.length})` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`chip ${tab === item.id ? 'chip-active' : 'chip-inactive'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'requests' ? (
          <>
            <div className="mt-6 flex flex-wrap gap-3">
              {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`chip ${filter === status ? 'chip-active' : 'chip-inactive'}`}
                >
                  {status === 'all' ? 'All requests' : formatStatusLabel(status)}
                </button>
              ))}
            </div>

            <div className="mt-8">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="skeleton h-40" />
                  ))}
                </div>
              ) : requests.length === 0 ? (
                <div className="card-elevated px-8 py-16 text-center">
                  <div className="mx-auto inline-flex rounded-[28px] bg-primary-50 p-5 text-primary-700">
                    <Package className="h-8 w-8" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-semibold text-ink-900">No requests yet</h2>
                  <p className="mx-auto mt-3 max-w-xl text-slate-600">
                    Once customers start booking your listings, the request flow will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {requests.map((booking, index) => {
                    const config = statusConfig[booking.status];
                    const StatusIcon = config.icon;
                    const meta = getServiceMeta(booking.serviceId?.category);
                    const ServiceIcon = meta.icon;

                    return (
                      <motion.div
                        key={booking._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card-elevated p-6"
                      >
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`inline-flex rounded-[24px] bg-gradient-to-br ${meta.gradient} p-4 text-white shadow-soft`}>
                              <ServiceIcon className="h-6 w-6" />
                            </div>
                            <div className="max-w-3xl">
                              <div className="flex flex-wrap items-center gap-3">
                                <h2 className="font-display text-2xl font-semibold text-ink-900">{booking.serviceId?.title}</h2>
                                <span className={`status-badge ${config.color}`}>
                                  <StatusIcon className={`h-3.5 w-3.5 ${booking.status === 'in_progress' ? 'animate-spin' : ''}`} />
                                  {config.label}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-slate-500">Customer: {booking.userId?.name}</p>

                              <div className="mt-4 flex flex-wrap gap-3">
                                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                  <Calendar className="mr-2 inline h-4 w-4 text-primary-700" />
                                  {new Date(booking.scheduledDate).toLocaleDateString('en-IN')}
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                  <Clock className="mr-2 inline h-4 w-4 text-primary-700" />
                                  {booking.timeSlot}
                                </div>
                                <div className="rounded-2xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700">
                                  Rs {booking.totalAmount?.toLocaleString()}
                                </div>
                              </div>

                              {booking.address ? (
                                <p className="mt-4 text-sm leading-7 text-slate-600">
                                  <span className="font-semibold text-ink-900">Address:</span> {booking.address}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 xl:max-w-[300px] xl:justify-end">
                            {booking.status === 'pending' ? (
                              <>
                                <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="btn-primary">
                                  Accept
                                </button>
                                <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="btn-secondary">
                                  Decline
                                </button>
                              </>
                            ) : null}

                            {booking.status === 'confirmed' ? (
                              <button onClick={() => handleStatusUpdate(booking._id, 'in_progress')} className="btn-primary">
                                Start work
                              </button>
                            ) : null}

                            {booking.status === 'in_progress' ? (
                              <button onClick={() => handleStatusUpdate(booking._id, 'completed')} className="btn-primary">
                                Mark completed
                              </button>
                            ) : null}

                            <button
                              onClick={() => navigate(`/chat?to=${booking.userId?._id}`)}
                              className="btn-secondary inline-flex items-center justify-center gap-2"
                            >
                              <MessageSquare className="h-4 w-4" />
                              Chat
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mt-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Listings</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{services.length} active services</p>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setServiceForm(initialServiceForm);
                  setShowServiceForm(true);
                }}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add service
              </button>
            </div>

            <div className="mt-8">
              {services.length === 0 ? (
                <div className="card-elevated px-8 py-16 text-center">
                  <div className="mx-auto inline-flex rounded-[28px] bg-primary-50 p-5 text-primary-700">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-semibold text-ink-900">No services listed yet</h2>
                  <p className="mx-auto mt-3 max-w-xl text-slate-600">
                    Start with one clear listing. Transparent titles and pricing make the product feel more trustworthy.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {services.map((service, index) => {
                    const meta = getServiceMeta(service.category);
                    const ServiceIcon = meta.icon;

                    return (
                      <motion.div
                        key={service._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card-elevated p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`inline-flex rounded-[24px] bg-gradient-to-br ${meta.gradient} p-4 text-white shadow-soft`}>
                              <ServiceIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <p className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${meta.badge}`}>
                                {meta.label}
                              </p>
                              <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900">{service.title}</h2>
                              <p className="mt-2 text-sm leading-7 text-slate-600">{service.description}</p>
                              <p className="mt-4 text-sm font-semibold text-primary-700">
                                Rs {service.price?.toLocaleString()} · {formatPriceUnit(service.priceUnit)}
                              </p>
                              {service.totalRatings > 0 ? (
                                <p className="mt-2 text-sm text-slate-500">
                                  Rating {service.avgRating} from {service.totalRatings} reviews
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => editService(service)}
                              className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition-colors hover:text-primary-700"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service._id)}
                              className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition-colors hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showServiceForm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={resetForm}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="card-elevated max-h-[90vh] w-full max-w-2xl overflow-y-auto p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Service editor</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">
                  {editingService ? 'Update listing' : 'Create a new listing'}
                </h2>
              </div>
              <button
                onClick={resetForm}
                className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition-colors hover:text-primary-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Service title</label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(event) => setServiceForm({ ...serviceForm, title: event.target.value })}
                  className="input-field"
                  placeholder="Example: Home electrical repair"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Describe the service clearly so customers know what they are booking."
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(event) => setServiceForm({ ...serviceForm, category: event.target.value })}
                    className="input-field"
                  >
                    {['electrician', 'plumber', 'tutor', 'delivery', 'cleaning', 'painting', 'carpentry', 'other'].map((category) => (
                      <option key={category} value={category}>
                        {formatStatusLabel(category)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Price type</label>
                  <select
                    value={serviceForm.priceUnit}
                    onChange={(event) => setServiceForm({ ...serviceForm, priceUnit: event.target.value })}
                    className="input-field"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="per_hour">Per hour</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Price</label>
                  <input
                    type="number"
                    min="0"
                    value={serviceForm.price}
                    onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })}
                    className="input-field"
                    placeholder="Enter your price"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600">Image URL</label>
                  <input
                    type="url"
                    value={serviceForm.image}
                    onChange={(event) => setServiceForm({ ...serviceForm, image: event.target.value })}
                    className="input-field"
                    placeholder="Optional image URL"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                {editingService ? 'Save changes' : 'Create service'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  );
}
