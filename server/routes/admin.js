import express from 'express';
import {
  getDashboardOverview,
  getClubEvents,
  createEvent,
  getMeetings,
  createMeeting,
  getMembers,
  removeMember,
  getRequests,
  respondToRequest
} from '../controllers/adminController.js';

const router = express.Router();

// Overview
router.get('/overview/:clubId', getDashboardOverview);

// Events
router.get('/events/:clubId', getClubEvents);
router.post('/events', createEvent);

// Meetings
router.get('/meetings/:clubId', getMeetings);
router.post('/meetings', createMeeting);

// Members
router.get('/members/:clubId', getMembers);
router.delete('/members/:memberId', removeMember);

// Join Requests
router.get('/requests/:clubId', getRequests);
router.post('/requests/respond', respondToRequest);

export default router;
