const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const { analyzeServiceNeed } = require('../utils/serviceAssistant');

// @desc    Suggest a service category from a free-text need
// @route   POST /api/recommend/assistant
router.post('/assistant', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Please describe what service you need.' });
    }

    const services = await Service.find({ isActive: true })
      .populate('providerId', 'name avatar location lat lng')
      .sort({ avgRating: -1, totalRatings: -1 });

    const result = analyzeServiceNeed(services, message.trim());
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get recommended services based on user's booking history
// @route   GET /api/recommend
router.get('/', protect, async (req, res) => {
  try {
    // Get user's past bookings to find preferred categories
    const pastBookings = await Booking.find({ userId: req.user._id })
      .populate('serviceId', 'category');

    const bookedCategories = [...new Set(
      pastBookings
        .filter(b => b.serviceId)
        .map(b => b.serviceId.category)
    )];

    const bookedServiceIds = pastBookings
      .filter(b => b.serviceId)
      .map(b => b.serviceId._id);

    let recommended;

    if (bookedCategories.length > 0) {
      // Recommend services from same categories the user has booked before
      // but exclude already booked services
      recommended = await Service.find({
        category: { $in: bookedCategories },
        _id: { $nin: bookedServiceIds },
        isActive: true
      })
        .populate('providerId', 'name avatar location lat lng')
        .sort({ avgRating: -1 })
        .limit(6);
    }

    // If not enough recommendations, fill with top-rated services
    if (!recommended || recommended.length < 6) {
      const existing = recommended ? recommended.map(r => r._id) : [];
      const topRated = await Service.find({
        _id: { $nin: [...bookedServiceIds, ...existing] },
        isActive: true
      })
        .populate('providerId', 'name avatar location lat lng')
        .sort({ avgRating: -1, totalRatings: -1 })
        .limit(6 - (recommended ? recommended.length : 0));

      recommended = recommended ? [...recommended, ...topRated] : topRated;
    }

    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
