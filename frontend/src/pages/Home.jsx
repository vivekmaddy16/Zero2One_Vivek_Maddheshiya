import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Droplets,
  Flame,
  KeyRound,
  MessageSquare,
  Search,
  ShieldCheck,
  Siren,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { getServices } from '../api';
import ServiceCard from '../components/ServiceCard';
import ServiceAssistant from '../components/ServiceAssistant';
import EmergencyModal from '../components/EmergencyModal';
import { useAuth } from '../context/AuthContext';
import { SERVICE_CATEGORIES } from '../utils/serviceMeta';

const trustStats = [
  { value: '500+', label: 'Verified providers', icon: ShieldCheck },
  { value: '10K+', label: 'Completed bookings', icon: CheckCircle2 },
  { value: '4.8/5', label: 'Average rating', icon: Star },
  { value: 'Live', label: 'Real-time availability', icon: Zap },
];

const pillars = [
  {
    title: 'Search feels obvious',
    description: 'Start from service categories, clear labels, and simple entry points instead of crowded layouts.',
    icon: Search,
  },
  {
    title: 'Trust stays visible',
    description: 'Provider details, transparent pricing, and ratings remain easy to scan during the full booking flow.',
    icon: ShieldCheck,
  },
  {
    title: 'Coordination stays light',
    description: 'Booking, chat, and service updates stay in one calm flow without making the interface feel heavy.',
    icon: MessageSquare,
  },
];

const steps = [
  {
    title: 'Choose a service',
    description: 'Start with the category or search shortcut that matches the job you need done.',
    icon: Search,
  },
  {
    title: 'Review the listing',
    description: 'Check pricing, provider details, and real-time availability before you commit.',
    icon: ShieldCheck,
  },
  {
    title: 'Book and track',
    description: 'Confirm your slot and keep updates in one place after the booking is made.',
    icon: Calendar,
  },
];

const emergencyUseCases = [
  { icon: Zap, label: 'Electric Short Circuit', color: 'from-amber-500 to-orange-600' },
  { icon: Droplets, label: 'Water Leakage', color: 'from-cyan-500 to-blue-600' },
  { icon: KeyRound, label: 'Lockout', color: 'from-violet-500 to-purple-600' },
  { icon: Flame, label: 'Gas Leak', color: 'from-red-500 to-rose-600' },
];

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const { data } = await getServices({ sort: 'rating' });
        setFeatured(data.slice(0, 6));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <div className="overflow-hidden pb-16">
      <section className="relative pt-32 sm:pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(47,155,89,0.12),transparent_22%),radial-gradient(circle_at_12%_78%,rgba(245,158,11,0.08),transparent_18%)]" />
        <div className="section-shell">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-5xl text-center"
          >
            <span className="eyebrow">Simple service booking for everyday needs</span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-ink-900 sm:text-6xl lg:text-7xl">
              Book trusted local services with a <span className="gradient-text">clean, calm experience</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Fixify helps customers find appliance repair, tutoring, delivery, and home services without visual clutter
              or confusing steps.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/services" className="btn-primary inline-flex items-center justify-center gap-2">
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="btn-secondary inline-flex items-center justify-center gap-2">
                Become a Provider
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {SERVICE_CATEGORIES.slice(0, 6).map((category) => {
                const Icon = category.icon;
                return (
                  <Link key={category.id} to={`/services?category=${category.id}`} className="chip chip-inactive bg-white">
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {trustStats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="card px-5 py-5"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-primary-100 bg-primary-50 p-3 text-primary-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="font-display text-3xl font-semibold text-ink-900">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* âš¡ Emergency Services Section */}
      <section className="section-shell mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[32px] border border-red-900/20 bg-gradient-to-br from-slate-950 via-red-950/40 to-slate-950 p-8 shadow-2xl lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-red-400">
                <Siren className="h-3.5 w-3.5" />
                Emergency Mode
              </div>
              <h2 className="mt-5 font-display text-4xl font-semibold text-white sm:text-5xl">
                Get help in emergencies <span className="text-red-400">instantly</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
                One tap sends an SOS to the nearest available provider. No waiting, no scrolling â€” just instant help when every second matters.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {emergencyUseCases.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-[20px] border border-white/8 bg-white/3 px-5 py-4 transition-all duration-300 hover:border-white/15 hover:bg-white/5"
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-red-500/30 bg-red-500/10">
                <Siren className="h-14 w-14 text-red-400" />
                <div className="absolute inset-0 animate-ping rounded-full border border-red-500/20" style={{ animationDuration: '3s' }} />
              </div>
              {user?.role === 'customer' ? (
                <button
                  onClick={() => setShowEmergency(true)}
                  className="btn-emergency !px-8 !py-4 !text-base"
                  id="emergency-hero-btn"
                >
                  <Siren className="h-5 w-5" />
                  Get Instant Help
                </button>
              ) : (
                <Link
                  to={user ? '/services' : '/login'}
                  className="btn-emergency !px-8 !py-4 !text-base"
                >
                  <Siren className="h-5 w-5" />
                  {user ? 'Browse Services' : 'Sign In for SOS'}
                </Link>
              )}
              <p className="text-xs text-slate-600">Notifies nearest available providers</p>
            </div>
          </div>
        </motion.div>
      </section>

      <ServiceAssistant />

      <section className="section-shell mt-16">
        <div className="card-elevated overflow-hidden p-8 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[28px] border border-[#eee4d2] bg-[#fffdf9] p-6"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-accent-100 bg-accent-50 p-3 text-accent-700">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-ink-900">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Browse categories</span>
            <h2 className="mt-5 font-display text-4xl font-semibold text-ink-900">Explore services in a simpler layout</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Each category card keeps the information light and direct, making discovery feel faster.
            </p>
          </div>
          <Link to="/services" className="btn-secondary inline-flex items-center justify-center gap-2">
            Browse all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICE_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            const descriptions = {
              electrician: 'Wiring, appliance repair, and electrical installations by certified pros.',
              plumber: 'Leak fixes, pipe work, and bathroom fittings â€” fast and reliable.',
              tutor: 'Academic coaching, test prep, and skill-building with verified tutors.',
              delivery: 'Parcel pickup, furniture moves, and same-day local deliveries.',
              cleaning: 'Deep cleaning, sanitization, and routine maintenance for your space.',
              painting: 'Interior, exterior, and decorative finishes by skilled painters.',
              carpentry: 'Custom furniture, repairs, and woodwork by experienced craftsmen.',
            };
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/services?category=${category.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#efe6d5] bg-white/90 shadow-soft backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-primary-200 hover:shadow-soft-lg"
                >
                  {/* Gradient header strip */}
                  <div className={`relative h-24 bg-gradient-to-br ${category.gradient} transition-all duration-500 group-hover:h-28`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  </div>

                  {/* Floating icon */}
                  <div className="relative z-10 -mt-8 ml-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-soft-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <div className={`flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient}`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
                    <h3 className="font-display text-xl font-semibold text-ink-900 transition-colors group-hover:text-primary-700">
                      {category.label}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                      {descriptions[category.id] || 'Compare providers, pricing, and availability without leaving the flow.'}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-all group-hover:gap-3">
                        Explore
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className={`rounded-full border ${category.badge} px-3 py-1 text-[11px] font-semibold`}>
                        Popular
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Top-rated listings</span>
            <h2 className="mt-5 font-display text-4xl font-semibold text-ink-900">Featured services people trust</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              The card layout stays simple while still surfacing the proof people care about before they book.
            </p>
          </div>
          <Link to="/services" className="btn-secondary inline-flex items-center justify-center gap-2">
            View all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card overflow-hidden">
                  <div className="skeleton h-56" />
                  <div className="space-y-3 p-5">
                    <div className="skeleton h-6 w-2/3" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-5/6" />
                  </div>
                </div>
              ))
            : featured.map((service, index) => <ServiceCard key={service._id} service={service} index={index} />)}
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="card-elevated overflow-hidden p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="mt-5 font-display text-4xl font-semibold text-ink-900">A booking flow that stays simple from start to finish</h2>
            </div>
            <div className="rounded-full border border-[#e8dcc4] bg-[#fffaf2] px-4 py-2 text-sm font-medium text-slate-600">
              Designed for clarity, not noise
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[28px] border border-[#eee4d2] bg-[#fffdf9] p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex rounded-2xl border border-primary-100 bg-primary-50 p-3 text-primary-700">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Step {index + 1}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-ink-900">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="card-elevated overflow-hidden p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="eyebrow">Ready to browse</span>
              <h2 className="mt-5 font-display text-4xl font-semibold text-ink-900">Choose a service and move through the product with less friction.</h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                This lighter direction keeps discovery, booking, messaging, and profile details easy to understand.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/services" className="btn-primary inline-flex items-center justify-center gap-2">
                Start browsing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="btn-secondary inline-flex items-center justify-center gap-2">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EmergencyModal isOpen={showEmergency} onClose={() => setShowEmergency(false)} />
    </div>
  );
}
