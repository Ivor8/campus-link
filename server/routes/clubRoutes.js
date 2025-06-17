const express = require('express');
const clubController = require('../controllers/clubController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/')
  .post(
    clubController.uploadClubImages,
    clubController.resizeClubImages,
    clubController.createClub
  )
  .get(clubController.getAllClubs);

router.route('/:id')
  .get(clubController.getClubById);

module.exports = router;