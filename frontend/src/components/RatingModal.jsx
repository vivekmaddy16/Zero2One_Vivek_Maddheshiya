import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import StarRating from './StarRating';
import { createRating } from '../api';
import toast from 'react-hot-toast';

export default function RatingModal({ booking, onClose, onRated }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    setLoading(true);
    try {
      await createRating({ bookingId: booking._id, rating, review });
      toast.success('Thank you for your rating!');
      onRated?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="card-elevated p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Rate This Service</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="text-center mb-6">
            <p className="text-slate-700 mb-1">{booking.serviceId?.title}</p>
            <p className="text-sm text-slate-400">by {booking.providerId?.name}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center mb-6">
              <StarRating rating={rating} size="lg" interactive onRate={setRating} />
            </div>
            <p className="text-center text-sm text-slate-500 mb-6">
              {rating === 0 && 'Tap a star to rate'}
              {rating === 1 && 'Poor 😞'}{rating === 2 && 'Fair 😐'}{rating === 3 && 'Good 🙂'}
              {rating === 4 && 'Very Good 😊'}{rating === 5 && 'Excellent! 🤩'}
            </p>
            <textarea value={review} onChange={(e) => setReview(e.target.value)}
              placeholder="Write a review (optional)..." rows={3} className="input-field resize-none mb-6" />
            <button type="submit" disabled={loading || rating === 0}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Send className="w-4 h-4" />Submit Rating</>}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
