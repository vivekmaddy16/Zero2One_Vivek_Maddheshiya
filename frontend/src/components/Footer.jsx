import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

/* ── Branded SVG social icons ── */
const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const socialLinks = [
  { icon: XIcon, href: '#', label: 'X (Twitter)', hoverColor: 'hover:bg-black hover:text-white hover:border-black' },
  { icon: InstagramIcon, href: '#', label: 'Instagram', hoverColor: 'hover:bg-gradient-to-br hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-[#ee2a7b]' },
  { icon: GitHubIcon, href: '#', label: 'GitHub', hoverColor: 'hover:bg-[#24292f] hover:text-white hover:border-[#24292f]' },
  { icon: LinkedInIcon, href: '#', label: 'LinkedIn', hoverColor: 'hover:bg-[#0a66c2] hover:text-white hover:border-[#0a66c2]' },
];

const footerLinks = {
  quickLinks: [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Sign In', to: '/login' },
    { label: 'Register', to: '/register' },
  ],
  services: [
    { label: 'Appliance Repair', to: '/services?category=appliance-repair' },
    { label: 'Home Cleaning', to: '/services?category=cleaning' },
    { label: 'Tutoring', to: '/services?category=tutoring' },
    { label: 'Delivery', to: '/services?category=delivery' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Cookie Policy', to: '#' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#e0d1b5] to-transparent" />

      {/* Main footer content */}
      <div className="relative bg-gradient-to-b from-[#fffbf3] to-[#fff7eb]">
        {/* Subtle decorative radials */}
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_10%_80%,rgba(245,158,11,0.06),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(47,155,89,0.05),transparent_25%)]" />

        <div className="section-shell relative z-10 pb-8 pt-14">
          {/* Top section — Grid of columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f2e4c5] bg-white shadow-soft">
                  <img
                    src="/logo.png"
                    alt="Fixify"
                    className="h-9 w-9 rounded-xl object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-ink-900">
                    Fixify
                  </p>
                  <p className="text-xs text-slate-500">
                    Simple local service booking
                  </p>
                </div>
              </Link>

              <p className="mt-5 max-w-xs text-sm leading-7 text-slate-500">
                Connecting customers with trusted local service providers
                through a clean, calm booking experience — no clutter, no
                confusion.
              </p>

              {/* Social links */}
              <div className="mt-6 flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfc8] bg-white/90 text-slate-500 shadow-[0_2px_8px_-4px_rgba(120,87,29,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg ${social.hoverColor}`}
                  >
                    <social.icon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Quick Links
              </h3>
              <ul className="mt-5 space-y-3">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Popular Services
              </h3>
              <ul className="mt-5 space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Get in Touch
              </h3>
              <ul className="mt-5 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex rounded-xl border border-primary-100 bg-primary-50 p-2 text-primary-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email us</p>
                    <a
                      href="mailto:support@fixify.app"
                      className="text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
                    >
                      support@fixify.app
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex rounded-xl border border-accent-100 bg-accent-50 p-2 text-accent-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Call us</p>
                    <a
                      href="tel:+911234567890"
                      className="text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
                    >
                      +91 (123) 456-7890
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex rounded-xl border border-[#edddc5] bg-[#fdf6ec] p-2 text-amber-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-sm font-medium text-slate-600">
                      Serving communities everywhere
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter mini-CTA */}
          <div className="mt-12 rounded-[28px] border border-[#eee4d2] bg-white/80 p-6 backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold text-ink-900">
                  Stay updated with Fixify
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Get tips, new services, and platform updates — no spam, ever.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field !rounded-full !py-3 !px-5 min-w-0 sm:w-64"
                />
                <button type="submit" className="btn-primary whitespace-nowrap !px-6 !py-3">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#efe6d5] pt-8 sm:flex-row sm:justify-between">
            <p className="flex items-center gap-1 text-sm text-slate-400">
              © {currentYear} Fixify. Made with
              <Heart className="inline h-3.5 w-3.5 fill-red-400 text-red-400" />
              for local communities.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm text-slate-400 transition-colors hover:text-primary-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
