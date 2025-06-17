// client/src/api/clubAdminApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/clubadmin';

const getAuthHeader = () => {
 const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Events
export const getClubEvents = (clubId) => axios.get(`${API_BASE_URL}/${clubId}/events`, getAuthHeader());
export const createEvent = (clubId, eventData) => axios.post(`${API_BASE_URL}/${clubId}/events`, eventData, getAuthHeader());
export const updateEvent = (clubId, eventId, eventData) => axios.put(`${API_BASE_URL}/${clubId}/events/${eventId}`, eventData, getAuthHeader());
export const deleteEvent = (clubId, eventId) => axios.delete(`${API_BASE_URL}/${clubId}/events/${eventId}`, getAuthHeader());

// Meetings
export const getClubMeetings = (clubId) => axios.get(`${API_BASE_URL}/${clubId}/meetings`, getAuthHeader());
export const createMeeting = (clubId, meetingData) => axios.post(`${API_BASE_URL}/${clubId}/meetings`, meetingData, getAuthHeader());
export const updateMeeting = (clubId, meetingId, meetingData) => axios.put(`${API_BASE_URL}/${clubId}/meetings/${meetingId}`, meetingData, getAuthHeader());
export const deleteMeeting = (clubId, meetingId) => axios.delete(`${API_BASE_URL}/${clubId}/meetings/${meetingId}`, getAuthHeader());

// Members
export const getClubMembers = (clubId) => axios.get(`${API_BASE_URL}/${clubId}/members`, getAuthHeader());
export const removeClubMember = (clubId, memberId) => axios.delete(`${API_BASE_URL}/${clubId}/members/${memberId}`, getAuthHeader());
export const getCombinedMembers = (clubId, memberId) => axios.get(`${API_BASE_URL}/${clubId}/combinedmembers`)
// Requests
export const getJoinRequests = (clubId) => axios.get(`${API_BASE_URL}/${clubId}/requests`, getAuthHeader());
export const approveJoinRequest = (requestId) => axios.post(`${API_BASE_URL}/requests/${requestId}/approve`, {}, getAuthHeader());
export const rejectJoinRequest = (requestId) => axios.post(`${API_BASE_URL}/requests/${requestId}/reject`, {}, getAuthHeader());

// Overview
export const getClubOverview = (clubId) => axios.get(`${API_BASE_URL}/${clubId}/overview`, getAuthHeader());