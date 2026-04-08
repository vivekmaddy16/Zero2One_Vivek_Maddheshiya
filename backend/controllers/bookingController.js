const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create a booking (Customer only)
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledDate, timeSlot, address, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      serviceId,
      providerId: service.providerId,
      scheduledDate,
      timeSlot,
      address,
      totalAmount: service.price,
      notes
    });

    await booking.populate([
      { path: 'serviceId', select: 'title category price image' },
      { path: 'providerId', select: 'name email avatar' },
      { path: 'userId', select: 'name email avatar' }
    ]);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer's bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { userId: req.user._id };
    if (status && status !== 'all') query.status = status;

    const bookings = await Booking.find(query)
      .populate('serviceId', 'title category price image')
      .populate('providerId', 'name email avatar phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider's booking requests
// @route   GET /api/bookings/requests
exports.getProviderRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { providerId: req.user._id };
    if (status && status !== 'all') query.status = status;

    const bookings = await Booking.find(query)
      .populate('serviceId', 'title category price image')
      .populate('userId', 'name email avatar phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify the user is either the customer or provider of this booking
    const isCustomer = booking.userId.toString() === req.user._id.toString();
    const isProvider = booking.providerId.toString() === req.user._id.toString();

    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Status transition rules
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from '${booking.status}' to '${status}'` 
      });
    }

    booking.status = status;
    await booking.save();

    await booking.populate([
      { path: 'serviceId', select: 'title category price image' },
      { path: 'providerId', select: 'name email avatar' },
      { path: 'userId', select: 'name email avatar' }
    ]);

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark booking as paid (fake payment)
// @route   PUT /api/bookings/:id/pay
exports.markAsPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.isPaid = true;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking stats for dashboard
// @route   GET /api/bookings/stats
exports.getBookingStats = async (req, res) => {
  try {
    const isProvider = req.user.role === 'provider';
    const matchField = isProvider ? 'providerId' : 'userId';

    const stats = await Booking.aggregate([
      { $match: { [matchField]: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const formatted = {
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      totalEarnings: 0,
      totalBookings: 0
    };

    stats.forEach(s => {
      formatted[s._id] = s.count;
      formatted.totalBookings += s.count;
      if (s._id === 'completed') {
        formatted.totalEarnings = s.totalAmount;
      }
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
