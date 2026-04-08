const User = require('../models/User');

// @desc    Toggle provider availability
// @route   PUT /api/availability/toggle
exports.toggleAvailability = async (req, res) => {
  try {
    const { isAvailable, availableIn, acceptsEmergency } = req.body;

    const update = {
      availabilityUpdatedAt: new Date()
    };

    if (typeof isAvailable === 'boolean') update.isAvailable = isAvailable;
    if (availableIn !== undefined) update.availableIn = availableIn;
    if (typeof acceptsEmergency === 'boolean') update.acceptsEmergency = acceptsEmergency;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      update,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get providers with their live availability status
// @route   GET /api/availability/providers
exports.getAvailableProviders = async (req, res) => {
  try {
    const { category } = req.query;

    // Find all providers
    const query = { role: 'provider' };

    const providers = await User.find(query)
      .select('name avatar location lat lng isAvailable availableIn availabilityUpdatedAt acceptsEmergency')
      .sort({ isAvailable: -1, availabilityUpdatedAt: -1 });

    // If category filter is specified, find services in that category
    // and only return providers who offer those services
    if (category) {
      const Service = require('../models/Service');
      const services = await Service.find({ category, isActive: true }).select('providerId');
      const providerIds = services.map(s => s.providerId.toString());
      const filtered = providers.filter(p => providerIds.includes(p._id.toString()));
      return res.json(filtered);
    }

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get emergency-ready providers (available + accepts emergency)
// @route   GET /api/availability/emergency-providers
exports.getEmergencyProviders = async (req, res) => {
  try {
    const { category, lat, lng } = req.query;

    const query = {
      role: 'provider',
      isAvailable: true,
      acceptsEmergency: true
    };

    let providers = await User.find(query)
      .select('name avatar location lat lng isAvailable availableIn acceptsEmergency');

    // If category, filter by service category
    if (category) {
      const Service = require('../models/Service');
      const services = await Service.find({ category, isActive: true }).select('providerId');
      const providerIds = services.map(s => s.providerId.toString());
      providers = providers.filter(p => providerIds.includes(p._id.toString()));
    }

    // Sort by distance if coordinates provided
    if (lat && lng) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
        providers = providers
          .map(p => {
            const pLat = p.lat || 0;
            const pLng = p.lng || 0;
            const distance = Math.sqrt(
              Math.pow(parsedLat - pLat, 2) + Math.pow(parsedLng - pLng, 2)
            );
            return { ...p.toObject(), distance };
          })
          .sort((a, b) => a.distance - b.distance);
      }
    }

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
