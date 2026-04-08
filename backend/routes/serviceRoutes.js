const express = require('express');
const router = express.Router();
const {
  createService, getServices, getService,
  updateService, deleteService, getMyServices
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getServices);
router.get('/my/services', protect, authorize('provider'), getMyServices);
router.get('/:id', getService);
router.post('/', protect, authorize('provider'), createService);
router.put('/:id', protect, authorize('provider'), updateService);
router.delete('/:id', protect, authorize('provider'), deleteService);

module.exports = router;
