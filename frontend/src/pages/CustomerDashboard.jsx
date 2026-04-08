import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  IndianRupee,
  Loader,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getBookingStats,
  getMyBookings,
  getRecommendations,
  updateBookingStatus,
} from '../api';
import BookingLiveMap from '../components/BookingLiveMap';
import BookingTimeline from '../components/BookingTimeline';
import PaymentModal from '../components/PaymentModal';
import RatingModal from '../components/RatingModal';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import useLiveBookingLocation, { applyBookingLocationUpdate } from '../hooks/useLiveBookingLocation';
import { getBookingRealtimeMessage } from '../utils/bookingTimeline';
import { formatStatusLabel, getServiceMeta } from '../utils/serviceMeta';

const statusConfig = {
  pending: { color: 'status-pending', icon: Clock, label: 'Pending' },
  confirmed: { color: 'status-confirmed', icon: CheckCircle2, label: 'Confirmed' },
  in_progress: { color: 'status-in_progress', icon: Loader, label: 'In Progress' },
  completed: { color: 'status-completed', icon: CheckCircle2, label: 'Completed' },
  cancelled: { color: 'status-cancelled', icon: XCircle, label: 'Cancelled' },
};

const emptyRecommendations = {
  items: [],
  basis: 'popular',
  basisLabel: 'Popular on Fixify',
  basisDescription: '',
  userLocation: '',
  matchedCount: 0,
  bookedCategories: [],
};

function normalizeRecommendationPayload(payload) {
  if (Array.isArray(payload)) {
    return {
      ...emptyRecommendations,
      items: payload,
      basis: 'activity',
      basisLabel: 'Based on your activity',
      basisDescription: 'These suggestions are using the older recommendation response format.',
    };
  }

  return {
    ...emptyRecommendations,
    ...(payload || {}),
    items: payload?.items || [],
  };
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState(emptyRecommendations);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [ratingBooking, setRatingBooking] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);

  const handleLocationPatch = useCallback((payload) => {
    setBookings((current) => applyBookingLocationUpdate(current, payload));
  }, []);

  const {
    hasTrackableBookings,
    isSharing: isSharingLocation,
    locationError,
  } = useLiveBookingLocation({
    bookings,
    role: 'customer',
    socket,
    onLocationPatch: handleLocationPatch,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [bookingResponse, statsResponse, recommendationsResponse] = await Promise.all([
          getMyBookings({ status: filter }),
          getBookingStats(),
          getRecommendations().catch(() => ({ data: [] })),
        ]);

        setBookings(bookingResponse.data);
        setStats(statsResponse.data);
        setRecommendations(normalizeRecommendationPayload(recommendationsResponse.data));
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
      const [bookingResponse, statsResponse, recommendationsResponse] = await Promise.all([
        getMyBookings({ status: filter }),
        getBookingStats(),
        getRecommendations().catch(() => ({ data: [] })),
      ]);

      setBookings(bookingResponse.data);
      setStats(statsResponse.data);
      setRecommendations(normalizeRecommendationPayload(recommendationsResponse.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!socket) return undefined;

    const handleBookingNotification = (booking) => {
      toast.success(getBookingRealtimeMessage(booking?.status, 'customer'));
      refreshData();
    };

    socket.on('bookingNotification', handleBookingNotification);
    return () => {
      socket.off('bookingNotification', handleBookingNotification);
    };
  }, [socket, filter]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;

    try {
      const { data } = await updateBookingStatus(id, 'cancelled');
      if (socket && data?.providerId?._id) {
        socket.emit('bookingUpdate', {
          targetUserId: data.providerId._id,
          booking: data,
        });
      }
      toast.success('Booking cancelled');
      refreshData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return (
    <div className="pb-16 pt-28">
      <div className="section-shell">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated overflow-hidden">
          <div className="grid gap-8 bg-[radial-gradient(circle_at_top_right,rgba(52,113,245,0.18),transparent_30%)] p-8 lg:grid-cols-[1fr_360px] lg:p-10">
            <div>
              <span className="eyebrow">Customer dashboard</span>
              <h1 className="mt-5 font-display text-4xl font-semibold text-ink-900">
                Welcome back, <span className="gradient-text">{user?.name}</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                This version of the dashboard keeps bookings, payment actions, and trusted recommendations visible in one place.
              </p>
            </div>

            <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-soft-lg">
              <p className="text-sm text-slate-300">Design principle</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">Trust stays visible after booking too</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                The same clarity from discovery carries into booking history, payments, and provider communication.
              </p>
            </div>
          </div>
        </motion.div>

        {stats ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: 'Total bookings', value: stats.totalBookings, icon: Calendar },
              { label: 'Pending', value: stats.pending, icon: Clock },
              { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle2 },
              { label: 'Completed', value: stats.completed, icon: ShieldCheck },
              { label: 'Total spent', value: stats.totalEarnings?.toLocaleString(), icon: IndianRupee, prefix: 'Rs ' },
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
          {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`chip ${filter === status ? 'chip-active' : 'chip-inactive'}`}
            >
              {status === 'all' ? 'All bookings' : formatStatusLabel(status)}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="skeleton h-36" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="card-elevated px-8 py-16 text-center">
              <div className="mx-auto inline-flex rounded-[28px] bg-primary-50 p-5 text-primary-700">
                <Calendar className="h-8 w-8" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold text-ink-900">No bookings yet</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600">
                When you book a service, the status, payment, and provider actions will appear here.
              </p>
              <button onClick={() => navigate('/services')} className="btn-primary mt-6">
                Browse services
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking, index) => {
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
                          <p className="mt-2 text-sm text-slate-500">Provider: {booking.providerId?.name}</p>

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

                          <BookingTimeline status={booking.status} />
                          <BookingLiveMap
                            booking={booking}
                            role="customer"
                            isSharing={isSharingLocation}
                            locationError={locationError}
                            hasTrackableBookings={hasTrackableBookings}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 xl:max-w-[280px] xl:justify-end">
                        {booking.status === 'pending' ? (
                          <button onClick={() => handleCancel(booking._id)} className="btn-secondary">
                            Cancel booking
                          </button>
                        ) : null}

                        {booking.status === 'completed' && !booking.isPaid ? (
                          <button
                            onClick={() => setPaymentBooking(booking)}
                            className="btn-primary inline-flex items-center justify-center gap-2"
                          >
                            <CreditCard className="h-4 w-4" />
                            Pay now
                          </button>
                        ) : null}

                        {booking.status === 'completed' ? (
                          <button
                            onClick={() => setRatingBooking(booking)}
                            className="btn-secondary inline-flex items-center justify-center gap-2"
                          >
                            <Star className="h-4 w-4" />
                            Rate service
                          </button>
                        ) : null}

                        <button
                          onClick={() => navigate(`/chat?to=${booking.providerId?._id}`)}
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

        {recommendations.items.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="eyebrow">Recommended for you</span>
                <h2 className="mt-5 font-display text-4xl font-semibold text-ink-900">Services matched to where you are</h2>
                <p className="mt-3 max-w-2xl text-slate-600">
                  {recommendations.basisDescription ||
                    'Suggestions stay in the same card system so the experience feels consistent across discovery and post-booking.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-[#eadfc8] bg-white/95 px-4 py-2 text-sm font-medium text-slate-600">
                  {recommendations.basisLabel}
                </div>
                {recommendations.userLocation ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                    <MapPin className="h-4 w-4" />
                    {recommendations.userLocation}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.items.slice(0, 3).map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>

      {ratingBooking ? (
        <RatingModal booking={ratingBooking} onClose={() => setRatingBooking(null)} onRated={refreshData} />
      ) : null}
      {paymentBooking ? (
        <PaymentModal booking={paymentBooking} onClose={() => setPaymentBooking(null)} onPaid={refreshData} />
      ) : null}
    </div>
  );
}
