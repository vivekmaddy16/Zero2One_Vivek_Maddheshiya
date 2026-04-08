import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmergencyModal from './EmergencyModal';

export default function EmergencyButton() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Only show for logged-in customers
  if (!user || user.role !== 'customer') return null;

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setShowModal(true)}
        className="emergency-fab group fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-red-400/30 bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 text-white shadow-[0_8px_32px_-4px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_-4px_rgba(239,68,68,0.65)] active:scale-95"
        id="emergency-button"
        aria-label="Emergency Service"
      >
        <div className="relative">
          <Siren className="h-5 w-5" />
          <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
        </div>
        <span className="text-sm font-bold tracking-wide">SOS</span>
        {/* Pulse ring */}
        <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-red-500/20" style={{ animationDuration: '2s', padding: '6px', margin: '-6px' }} />
      </motion.button>

      <EmergencyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
