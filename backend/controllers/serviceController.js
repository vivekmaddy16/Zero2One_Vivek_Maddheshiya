const Service = require('../models/Service');

// @desc    Create a service (Provider only)
// @route   POST /api/services
exports.createService = async (req, res) => {
  try {
    const { title, description, category, price, priceUnit, image, tags } = req.body;

    const service = await Service.create({
      title,
      description,
      category,
      price,
      priceUnit,
      image,
      tags,
      providerId: req.user._id
    });

    await service.populate('providerId', 'name email avatar location');
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services (with filters)
// @route   GET /api/services
exports.getServices = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { avgRating: -1 };

    const services = await Service.find(query)
      .populate('providerId', 'name email avatar location')
      .sort(sortObj);

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('providerId', 'name email avatar location phone bio');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service (Provider only - own service)
// @route   PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('providerId', 'name email avatar location');

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider's own services
// @route   GET /api/services/my/services
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user._id })
      .populate('providerId', 'name email avatar location')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
