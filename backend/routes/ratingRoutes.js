const express = require('express');
const router = express.Router();
const {
  createRating, getServiceRatings, getProviderRatings, checkRating
} = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRating);
router.get('/service/:serviceId', getServiceRatings);
router.get('/provider/:providerId', getProviderRatings);
router.get('/check/:bookingId', protect, checkRating);

module.exports = router;
