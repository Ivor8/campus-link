const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/clubApplicationController');
const authController = require('../controllers/authController');

// Protect all routes
router.use(authController.protect);

// Application endpoints
router.post('/clubs/:clubId', applicationController.submitApplication);

// Admin-only endpoints
// router.use(authController.restrictTo('admin'));
router.get('/clubs/:clubId', applicationController.getClubApplications);
router.patch('/:applicationId/approve', applicationController.approveApplication);
router.patch('/:applicationId/reject', applicationController.rejectApplication);

module.exports = router;