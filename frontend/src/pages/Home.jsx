import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { getServices } from '../api';
import ServiceCard from '../components/ServiceCard';
import { SERVICE_CATEGORIES } from '../utils/serviceMeta';

const trustStats = [
  { value: '500+', label: 'Verified providers', icon: ShieldCheck },
  { value: '10K+', label: 'Completed bookings', icon: CheckCircle2 },
  { value: '4.8/5', label: 'Average rating', icon: Star },
  { value: '24 hrs', label: 'Fast response windows', icon: Clock },
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
    description: 'Check pricing, provider details, and ratings before you commit.',
    icon: ShieldCheck,
  },
  {
    title: 'Book and track',
    description: 'Confirm your slot and keep updates in one place after the booking is made.',
    icon: Calendar,
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICE_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/services?category=${category.id}`} className="card card-hover flex h-full flex-col p-6">
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br ${category.gradient} p-4 text-white shadow-soft`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-ink-900">{category.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Compare providers, pricing, and availability without leaving the flow.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
                    View providers
                    <ArrowRight className="h-4 w-4" />
                  </span>
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
    </div>
  );
}
