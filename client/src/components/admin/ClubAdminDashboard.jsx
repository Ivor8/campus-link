import React, { useState } from 'react';
import { 
  FaUsers, FaUserPlus, FaCalendarAlt, 
  FaEdit, FaTrash, FaCheck, FaTimes, FaBell,
  FaChartLine, FaCog, FaPlus, 
} from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './adminDash.css';

const ClubAdminDashboard = ({ club }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  // Sample data - in a real app this would come from your backend
  const [members, setMembers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@unibamenda.edu', role: 'admin', joinDate: '2023-01-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@unibamenda.edu', role: 'member', joinDate: '2023-02-20' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@unibamenda.edu', role: 'member', joinDate: '2023-03-10' },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: 101, name: 'Diana Prince', email: 'diana@unibamenda.edu', applicationDate: '2023-06-01', reason: 'Interested in tech innovations' },
    { id: 102, name: 'Ethan Hunt', email: 'ethan@unibamenda.edu', applicationDate: '2023-06-05', reason: 'Want to collaborate on projects' },
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: 'Monthly Meeting', date: '2023-06-15', time: '15:00', location: 'CS Lab 3' },
    { id: 2, title: 'Hackathon Planning', date: '2023-06-22', time: '16:00', location: 'Innovation Center' },
  ]);

  const handleApproveRequest = (requestId) => {
    const request = pendingRequests.find(r => r.id === requestId);
    const newMember = {
      id: members.length + 1,
      name: request.name,
      email: request.email,
      role: 'member',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setMembers([...members, newMember]);
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
  };

  const handleDeclineRequest = (requestId) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
  };

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handlePromoteToAdmin = (memberId) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: 'admin' } : m
    ));
  };

  const handleDemoteAdmin = (memberId) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: 'member' } : m
    ));
  };

  const handleAddEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    setShowScheduleModal(false);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>{club.name} Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div>
              <h3>{members.length}</h3>
              <p>Members</p>
            </div>
          </div>
          <div className="stat-card">
            <FaBell className="stat-icon" />
            <div>
              <h3>{pendingRequests.length}</h3>
              <p>Pending Requests</p>
            </div>
          </div>
          <div className="stat-card">
            <FaCalendarAlt className="stat-icon" />
            <div>
              <h3>{events.length}</h3>
              <p>Upcoming Events</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList>
          <Tab><FaUsers /> Members</Tab>
          <Tab><FaUserPlus /> Requests</Tab>
          <Tab><FaCalendarAlt /> Events</Tab>
          <Tab><FaChartLine /> Analytics</Tab>
          <Tab><FaCog /> Settings</Tab>
        </TabList>

        <TabPanel>
          <div className="tab-content">
            <div className="section-header">
              <h2>Manage Members</h2>
              <button 
                className="btn primary"
                onClick={() => setShowAddAdminModal(true)}
              >
                <FaUserPlus /> Add Admin
              </button>
            </div>
            
            <div className="members-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        <span className={`role-badge ${member.role}`}>
                          {member.role}
                        </span>
                      </td>
                      <td>{member.joinDate}</td>
                      <td className="actions">
                        {member.role === 'member' ? (
                          <button 
                            className="btn small success"
                            onClick={() => handlePromoteToAdmin(member.id)}
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button 
                            className="btn small warning"
                            onClick={() => handleDemoteAdmin(member.id)}
                          >
                            Remove Admin
                          </button>
                        )}
                        <button 
                          className="btn small danger"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="tab-content">
            <h2>Pending Membership Requests</h2>
            {pendingRequests.length === 0 ? (
              <div className="empty-state">
                <p>No pending membership requests</p>
              </div>
            ) : (
              <div className="requests-list">
                {pendingRequests.map(request => (
                  <div key={request.id} className="request-card">
                    <div className="request-info">
                      <h3>{request.name}</h3>
                      <p>{request.email}</p>
                      <p className="request-date">Applied on: {request.applicationDate}</p>
                      <div className="request-reason">
                        <strong>Reason:</strong> {request.reason}
                      </div>
                    </div>
                    <div className="request-actions">
                      <button 
                        className="btn success"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button 
                        className="btn danger"
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        <FaTimes /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel>
          <div className="tab-content">
            <div className="section-header">
              <h2>Club Events & Meetings</h2>
              <button 
                className="btn primary"
                onClick={() => setShowScheduleModal(true)}
              >
                <FaPlus /> Schedule Event
              </button>
            </div>
            
            <div className="events-list">
              {events.length === 0 ? (
                <div className="empty-state">
                  <p>No upcoming events scheduled</p>
                </div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-date">
                      <div className="date-day">{new Date(event.date).getDate()}</div>
                      <div className="date-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                    </div>
                    <div className="event-details">
                      <h3>{event.title}</h3>
                      <p><FaCalendarAlt /> {event.date} at {event.time}</p>
                      <p>{event.location}</p>
                    </div>
                    <div className="event-actions">
                      <button className="btn small"><FaEdit /> Edit</button>
                      <button className="btn small danger"><FaTrash /> Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="tab-content">
            <h2>Club Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Member Growth</h3>
                <div className="placeholder-chart">Chart will appear here</div>
              </div>
              <div className="analytics-card">
                <h3>Event Attendance</h3>
                <div className="placeholder-chart">Chart will appear here</div>
              </div>
              <div className="analytics-card">
                <h3>Engagement Metrics</h3>
                <div className="placeholder-chart">Chart will appear here</div>
              </div>
              <div className="analytics-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <p>5 new members joined this week</p>
                    <span className="activity-time">2 days ago</span>
                  </div>
                  <div className="activity-item">
                    <p>Monthly meeting had 85% attendance</p>
                    <span className="activity-time">1 week ago</span>
                  </div>
                  <div className="activity-item">
                    <p>Hackathon announcement got 42 likes</p>
                    <span className="activity-time">2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="tab-content">
            <h2>Club Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Club Name</label>
                <input type="text" value={club.name} readOnly />
              </div>
              <div className="form-group">
                <label>Club Description</label>
                <textarea defaultValue={club.description} rows={4}></textarea>
              </div>
              <div className="form-group">
                <label>Club Categories</label>
                <div className="tags-input">
                  {club.categories.map(category => (
                    <span key={category} className="tag">{category}</span>
                  ))}
                  <input type="text" placeholder="Add new category" />
                </div>
              </div>
              <div className="form-group">
                <label>Membership Approval</label>
                <select>
                  <option>Automatic</option>
                  <option selected>Manual Approval</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="btn primary">Save Changes</button>
                <button className="btn danger">Delete Club</button>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Post</h2>
            <form>
              <div className="form-group">
                <label>Post Content</label>
                <textarea placeholder="What's happening in your club?" rows={6}></textarea>
              </div>
              <div className="form-group">
                <label>Add Image</label>
                <input type="file" accept="image/*" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setShowCreatePostModal(false)}>Cancel</button>
                <button type="submit" className="btn primary">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Event Modal */}
      {showScheduleModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Schedule New Event</h2>
            <EventForm 
              onSubmit={handleAddEvent}
              onCancel={() => setShowScheduleModal(false)}
            />
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Admin</h2>
            <form>
              <div className="form-group">
                <label>Search Members</label>
                <input type="text" placeholder="Search by name or email" />
              </div>
              <div className="search-results">
                {members.filter(m => m.role === 'member').map(member => (
                  <div key={member.id} className="member-result">
                    <div>
                      <h4>{member.name}</h4>
                      <p>{member.email}</p>
                    </div>
                    <button 
                      type="button" 
                      className="btn small success"
                      onClick={() => {
                        handlePromoteToAdmin(member.id);
                        setShowAddAdminModal(false);
                      }}
                    >
                      Make Admin
                    </button>
                  </div>
                ))}
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setShowAddAdminModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Event Form Component
const EventForm = ({ onSubmit, onCancel }) => {
  const [event, setEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Event Title</label>
        <input 
          type="text" 
          name="title" 
          value={event.title} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            name="date" 
            value={event.date} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Time</label>
          <input 
            type="time" 
            name="time" 
            value={event.time} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>
      <div className="form-group">
        <label>Location</label>
        <input 
          type="text" 
          name="location" 
          value={event.location} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea 
          name="description" 
          value={event.description} 
          onChange={handleChange} 
          rows={4}
        ></textarea>
      </div>
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Schedule Event</button>
      </div>
    </form>
  );
};

export default ClubAdminDashboard;