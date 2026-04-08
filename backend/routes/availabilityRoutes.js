const express = require('express');
const router = express.Router();
const {
  toggleAvailability,
  getAvailableProviders,
  getEmergencyProviders
} = require('../controllers/availabilityController');
const { protect, authorize } = require('../middleware/auth');

router.put('/toggle', protect, authorize('provider'), toggleAvailability);
router.get('/providers', getAvailableProviders);
router.get('/emergency-providers', getEmergencyProviders);

module.exports = router;
