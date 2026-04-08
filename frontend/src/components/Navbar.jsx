import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  UserCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowProfile(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfile(false);
  };

  const dashboardPath = user?.role === 'provider' ? '/provider-dashboard' : '/dashboard';

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/services', label: 'Services', icon: Search },
  ];

  if (user) {
    navLinks.push({
      to: dashboardPath,
      label: user.role === 'provider' ? 'Dashboard' : 'Bookings',
      icon: user.role === 'provider' ? LayoutDashboard : Calendar,
    });
    navLinks.push({ to: '/chat', label: 'Messages', icon: MessageSquare });
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-4'}`}>
      <div className="section-shell">
        <div
          className={`flex items-center justify-between rounded-full border px-3 py-3 transition-all duration-500 sm:px-4 ${
            scrolled
              ? 'border-[#eadfc8] bg-[rgba(255,253,248,0.96)] shadow-soft-lg backdrop-blur-xl'
              : 'border-[#efe7d6] bg-[rgba(255,253,248,0.88)] shadow-soft backdrop-blur-xl'
          }`}
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f2e4c5] bg-white shadow-soft">
              <img src="/logo.png" alt="Fixify" className="h-9 w-9 rounded-xl object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg font-semibold text-ink-900">Fixify</p>
              <p className="text-xs text-slate-500">Simple local service booking</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 rounded-full border border-[#ece3d2] bg-white/85 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? 'border-accent-200 bg-accent-50 text-accent-700'
                    : 'border-transparent text-slate-600 hover:border-[#efe3cf] hover:bg-[#faf6ed] hover:text-ink-900'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfile((value) => !value)}
                  className="flex items-center gap-3 rounded-full border border-[#eadfc8] bg-white px-3 py-2 text-left shadow-soft transition-all hover:border-primary-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-primary-500 text-sm font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || 'F'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                    <p className="text-xs capitalize text-slate-500">{user.role}</p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      className="absolute right-0 top-full mt-3 w-64 rounded-[28px] border border-[#eadfc8] bg-[rgba(255,253,248,0.98)] p-3 shadow-soft-lg"
                    >
                      <div className="rounded-[24px] border border-primary-100 bg-primary-50/70 px-4 py-4">
                        <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                      </div>
                      <div className="mt-3 space-y-1">
                        <Link
                          to={dashboardPath}
                          className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Open dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
                        >
                          <UserCircle2 className="h-4 w-4" />
                          My profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !px-5 !py-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary !px-6 !py-3">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex rounded-full border border-[#eadfc8] bg-white p-3 text-slate-600 shadow-soft transition-colors hover:text-primary-700 lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 rounded-[28px] border border-[#eadfc8] bg-[rgba(255,253,248,0.98)] p-4 shadow-soft-lg lg:hidden"
            >
              <div className="mb-3 rounded-[22px] border border-primary-100 bg-primary-50/80 px-4 py-3 text-sm text-primary-700">
                Find trusted providers, compare pricing clearly, and book without clutter.
              </div>

              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 rounded-[22px] border px-4 py-3 text-sm font-semibold transition-all ${
                      isActive(link.to)
                        ? 'border-accent-200 bg-accent-50 text-accent-700'
                        : 'border-transparent text-slate-600 hover:bg-primary-50/60 hover:text-primary-700'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>

              {user ? (
                <div className="mt-4 border-t border-[#f0e6d5] pt-4">
                  <div className="mb-3 flex items-center gap-3 rounded-[22px] border border-[#eee4d2] bg-white px-4 py-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-primary-500 text-sm font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'F'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link to="/profile" className="btn-secondary block text-center">
                      View Profile
                    </Link>
                    <button onClick={handleLogout} className="btn-danger w-full">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#f0e6d5] pt-4">
                  <Link to="/login" className="btn-secondary text-center">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-center">
                    Join
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
