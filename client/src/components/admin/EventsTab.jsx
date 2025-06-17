import React, { useEffect, useState } from 'react';
import { 
  getClubEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../api/clubAdminApi';

const EventsTab = ({ clubId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    location: '',
    image: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [clubId]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getClubEvents(clubId);
      setEvents(response.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await createEvent(clubId, newEvent);
      setEvents([...events, response.data]);
      setNewEvent({ title: '', description: '', date: '', location: '', image: '' });
      setIsCreating(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(clubId, eventId);
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete event');
    }
  };

  return (
    <div className="admin-card">
      <div className="flex items-center gap-4 mb-8">
        <div className="icon-circle bg-primary">
          🎉
        </div>
        <h2 className="tab-title">
          Events Management
        </h2>
      </div>

      {error && (
        <div className="error-message animate-shake">
          {error}
        </div>
      )}

      {!isCreating ? (
        <button 
          onClick={() => setIsCreating(true)}
          className="btn-create mb-6"
        >
          + Create New Event
        </button>
      ) : (
        <form onSubmit={handleCreate} className="event-form animate-fadeIn">
          <h3 className="form-title">New Event Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label className="form-label">Event Title*</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="form-input"
                placeholder="Annual Tech Conference"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date & Time*</label>
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Location*</label>
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              className="form-input"
              placeholder="University Auditorium"
              required
            />
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Description</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              className="form-input"
              rows={4}
              placeholder="Describe the event details, agenda, and special guests..."
            />
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              value={newEvent.image}
              onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
              className="form-input"
              placeholder="https://example.com/event-image.jpg"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              Create Event
            </button>
            <button 
              type="button" 
              onClick={() => setIsCreating(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="events-section">
        <h3 className="section-title">
          Upcoming Events ({events.length})
        </h3>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : events.length === 0 ? (
          <div className="empty-state animate-pulse">
            <div className="empty-icon">📅</div>
            <p>No upcoming events scheduled</p>
            <button 
              onClick={() => setIsCreating(true)}
              className="btn-primary mt-4"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card animate-fadeIn">
                {event.image && (
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                  </div>
                )}
                <div className="event-content">
                  <div className="event-date">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                    <span className="event-time">
                      {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="event-title">{event.title}</h4>
                  <div className="event-location">
                    📍 {event.location}
                  </div>
                  {event.description && (
                    <p className="event-description">
                      {event.description.length > 100 
                        ? `${event.description.substring(0, 100)}...` 
                        : event.description}
                    </p>
                  )}
                  <div className="event-actions">
                    <button className="btn-edit">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .tab-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--dark);
          margin: 0;
        }
        
        .btn-create {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-create:hover {
          background: var(--secondary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
        }
        
        .event-form {
          background: rgba(248, 249, 250, 0.8);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .form-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--dark);
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--dark);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding-bottom: 0.5rem;
        }
        
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .event-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        
        .event-image {
          height: 160px;
          overflow: hidden;
        }
        
        .event-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .event-card:hover .event-image img {
          transform: scale(1.05);
        }
        
        .event-content {
          padding: 1.5rem;
        }
        
        .event-date {
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .event-time {
          color: var(--gray-dark);
          margin-left: 0.5rem;
        }
        
        .event-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--dark);
        }
        
        .event-location {
          font-size: 0.9rem;
          color: var(--gray-dark);
          margin-bottom: 1rem;
        }
        
        .event-description {
          font-size: 0.9rem;
          color: var(--gray-dark);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        
        .event-actions {
          display: flex;
          gap: 0.75rem;
        }
        
        .btn-edit, .btn-delete {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-edit {
          background: rgba(67, 97, 238, 0.1);
          color: var(--primary);
          border: 1px solid rgba(67, 97, 238, 0.3);
        }
        
        .btn-edit:hover {
          background: rgba(67, 97, 238, 0.2);
        }
        
        .btn-delete {
          background: rgba(247, 37, 133, 0.1);
          color: var(--warning);
          border: 1px solid rgba(247, 37, 133, 0.3);
        }
        
        .btn-delete:hover {
          background: rgba(247, 37, 133, 0.2);
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(248, 249, 250, 0.8);
          border-radius: 12px;
          border: 1px dashed rgba(0, 0, 0, 0.1);
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
          }
          
          .event-form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EventsTab;