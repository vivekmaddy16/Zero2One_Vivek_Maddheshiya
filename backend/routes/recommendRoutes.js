const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const { analyzeServiceNeed } = require('../utils/serviceAssistant');
const { buildLocationRecommendations } = require('../utils/locationRecommendations');

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

// @desc    Get recommended services based on user's location and activity
// @route   GET /api/recommend
router.get('/', protect, async (req, res) => {
  try {
    const pastBookings = await Booking.find({ userId: req.user._id })
      .populate('serviceId', 'category');

    const bookedCategories = [
      ...new Set(
        pastBookings
          .filter((booking) => booking.serviceId)
          .map((booking) => booking.serviceId.category)
      ),
    ];

    const bookedServiceIds = pastBookings
      .filter((booking) => booking.serviceId)
      .map((booking) => booking.serviceId._id);

    const services = await Service.find({ isActive: true })
      .populate('providerId', 'name avatar location lat lng')
      .lean();

    const recommendations = buildLocationRecommendations({
      services,
      user: req.user,
      bookedCategories,
      excludeServiceIds: bookedServiceIds,
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
