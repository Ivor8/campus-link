const Event = require('../models/Event');
const Meeting = require('../models/Meeting');
const Member = require('../models/Member');
const Request = require('../models/Request');
const Club = require('../models/Club');

// Overview
const getClubOverview = async (req, res) => {
  const { clubId } = req.params;
  try {
    const [eventCount, meetingCount, memberCount, requestCount] = await Promise.all([
      Event.countDocuments({ clubId }),
      Meeting.countDocuments({ clubId }),
      Member.countDocuments({ clubId }),
      Request.countDocuments({ clubId, status: 'pending' }),
    ]);
    res.json({ eventCount, meetingCount, memberCount, requestCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
};

// Events
const getEvents = async (req, res) => {
  const { clubId } = req.params;
  try {
    const events = await Event.find({ clubId }).sort({ date: -1 });
    res.json(events);
  } catch {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

const createEvent = async (req, res) => {
  const { clubId } = req.params;
  const { title, description, date, location } = req.body;
  try {
    const newEvent = await Event.create({ clubId, title, description, date, location });
    res.status(201).json(newEvent);
  } catch {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Meetings
const getMeetings = async (req, res) => {
  const { clubId } = req.params;
  try {
    const meetings = await Meeting.find({ clubId }).sort({ date: -1 });
    res.json(meetings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
};

const createMeeting = async (req, res) => {
  const { clubId } = req.params;
  const { agenda, date, notes } = req.body;
  try {
    const meeting = await Meeting.create({ clubId, agenda, date, notes });
    res.status(201).json(meeting);
  } catch {
    res.status(500).json({ error: 'Failed to create meeting' });
  }
};

// Members
const getClubMembers = async (req, res) => {
  const { clubId } = req.params;
  try {
    const members = await Member.find({ clubId }).populate('userId', 'name email');
    res.json(members);
  } catch {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

const removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    await Member.findByIdAndDelete(memberId);
    res.json({ message: 'Member removed' });
  } catch {
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

// Requests
const getJoinRequests = async (req, res) => {
  const { clubId } = req.params;
  try {
    const requests = await Request.find({ clubId, status: 'pending' }).populate('userId', 'name email');
    res.json(requests);
  } catch {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

const approveJoinRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = 'approved';
    await request.save();

    await Member.create({ clubId: request.clubId, userId: request.userId });
    res.json({ message: 'Request approved' });
  } catch {
    res.status(500).json({ error: 'Failed to approve request' });
  }
};

const rejectJoinRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected' });
  } catch {
    res.status(500).json({ error: 'Failed to reject request' });
  }
};


// Update Event
const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date, location } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, description, date, location },
      { new: true }
    );
    res.json(updatedEvent);
  } catch {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    await Event.findByIdAndDelete(eventId);
    res.json({ message: 'Event deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// Update Meeting
const updateMeeting = async (req, res) => {
  const { meetingId } = req.params;
  const { agenda, date, notes } = req.body;
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { agenda, date, notes },
      { new: true }
    );
    res.json(updatedMeeting);
  } catch {
    res.status(500).json({ error: 'Failed to update meeting' });
  }
};

// Delete Meeting
const deleteMeeting = async (req, res) => {
  const { meetingId } = req.params;
  try {
    await Meeting.findByIdAndDelete(meetingId);
    res.json({ message: 'Meeting deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete meeting' });
  }
};


const getCombinedMembers = async (req, res) => {
  const { clubId } = req.params;
  try {
    // Get basic member IDs from Club document
    const club = await Club.findById(clubId).populate('members', '_id name email');
    
    // Get detailed member info from Members collection
    const detailedMembers = await Member.find({ clubId }).populate('userId', 'name email profilePicture');
    
    // Combine the data
    const members = club.members.map(member => {
      const detailedInfo = detailedMembers.find(m => m.userId._id.toString() === member._id.toString());
      return {
        ...member.toObject(),
        ...(detailedInfo?.userId?.toObject() || {}),
        memberId: detailedInfo?._id
      };
    });

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};


// Export all functions
module.exports = {
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
};
