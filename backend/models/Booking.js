const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  customerLat: {
    type: Number,
    default: null
  },
  customerLng: {
    type: Number,
    default: null
  },
  customerLocationUpdatedAt: {
    type: Date,
    default: null
  },
  providerLat: {
    type: Number,
    default: null
  },
  providerLng: {
    type: Number,
    default: null
  },
  providerLocationUpdatedAt: {
    type: Date,
    default: null
  },
  totalAmount: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: '',
    maxlength: 500
  },
  isPaid: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
