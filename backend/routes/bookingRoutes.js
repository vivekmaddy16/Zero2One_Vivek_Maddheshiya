const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getProviderRequests,
  updateBookingStatus, markAsPaid, getBookingStats, updateBookingLiveLocation
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), createBooking);
router.get('/my', protect, getMyBookings);
router.get('/requests', protect, authorize('provider'), getProviderRequests);
router.get('/stats', protect, getBookingStats);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/location', protect, updateBookingLiveLocation);
router.put('/:id/pay', protect, authorize('customer'), markAsPaid);

module.exports = router;
