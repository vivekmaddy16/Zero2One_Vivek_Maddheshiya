const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 1000
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['electrician', 'plumber', 'tutor', 'delivery', 'cleaning', 'painting', 'carpentry', 'other']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  priceUnit: {
    type: String,
    enum: ['per_hour', 'fixed'],
    default: 'fixed'
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for search and filtering
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ providerId: 1 });

module.exports = mongoose.model('Service', serviceSchema);
