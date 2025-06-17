const express = require('express');
const router = express.Router();

const {
  getClubOverview,
  getEvents,
  createEvent,
  updateEvent,        // ✅ NEW
  deleteEvent,        // ✅ NEW
  getMeetings,
  createMeeting,
  updateMeeting,      // ✅ NEW
  deleteMeeting,      // ✅ NEW
  getClubMembers,
  removeMember,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  getCombinedMembers
} = require('../controllers/clubAdminController');

// Events routes
router.post('/:clubId/events', createEvent);
router.get('/:clubId/events', getEvents);
router.put('/:clubId/events/:eventId', updateEvent);
router.delete('/:clubId/events/:eventId', deleteEvent);

// Meetings routes
router.post('/:clubId/meetings', createMeeting);
router.get('/:clubId/meetings', getMeetings);
router.put('/:clubId/meetings/:meetingId', updateMeeting);
router.delete('/:clubId/meetings/:meetingId', deleteMeeting);

// Members routes
router.get('/:clubId/members', getClubMembers);
router.get('/:clubId/combinedmembers', getCombinedMembers)

// Join Requests
router.get('/:clubId/requests', getJoinRequests);
router.post('/requests/:requestId/approve', approveJoinRequest);
router.post('/requests/:requestId/reject', rejectJoinRequest);

// Overview
router.get('/:clubId/overview', getClubOverview);

module.exports = router;
