const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  getMe,
  updateProfile,
  getUserById
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/user/:id', protect, getUserById);

module.exports = router;
