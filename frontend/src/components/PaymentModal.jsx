import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { markBookingPaid } from '../api';

export default function PaymentModal({ booking, onClose, onPaid }) {
  const [step, setStep] = useState('form');
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(async () => {
      try {
        await markBookingPaid(booking._id);
        setStep('success');
        setTimeout(() => { onPaid?.(); onClose(); toast.success('Payment successful!'); }, 1500);
      } catch { setStep('form'); toast.error('Payment failed. Please try again.'); }
    }, 2000);
  };

  const formatCardNumber = (v) => v.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="card-elevated p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>

          {step === 'form' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                  <h3 className="text-xl font-bold text-slate-800">Payment</h3>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                <p className="text-sm text-white/80">Amount to Pay</p>
                <p className="text-3xl font-bold mt-1">₹{booking.totalAmount?.toLocaleString()}</p>
                <p className="text-xs text-white/60 mt-1">{booking.serviceId?.title}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Card Number</label>
                  <input type="text" value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                    placeholder="4242 4242 4242 4242" className="input-field font-mono" required />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Card Holder Name</label>
                  <input type="text" value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    placeholder="John Doe" className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">Expiry</label>
                    <input type="text" value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value.slice(0, 5) })}
                      placeholder="MM/YY" className="input-field" required />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">CVV</label>
                    <input type="password" value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.slice(0, 3) })}
                      placeholder="•••" className="input-field" required />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>This is a simulated payment. No real charges will be made.</span>
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" /> Pay ₹{booking.totalAmount?.toLocaleString()}
                </button>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Processing Payment</h3>
              <p className="text-slate-500">Please wait...</p>
            </div>
          )}

          {step === 'success' && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
              <p className="text-slate-500">Your booking has been paid.</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
