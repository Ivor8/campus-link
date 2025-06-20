// routes/UserRoute.js

const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route to get logged-in user's profile
router.get('/profile', authController.protect, userController.getProfile);

module.exports = router;
