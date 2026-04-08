import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, BookOpen, Truck, ArrowRight, Star,
  Shield, Clock, CheckCircle, Users, Sparkles, ChevronRight
} from 'lucide-react';
import { getServices } from '../api';
import ServiceCard from '../components/ServiceCard';

const categories = [
  { id: 'electrician', name: 'Electrician', icon: Zap, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600', emoji: '⚡' },
  { id: 'plumber', name: 'Plumber', icon: Wrench, color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-600', emoji: '🔧' },
  { id: 'tutor', name: 'Tutor', icon: BookOpen, color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600', emoji: '📚' },
  { id: 'delivery', name: 'Delivery', icon: Truck, color: 'from-violet-400 to-purple-500', bg: 'bg-violet-50', text: 'text-violet-600', emoji: '🚚' },
];

const stats = [
  { number: '10K+', label: 'Happy Customers', icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
  { number: '500+', label: 'Service Providers', icon: Shield, color: 'text-accent-600', bg: 'bg-accent-50' },
  { number: '4.8', label: 'Average Rating', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
  { number: '24/7', label: 'Support Available', icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadFeatured(); }, []);

  const loadFeatured = async () => {
    try {
      const { data } = await getServices({ sort: 'rating' });
      setFeatured(data.slice(0, 6));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
        {/* Subtle Background Decor */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent-100/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-50/50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700">India's #1 Local Service Platform</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
            >
              <span className="text-slate-800">Get It </span>
              <span className="gradient-text">Fixed.</span>
              <br />
              <span className="text-slate-800">Get It </span>
              <span className="gradient-text">Done.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto text-balance"
            >
              Connect with verified local service providers for electricians, plumbers, tutors, delivery & more. 
              Book instantly, pay securely, rate your experience.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/services" className="btn-primary text-lg !px-8 !py-4 flex items-center gap-2 group">
                Browse Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="btn-secondary text-lg !px-8 !py-4">
                Become a Provider
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <div key={i} className="card p-5 text-center card-hover">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{stat.number}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              What do you need <span className="gradient-text">fixed</span>?
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Choose from our wide range of service categories and get matched with top-rated professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/services?category=${cat.id}`} className="block group">
                  <div className="card p-8 text-center card-hover">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.color}
                      flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <span className="text-3xl">{cat.emoji}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                    <div className="mt-3 flex items-center justify-center gap-1 text-sm text-slate-400 group-hover:text-primary-500 transition-colors">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-2">Top Rated <span className="gradient-text">Services</span></h2>
              <p className="text-slate-500">Trusted by thousands of happy customers</p>
            </div>
            <Link to="/services" className="hidden sm:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card overflow-hidden"><div className="h-48 skeleton" /><div className="p-5 space-y-3"><div className="h-5 w-3/4 skeleton" /><div className="h-4 w-full skeleton" /><div className="h-4 w-2/3 skeleton" /></div></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((service, i) => <ServiceCard key={service._id} service={service} index={i} />)}
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link to="/services" className="btn-primary inline-flex items-center gap-2">View All Services <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">How <span className="gradient-text">Fixify</span> Works</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Three simple steps to get your service done</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse & Choose', desc: 'Explore services by category, read reviews, and pick the perfect provider.', icon: '🔍', color: 'from-primary-500 to-primary-600' },
              { step: '02', title: 'Book & Schedule', desc: 'Select your preferred date and time, provide your address, and confirm instantly.', icon: '📅', color: 'from-accent-500 to-accent-600' },
              { step: '03', title: 'Get It Done', desc: 'Your provider arrives on time, completes the job. Pay securely and leave a rating.', icon: '✅', color: 'from-emerald-500 to-emerald-600' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="card p-8 text-center relative overflow-hidden group card-hover">
                <div className="absolute -top-4 -right-4 text-8xl font-black text-slate-100 group-hover:text-primary-50 transition-colors">{item.step}</div>
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500" />
            <div className="relative px-8 py-16 sm:px-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">Join thousands of happy customers and top-rated providers on Fixify.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-xl">Create Free Account</Link>
                <Link to="/services" className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all">Browse Services</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Fixify" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold gradient-text">Fixify</span>
          </div>
          <p className="text-sm text-slate-400">© 2024 Fixify. All rights reserved. Built with ❤️ for local communities.</p>
        </div>
      </footer>
    </div>
  );
}
