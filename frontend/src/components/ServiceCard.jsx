import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { formatPriceUnit, getServiceMeta } from '../utils/serviceMeta';
import { useSocket } from '../context/SocketContext';

export default function ServiceCard({ service, index = 0 }) {
  const meta = getServiceMeta(service.category);
  const Icon = meta.icon;
  const [imageFailed, setImageFailed] = useState(false);
  const { providerAvailability } = useSocket();

  useEffect(() => {
    setImageFailed(false);
  }, [service._id, service.image]);

  const showImage = Boolean(service.image && !imageFailed);

  // Determine availability status
  const providerId = service.providerId?._id;
  const socketAvail = providerId ? providerAvailability[providerId] : null;
  const isAvailable = socketAvail?.isAvailable ?? service.providerId?.isAvailable ?? false;
  const availableIn = socketAvail?.availableIn ?? service.providerId?.availableIn ?? null;

  const getAvailabilityBadge = () => {
    if (isAvailable && !availableIn) {
      return (
        <span className="availability-badge availability-available">
          <span className="availability-dot-green" />
          Available Now
        </span>
      );
    }
    if (isAvailable && availableIn) {
      return (
        <span className="availability-badge availability-soon">
          <span className="availability-dot-amber" />
          In {availableIn} mins
        </span>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className="h-full"
    >
      <Link to={`/services/${service._id}`} className="group block h-full">
        <article className="card card-hover flex h-full flex-col overflow-hidden">
          <div className="relative h-56 overflow-hidden bg-[#f7efe2]">
            {showImage ? (
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImageFailed(true)}
              />
            ) : null}

            <div
              className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} ${
                showImage ? 'opacity-20 mix-blend-multiply' : ''
              }`}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]" />

            {!showImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-[28px] border border-white/60 bg-white/70 p-6 text-ink-900 backdrop-blur">
                  <Icon className="h-14 w-14" />
                </div>
              </div>
            )}

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-soft ${meta.badge}`}>
                <Icon className="h-3.5 w-3.5" />
                {meta.label}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#eadfc8] bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-accent-600" />
                Verified
              </span>
            </div>

            <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
              {service.totalRatings > 0 && (
                <div className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-semibold text-ink-800 shadow-soft">
                  <Star className="h-3.5 w-3.5 fill-primary-400 text-primary-400" />
                  {service.avgRating}
                </div>
              )}
              {getAvailabilityBadge()}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-ink-900">{service.title}</h3>
                <p className="mt-1 text-sm text-slate-500">by {service.providerId?.name || 'Trusted provider'}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-primary-700">
                  <IndianRupee className="h-4 w-4" />
                  <span className="text-lg font-bold">{service.price?.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{formatPriceUnit(service.priceUnit)}</p>
              </div>
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{service.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-primary-50 px-3 py-2 text-xs font-medium text-primary-700">
                Clear pricing
              </div>
              <div className="rounded-2xl bg-accent-50 px-3 py-2 text-xs font-medium text-accent-700">
                Verified details
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#f0e6d5] pt-4">
              <div className="min-w-0">
                {service.providerId?.location ? (
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="line-clamp-1">{service.providerId.location}</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Local service coverage</p>
                )}
              </div>

              <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                View details
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
