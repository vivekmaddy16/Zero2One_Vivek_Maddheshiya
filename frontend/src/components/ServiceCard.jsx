import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, IndianRupee } from 'lucide-react';

const categoryColors = {
  electrician: 'from-amber-400 to-orange-500',
  plumber: 'from-blue-400 to-cyan-500',
  tutor: 'from-emerald-400 to-teal-500',
  delivery: 'from-violet-400 to-purple-500',
  cleaning: 'from-pink-400 to-rose-500',
  painting: 'from-lime-400 to-green-500',
  carpentry: 'from-yellow-500 to-amber-600',
  other: 'from-gray-400 to-slate-500',
};

const categoryBg = {
  electrician: 'bg-amber-50 text-amber-700',
  plumber: 'bg-blue-50 text-blue-700',
  tutor: 'bg-emerald-50 text-emerald-700',
  delivery: 'bg-violet-50 text-violet-700',
  cleaning: 'bg-pink-50 text-pink-700',
  painting: 'bg-lime-50 text-lime-700',
  carpentry: 'bg-yellow-50 text-yellow-700',
  other: 'bg-gray-50 text-gray-700',
};

const categoryIcons = {
  electrician: '⚡', plumber: '🔧', tutor: '📚', delivery: '🚚',
  cleaning: '🧹', painting: '🎨', carpentry: '🪚', other: '🛠️',
};

export default function ServiceCard({ service, index = 0 }) {
  const gradient = categoryColors[service.category] || categoryColors.other;
  const badge = categoryBg[service.category] || categoryBg.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/services/${service._id}`} className="block group">
        <div className="card overflow-hidden card-hover">
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-slate-100">
            {service.image ? (
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.className = 'hidden';
                }}
              />
            ) : null}
            <div className={`absolute inset-0 ${!service.image ? `bg-gradient-to-br ${gradient} opacity-90` : 'bg-gradient-to-t from-black/30 via-transparent'}`}>
              {!service.image && (
                <div className="flex items-center justify-center h-full text-6xl">
                  {categoryIcons[service.category]}
                </div>
              )}
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge}`}>
                {categoryIcons[service.category]} {service.category}
              </span>
            </div>

            {/* Rating Badge */}
            {service.totalRatings > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-semibold text-slate-800">{service.avgRating}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-1">
              {service.title}
            </h3>

            <p className="mt-2 text-sm text-slate-500 line-clamp-2">
              {service.description}
            </p>

            {/* Provider & Location */}
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {service.providerId?.name?.charAt(0) || 'P'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {service.providerId?.name || 'Provider'}
                </p>
                {service.providerId?.location && (
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {service.providerId.location}
                  </p>
                )}
              </div>
            </div>

            {/* Price & Rating */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-primary-600" />
                <span className="text-lg font-bold text-primary-600">
                  {service.price?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">
                  /{service.priceUnit === 'per_hour' ? 'hr' : 'fixed'}
                </span>
              </div>

              {service.totalRatings > 0 && (
                <div className="flex items-center gap-1 text-slate-500">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium">{service.avgRating}</span>
                  <span className="text-xs">({service.totalRatings})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
