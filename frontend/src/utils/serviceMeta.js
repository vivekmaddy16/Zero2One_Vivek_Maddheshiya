import {
  Briefcase,
  GraduationCap,
  Hammer,
  Paintbrush,
  Sparkles,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react';

export const SERVICE_META = {
  electrician: {
    label: 'Electrician',
    icon: Zap,
    gradient: 'from-primary-300 via-primary-400 to-primary-500',
    surface: 'bg-primary-50',
    accent: 'text-primary-700',
    badge: 'border-primary-200 bg-primary-50/90 text-primary-800',
  },
  plumber: {
    label: 'Plumber',
    icon: Wrench,
    gradient: 'from-cyan-300 via-teal-400 to-accent-500',
    surface: 'bg-cyan-50',
    accent: 'text-teal-700',
    badge: 'border-cyan-200 bg-cyan-50/90 text-teal-800',
  },
  tutor: {
    label: 'Tutor',
    icon: GraduationCap,
    gradient: 'from-lime-300 via-accent-400 to-accent-500',
    surface: 'bg-accent-50',
    accent: 'text-accent-700',
    badge: 'border-accent-200 bg-accent-50/90 text-accent-800',
  },
  delivery: {
    label: 'Delivery',
    icon: Truck,
    gradient: 'from-orange-300 via-primary-400 to-primary-500',
    surface: 'bg-orange-50',
    accent: 'text-orange-700',
    badge: 'border-orange-200 bg-orange-50/90 text-orange-800',
  },
  cleaning: {
    label: 'Cleaning',
    icon: Sparkles,
    gradient: 'from-sky-300 via-cyan-400 to-teal-400',
    surface: 'bg-cyan-50',
    accent: 'text-cyan-700',
    badge: 'border-cyan-200 bg-cyan-50/90 text-cyan-800',
  },
  painting: {
    label: 'Painting',
    icon: Paintbrush,
    gradient: 'from-rose-300 via-orange-300 to-primary-400',
    surface: 'bg-rose-50',
    accent: 'text-rose-700',
    badge: 'border-rose-200 bg-rose-50/90 text-rose-800',
  },
  carpentry: {
    label: 'Carpentry',
    icon: Hammer,
    gradient: 'from-yellow-500 via-amber-500 to-orange-400',
    surface: 'bg-yellow-50',
    accent: 'text-yellow-700',
    badge: 'border-yellow-200 bg-yellow-50/90 text-yellow-800',
  },
  other: {
    label: 'General Service',
    icon: Briefcase,
    gradient: 'from-stone-400 via-stone-500 to-amber-600',
    surface: 'bg-stone-100',
    accent: 'text-stone-700',
    badge: 'border-stone-200 bg-stone-100/90 text-stone-800',
  },
};

export const SERVICE_CATEGORIES = Object.entries(SERVICE_META)
  .filter(([key]) => key !== 'other')
  .map(([id, value]) => ({ id, ...value }));

export function getServiceMeta(category) {
  return SERVICE_META[category] || SERVICE_META.other;
}

export function formatPriceUnit(unit) {
  return unit === 'per_hour' ? 'per hour' : 'fixed price';
}

export function formatStatusLabel(status) {
  if (!status) return '';
  return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
