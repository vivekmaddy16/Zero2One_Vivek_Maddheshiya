import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react';
import { getService, getServiceRatings } from '../api';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { formatPriceUnit, getServiceMeta } from '../utils/serviceMeta';
import { useSocket } from '../context/SocketContext';

const guarantees = [
  'Provider details visible before booking',
  'Transparent pricing in the service summary',
  'Status updates and chat after confirmation',
];

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { providerAvailability } = useSocket();
  const [service, setService] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      try {
        const [serviceResponse, ratingsResponse] = await Promise.all([getService(id), getServiceRatings(id)]);
        setService(serviceResponse.data);
        setRatings(ratingsResponse.data);
        setImageFailed(false);
      } catch (error) {
        toast.error('Service not found');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id, navigate]);

  const handleBook = () => {
    if (!user) {
      toast.error('Please sign in before booking');
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can create bookings');
      return;
    }

    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="pb-16 pt-28">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="skeleton h-[340px]" />
              <div className="skeleton h-10 w-2/3" />
              <div className="skeleton h-5 w-full" />
              <div className="skeleton h-5 w-5/6" />
            </div>
            <div className="skeleton h-[420px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) return null;

  const meta = getServiceMeta(service.category);
  const Icon = meta.icon;
  const showImage = Boolean(service.image && !imageFailed);

  return (
    <div className="pb-16 pt-28">
      <div className="section-shell">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated overflow-hidden">
              <div className="relative h-[320px] overflow-hidden bg-slate-950">
                {showImage ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                  />
                ) : null}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} ${
                    showImage ? 'opacity-40 mix-blend-multiply' : ''
                  }`}
                />
                {!showImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-[32px] border border-white/15 bg-white/12 p-7 text-white backdrop-blur">
                      <Icon className="h-16 w-16" />
                    </div>
                  </div>
                )}
                <div className="absolute left-5 top-5 flex flex-wrap gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${meta.badge}`}>
                    <Icon className="h-4 w-4" />
                    {meta.label}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                    <ShieldCheck className="h-4 w-4" />
                    Verified provider
                  </span>
                </div>
              </div>

              <div className="p-7 sm:p-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <h1 className="font-display text-4xl font-semibold text-ink-900">{service.title}</h1>
                    <p className="mt-3 text-base text-slate-600">
                      Book with clear pricing, ratings, and direct communication built into the flow.
                    </p>
                  </div>

                  <div className="rounded-[28px] bg-primary-50 px-5 py-4">
                    <div className="inline-flex items-center gap-1 text-primary-700">
                      <IndianRupee className="h-5 w-5" />
                      <span className="font-display text-3xl font-semibold">{service.price?.toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-sm text-primary-700">{formatPriceUnit(service.priceUnit)}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] bg-slate-50 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Rating</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <p className="text-lg font-semibold text-ink-900">
                        {service.totalRatings > 0 ? service.avgRating : 'New'}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {service.totalRatings > 0 ? `${service.totalRatings} reviews` : 'No reviews yet'}
                    </p>
                  </div>

                  <div className="rounded-[24px] bg-slate-50 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Booking support</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary-700" />
                      <p className="text-lg font-semibold text-ink-900">Quick scheduling</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Choose a date and time slot in one flow.</p>
                  </div>

                  <div className="rounded-[24px] bg-slate-50 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Trust signal</p>
                    <div className="mt-3 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary-700" />
                      <p className="text-lg font-semibold text-ink-900">Profile transparency</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Provider identity and contact details stay visible.</p>
                  </div>
                </div>

                <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">About this service</h2>
                  <p className="mt-4 text-base leading-8 text-slate-600">{service.description}</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-7">
              <h2 className="font-display text-2xl font-semibold text-ink-900">What makes this listing feel safe to book</h2>
              <div className="mt-5 grid gap-4">
                {guarantees.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[24px] bg-slate-50 px-4 py-4">
                    <div className="rounded-2xl bg-primary-50 p-2 text-primary-700">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Customer reviews</h2>
                  <p className="mt-1 text-sm text-slate-500">{ratings.length} review entries</p>
                </div>
              </div>

              {ratings.length === 0 ? (
                <div className="mt-6 rounded-[28px] bg-slate-50 px-6 py-10 text-center">
                  <p className="font-display text-2xl font-semibold text-ink-900">No reviews yet</p>
                  <p className="mt-2 text-sm text-slate-500">This service is new, so customers have not rated it yet.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {ratings.map((rating) => (
                    <div key={rating._id} className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">
                            {rating.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-ink-900">{rating.userId?.name || 'Customer'}</p>
                            <div className="mt-2">
                              <StarRating rating={rating.rating} size="sm" />
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400">{new Date(rating.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      {rating.review ? <p className="mt-4 text-sm leading-7 text-slate-600">{rating.review}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="card-elevated sticky top-28 p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Booking summary</p>
              <div className="mt-4 rounded-[28px] bg-slate-950 p-6 text-white">
                <p className="text-sm text-slate-300">Starting price</p>
                <div className="mt-2 inline-flex items-center gap-1">
                  <IndianRupee className="h-6 w-6" />
                  <span className="font-display text-4xl font-semibold">{service.price?.toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{formatPriceUnit(service.priceUnit)}</p>
              </div>

              {/* Availability Badge */}
              {(() => {
                const pid = service.providerId?._id;
                const sa = pid ? providerAvailability[pid] : null;
                const avail = sa?.isAvailable ?? service.providerId?.isAvailable ?? false;
                const eta = sa?.availableIn ?? service.providerId?.availableIn ?? null;
                if (avail && !eta) return (
                  <div className="mt-4 flex items-center gap-2.5 rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-3">
                    <span className="availability-dot-green" />
                    <span className="text-sm font-semibold text-emerald-700">Available Now</span>
                  </div>
                );
                if (avail && eta) return (
                  <div className="mt-4 flex items-center gap-2.5 rounded-[20px] border border-amber-200 bg-amber-50 px-5 py-3">
                    <span className="availability-dot-amber" />
                    <span className="text-sm font-semibold text-amber-700">Available in {eta} mins</span>
                  </div>
                );
                return null;
              })()}

              <div className="mt-5 space-y-3">
                {[
                  'Book a time slot in minutes',
                  'Keep provider details visible throughout',
                  'Use in-app chat for quick coordination',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-primary-700" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={handleBook} className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 !py-4 text-base">
                <Calendar className="h-5 w-5" />
                Book this service
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }} className="card p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Provider information</p>
              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-gradient-to-br from-primary-600 to-accent-500 text-lg font-bold text-white">
                  {service.providerId?.name?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink-900">{service.providerId?.name || 'Provider'}</h2>
                  <p className="mt-1 text-sm text-slate-500">{meta.label} specialist</p>
                  {(() => {
                    const pid = service.providerId?._id;
                    const sa = pid ? providerAvailability[pid] : null;
                    const avail = sa?.isAvailable ?? service.providerId?.isAvailable ?? false;
                    const eta = sa?.availableIn ?? service.providerId?.availableIn ?? null;
                    if (avail && !eta) return <span className="mt-2 availability-badge availability-available inline-flex"><span className="availability-dot-green" />Available Now</span>;
                    if (avail && eta) return <span className="mt-2 availability-badge availability-soon inline-flex"><span className="availability-dot-amber" />In {eta} mins</span>;
                    return null;
                  })()}
                </div>
              </div>

              {service.providerId?.bio ? <p className="mt-5 text-sm leading-7 text-slate-600">{service.providerId.bio}</p> : null}

              <div className="mt-5 space-y-3">
                {service.providerId?.location ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {service.providerId.location}
                  </div>
                ) : null}
                {service.providerId?.phone ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {service.providerId.phone}
                  </div>
                ) : null}
              </div>

              {user?.role === 'customer' ? (
                <button
                  onClick={() => navigate(`/chat?to=${service.providerId?._id}`)}
                  className="btn-secondary mt-6 inline-flex w-full items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message provider
                </button>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
