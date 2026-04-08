import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Droplets,
  Flame,
  KeyRound,
  Loader,
  MapPin,
  Send,
  X,
  Zap,
  Wrench,
  CheckCircle2,
  Siren,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createEmergencyBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const emergencyTypes = [
  {
    id: 'electrical',
    label: 'Electric Short Circuit',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 border-amber-200 text-amber-800',
    description: 'Sparks, outages, or exposed wiring',
  },
  {
    id: 'plumbing',
    label: 'Water Leakage',
    icon: Droplets,
    color: 'from-cyan-500 to-blue-600',
    bgLight: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    description: 'Burst pipes, flooding, or water damage',
  },
  {
    id: 'lockout',
    label: 'Lockout',
    icon: KeyRound,
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50 border-violet-200 text-violet-800',
    description: 'Locked out of your home or office',
  },
  {
    id: 'gas_leak',
    label: 'Gas Leak',
    icon: Flame,
    color: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50 border-red-200 text-red-800',
    description: 'Gas smell or suspected gas leak',
  },
  {
    id: 'other',
    label: 'Other Emergency',
    icon: Wrench,
    color: 'from-slate-500 to-gray-600',
    bgLight: 'bg-slate-50 border-slate-200 text-slate-800',
    description: 'Any other urgent home emergency',
  },
];

export default function EmergencyModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [step, setStep] = useState('select'); // select | details | finding | success
  const [selectedType, setSelectedType] = useState(null);
  const [address, setAddress] = useState(user?.location || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);

  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error('Please select an emergency type');
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter your address');
      return;
    }

    setSubmitting(true);
    setStep('finding');

    try {
      const { data } = await createEmergencyBooking({
        emergencyType: selectedType,
        address: address.trim(),
        notes,
        customerLat: user?.lat || null,
        customerLng: user?.lng || null,
      });

      setBooking(data);

      // Notify the assigned provider via socket
      if (socket && data?.providerId?._id) {
        socket.emit('bookingUpdate', {
          targetUserId: data.providerId._id,
          booking: data,
        });
      }

      setStep('success');
      toast.success('Emergency request sent! Provider notified.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send emergency request');
      setStep('details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setSelectedType(null);
    setAddress(user?.location || '');
    setNotes('');
    setBooking(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/90 via-slate-950/95 to-slate-950/90 backdrop-blur-md" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-red-900/30 bg-gradient-to-b from-slate-900 to-slate-950 p-7 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2.5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="emergency-icon-pulse relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700">
              <Siren className="h-7 w-7 text-white" />
              <div className="absolute inset-0 animate-ping rounded-2xl bg-red-500/30" style={{ animationDuration: '2s' }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">
                Emergency Mode
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-white">
                Get help instantly
              </h2>
            </div>
          </div>

          {/* Step: Select Emergency Type */}
          {step === 'select' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-7"
            >
              <p className="text-sm text-slate-400">
                Select the type of emergency you're experiencing:
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {emergencyTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`group relative flex items-start gap-4 rounded-[22px] border p-5 text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-red-400/60 bg-red-500/10 ring-2 ring-red-500/30'
                          : 'border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5'
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${type.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className={`font-semibold ${isSelected ? 'text-red-300' : 'text-white'}`}>
                          {type.label}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{type.description}</p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-red-400" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => selectedType && setStep('details')}
                disabled={!selectedType}
                className="btn-emergency mt-6 w-full"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step: Address & Details */}
          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-7"
            >
              <div className="rounded-[22px] border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const selType = emergencyTypes.find((t) => t.id === selectedType);
                    const SelIcon = selType?.icon || AlertTriangle;
                    return (
                      <>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${selType?.color}`}>
                          <SelIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-red-300">{selType?.label}</p>
                          <p className="text-xs text-slate-500">{selType?.description}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <MapPin className="h-4 w-4 text-red-400" />
                  Your address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter the address where help is needed"
                  rows={3}
                  className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 transition-all focus:border-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Additional notes (optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any details that can help the provider"
                  className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 transition-all focus:border-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !address.trim()}
                  className="btn-emergency flex-[2]"
                >
                  <Send className="h-4 w-4" />
                  Send SOS Request
                </button>
              </div>
            </motion.div>
          )}

          {/* Step: Finding Provider */}
          {step === 'finding' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex flex-col items-center py-8"
            >
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-red-500/30 bg-red-500/10">
                  <Loader className="h-10 w-10 animate-spin text-red-400" />
                </div>
                <div className="absolute inset-0 animate-ping rounded-full border border-red-500/20" style={{ animationDuration: '3s' }} />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-white">
                Finding nearest provider...
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Notifying emergency-ready providers near you
              </p>
              <div className="mt-6 flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs text-red-400">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                Emergency priority active
              </div>
            </motion.div>
          )}

          {/* Step: Success */}
          {step === 'success' && booking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-7"
            >
              <div className="flex flex-col items-center rounded-[24px] border border-emerald-500/20 bg-emerald-500/5 p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                  Provider Assigned!
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Help is on the way
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-[18px] border border-white/10 bg-white/3 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Assigned Provider
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {booking.providerId?.name || 'Provider'}
                  </p>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/3 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Service
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {booking.serviceId?.title || 'Emergency Service'}
                  </p>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/3 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
                    <p className="text-sm font-semibold text-red-400">EMERGENCY PRIORITY</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="btn-emergency mt-6 w-full"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
