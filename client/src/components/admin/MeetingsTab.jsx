import React, { useEffect, useState } from 'react';
import { 
  getClubMeetings, 
  createMeeting, 
  deleteMeeting 
} from '../api/clubAdminApi';

const MeetingsTab = ({ clubId }) => {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({ 
    agenda: '', 
    date: '', 
    notes: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, [clubId]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await getClubMeetings(clubId);
      setMeetings(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await createMeeting(clubId, form);
      setMeetings([response.data, ...meetings]);
      setForm({ agenda: '', date: '', notes: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (meetingId) => {
    if (!window.confirm('Delete this meeting?')) return;
    try {
      await deleteMeeting(clubId, meetingId);
      setMeetings(meetings.filter(m => m._id !== meetingId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete meeting');
    }
  };

  return (
    <div className="admin-card">
      <div className="tab-header" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          color: 'var(--dark)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            background: 'var(--primary)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem'
          }}>📅</span>
          Meetings Schedule
        </h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form" style={{ marginBottom: '2rem' }}>
        <div className="form-row" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div className="form-group">
            <label className="form-label">Agenda</label>
            <input
              type="text"
              name="agenda"
              value={form.agenda}
              onChange={(e) => setForm({...form, agenda: e.target.value})}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={(e) => setForm({...form, date: e.target.value})}
              className="form-input"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={(e) => setForm({...form, notes: e.target.value})}
            className="form-input"
            rows="3"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Scheduling...' : 'Schedule Meeting'}
        </button>
      </form>

      <div>
        <h3 style={{ 
          fontSize: '1.2rem',
          marginBottom: '1rem',
          color: 'var(--dark)'
        }}>Upcoming Meetings</h3>
        
        {loading && meetings.length === 0 ? (
          <div className="loading-spinner"></div>
        ) : meetings.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No meetings scheduled yet</p>
          </div>
        ) : (
          <ul className="admin-list">
            {meetings.map((meeting) => (
              <li key={meeting._id} className="list-item">
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.3rem' }}>
                    {meeting.agenda}
                  </h4>
                  <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem' }}>
                    {new Date(meeting.date).toLocaleString()}
                  </p>
                  {meeting.notes && (
                    <p style={{ marginTop: '0.5rem', color: 'var(--gray-dark)' }}>
                      {meeting.notes}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(meeting._id)}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MeetingsTab;