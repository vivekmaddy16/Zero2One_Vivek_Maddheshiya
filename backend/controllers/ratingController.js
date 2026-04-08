const Rating = require('../models/Rating');
const Booking = require('../models/Booking');

// @desc    Create a rating for a completed booking
// @route   POST /api/ratings
exports.createRating = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the customer can rate this booking' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed bookings' });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({ bookingId });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this booking' });
    }

    const newRating = await Rating.create({
      bookingId,
      userId: req.user._id,
      providerId: booking.providerId,
      serviceId: booking.serviceId,
      rating,
      review
    });

    await newRating.populate([
      { path: 'userId', select: 'name avatar' },
      { path: 'serviceId', select: 'title' }
    ]);

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratings for a service
// @route   GET /api/ratings/service/:serviceId
exports.getServiceRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ serviceId: req.params.serviceId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratings for a provider
// @route   GET /api/ratings/provider/:providerId
exports.getProviderRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ providerId: req.params.providerId })
      .populate('userId', 'name avatar')
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if a booking has been rated
// @route   GET /api/ratings/check/:bookingId
exports.checkRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({ bookingId: req.params.bookingId });
    res.json({ rated: !!rating, rating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
