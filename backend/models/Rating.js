const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    default: '',
    maxlength: 500
  }
}, {
  timestamps: true
});

// After saving a rating, update the service's average rating
ratingSchema.post('save', async function() {
  const Rating = this.constructor;
  const Service = require('./Service');
  
  const stats = await Rating.aggregate([
    { $match: { serviceId: this.serviceId } },
    { $group: { _id: '$serviceId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  if (stats.length > 0) {
    await Service.findByIdAndUpdate(this.serviceId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      totalRatings: stats[0].count
    });
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
