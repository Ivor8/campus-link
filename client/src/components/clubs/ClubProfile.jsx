import React, { useState } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaHeart, FaComment, FaEllipsisH, FaPlus, FaCalendarAlt, FaUsers, FaInfoCircle, FaRegBookmark, FaShare, FaChevronDown } from 'react-icons/fa';
import { MdGroups, MdEvent, MdNotifications, MdSettings, MdPhotoLibrary } from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';
import './clubs-profile.css'
import { Link } from 'react-router-dom';

const ClubProfile = ({ clubId }) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('posts');
  const [isMember, setIsMember] = useState(true);
  const [showMoreEvents, setShowMoreEvents] = useState(false);

  // Sample club data - in a real app this would come from your backend API
  const clubData = {
    id: clubId,
    name: 'Tech Innovators',
    description: 'A community of technology enthusiasts exploring the latest in software development, AI, and emerging technologies.',
    coverPhoto: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    members: 245,
    isAdmin: true,
    categories: ['Technology', 'Programming', 'Innovation'],
  };

  // Sample posts
  const clubPosts = [
    {
      id: 1,
      content: 'Join us this Friday for our workshop on Web Development with MERN Stack! Bring your laptops and ideas.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      likes: 42,
      comments: 8,
      time: '2h ago',
      isPinned: true
    },
    {
      id: 2,
      content: 'Our coding competition results are out! Congratulations to all participants. Special shoutout to the top 3 winners who demonstrated exceptional problem-solving skills.',
      likes: 28,
      comments: 14,
      time: '1 day ago',
      isPinned: false
    },
  ];

  // Sample events
  const clubEvents = [
    {
      id: 1,
      title: 'MERN Stack Workshop',
      date: '2023-06-15',
      time: '4:00 PM',
      location: 'Computer Lab, Block B',
      description: 'Hands-on workshop covering MongoDB, Express, React, and Node.js',
      attendees: 58
    },
    {
      id: 2,
      title: 'Tech Talk: Future of AI',
      date: '2023-06-22',
      time: '3:00 PM',
      location: 'Auditorium',
      description: 'Guest speaker from Google AI will discuss recent advancements',
      attendees: 120
    },
    {
      id: 3,
      title: 'Hackathon Kickoff',
      date: '2023-07-05',
      time: '10:00 AM',
      location: 'Innovation Center',
      description: 'Annual 48-hour hackathon with great prizes',
      attendees: 89
    },
  ];

  // Sample notifications
  const clubNotifications = [
    {
      id: 1,
      content: 'New member joined: Sarah Johnson',
      time: '30 mins ago',
      isNew: true
    },
    {
      id: 2,
      content: 'Your event "MERN Stack Workshop" has 10 new registrations',
      time: '2 hours ago',
      isNew: true
    },
    {
      id: 3,
      content: 'Monthly club meeting reminder - tomorrow at 3pm',
      time: '1 day ago',
      isNew: false
    },
  ];

  // Sample meetings
  const upcomingMeetings = [
    {
      id: 1,
      title: 'Weekly Coding Session',
      date: 'Tomorrow',
      time: '3:00 PM - 5:00 PM',
      location: 'Computer Lab 3'
    },
    {
      id: 2,
      title: 'Executive Committee Meeting',
      date: 'June 20, 2023',
      time: '2:00 PM - 3:30 PM',
      location: 'Club Office'
    },
  ];

  return (
    <div className="club-profile-container">
      {/* Club Header with Cover Photo */}
      <div className="club-header">
        <div className="cover-photo" style={{ backgroundImage: `url(${clubData.coverPhoto})` }}>
          <div className="club-info-overlay">
            <img src={clubData.logo} alt={clubData.name} className="club-logo" />
            <div className="club-meta">
              <h1>{clubData.name}</h1>
              <p>{clubData.members} members • {clubData.categories.join(', ')}</p>
            </div>
            <div className="club-actions">
              {isMember ? (
                <>
                  <Link className='page-links' to='/messages'>
                   <button className="btn primary">
                    <BiMessageDetail /> Message
                  </button>
                  </Link>
                  <button className="btn secondary">
                    <FaUsers /> Invite
                  </button>
                  {clubData.isAdmin && (
                    <Link to='/admin-dashboard'>
                    <button className="btn admin">
                      <MdSettings /> Manage
                    </button>
                    </Link>
                  )}
                </>
              ) : (
                <button className="btn primary" onClick={() => setIsMember(true)}>
                  <MdGroups /> Join Club
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Club Navigation Tabs */}
      <div className="club-nav">
        <button 
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          <MdEvent /> Events
        </button>
        <button 
          className={activeTab === 'media' ? 'active' : ''}
          onClick={() => setActiveTab('media')}
        >
          <MdPhotoLibrary /> Media
        </button>
        <button 
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          <MdNotifications /> Notifications
        </button>
        <button 
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          <FaInfoCircle /> About
        </button>
      </div>

      <div className="club-content">
        {/* Left Sidebar - About and Quick Info */}
        <div className="club-sidebar">
          <div className="sidebar-section about-section">
            <h3>About</h3>
            <p>{clubData.description}</p>
            <div className="club-stats">
              <div className="stat-item">
                <MdGroups className="stat-icon" />
                <span>{clubData.members} members</span>
              </div>
              <div className="stat-item">
                <MdEvent className="stat-icon" />
                <span>3 upcoming events</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Upcoming Meetings</h3>
            <div className="meetings-list">
              {upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="meeting-item">
                  <div className="meeting-date">
                    <FaCalendarAlt className="calendar-icon" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="meeting-details">
                    <h4>{meeting.title}</h4>
                    <p>{meeting.time}</p>
                    <p className="location">{meeting.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Club Admins</h3>
            <div className="admin-list">
              <div className="admin-item">
                <FaUserCircle className="admin-avatar" />
                <div className="admin-info">
                  <h4>Dr. John Smith</h4>
                  <p>Faculty Advisor</p>
                </div>
              </div>
              <div className="admin-item">
                <FaUserCircle className="admin-avatar" />
                <div className="admin-info">
                  <h4>Alice Johnson</h4>
                  <p>President</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="club-main">
          {activeTab === 'posts' && (
            <div className="posts-section">
              {/* Create Post (for members) */}
              {isMember && (
                <div className="create-post">
                  <FaUserCircle className="user-avatar" />
                  <input type="text" placeholder={`Write something to ${clubData.name}...`} />
                  <div className="post-options">
                    <button className="option-btn">
                      <MdPhotoLibrary /> Photo
                    </button>
                    <button className="option-btn">
                      <MdEvent /> Event
                    </button>
                  </div>
                </div>
              )}

              {/* Pinned Posts */}
              {clubPosts.filter(post => post.isPinned).length > 0 && (
                <div className="pinned-posts">
                  <h3 className="section-title">
                    <FaRegBookmark /> Pinned Posts
                  </h3>
                  {clubPosts.filter(post => post.isPinned).map(post => (
                    <ClubPost key={post.id} post={post} isPinned={true} />
                  ))}
                </div>
              )}

              {/* All Posts */}
              <h3 className="section-title">Recent Activity</h3>
              {clubPosts.map(post => (
                !post.isPinned && <ClubPost key={post.id} post={post} />
              ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-section">
              <div className="events-header">
                <h2>Upcoming Events</h2>
                <button className="btn primary">
                  <FaPlus /> Create Event
                </button>
              </div>

              <div className="events-list">
                {clubEvents.slice(0, showMoreEvents ? clubEvents.length : 2).map(event => (
                  <ClubEvent key={event.id} event={event} />
                ))}
              </div>

              {clubEvents.length > 2 && (
                <button 
                  className="view-more-btn"
                  onClick={() => setShowMoreEvents(!showMoreEvents)}
                >
                  {showMoreEvents ? 'Show Less' : `View All ${clubEvents.length} Events`}
                  <FaChevronDown className={showMoreEvents ? 'rotate' : ''} />
                </button>
              )}

              <div className="past-events">
                <h3>Past Events</h3>
                <div className="past-events-grid">
                  {[...clubEvents].reverse().map(event => (
                    <div key={`past-${event.id}`} className="past-event-card">
                      <div className="event-date">
                        <span className="month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="day">{new Date(event.date).getDate()}</span>
                      </div>
                      <div className="event-info">
                        <h4>{event.title}</h4>
                        <p>{event.attendees} attended</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-section">
              <h2>Club Notifications</h2>
              <div className="notifications-list">
                {clubNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.isNew ? 'new' : ''}`}
                  >
                    <div className="notification-content">
                      <p>{notification.content}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    {notification.isNew && <div className="new-badge"></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="about-section">
              <h2>About {clubData.name}</h2>
              <div className="about-content">
                <div className="about-description">
                  <h3>Description</h3>
                  <p>{clubData.description}</p>
                  <p>We meet every Thursday at 3pm in the Computer Science building. All skill levels are welcome!</p>
                </div>

                <div className="about-details">
                  <h3>Details</h3>
                  <div className="detail-item">
                    <strong>Founded:</strong> September 2018
                  </div>
                  <div className="detail-item">
                    <strong>Meeting Schedule:</strong> Thursdays, 3:00 PM - 5:00 PM
                  </div>
                  <div className="detail-item">
                    <strong>Location:</strong> Computer Lab 3, Block B
                  </div>
                  <div className="detail-item">
                    <strong>Contact:</strong> techinnovators@unibamenda.edu
                  </div>
                </div>

                <div className="about-members">
                  <h3>Membership</h3>
                  <div className="membership-stats">
                    <div className="stat-card">
                      <h4>{clubData.members}</h4>
                      <p>Total Members</p>
                    </div>
                    <div className="stat-card">
                      <h4>24</h4>
                      <p>Active This Week</p>
                    </div>
                    <div className="stat-card">
                      <h4>8</h4>
                      <p>Executive Team</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="media-section">
              <h2>Club Media</h2>
              <div className="media-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Photos</button>
                <button className="filter-btn">Videos</button>
                <button className="filter-btn">Documents</button>
              </div>
              <div className="media-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
                  <div key={item} className="media-item">
                    <img 
                      src={`https://source.unsplash.com/random/300x300/?tech,meeting,${item}`} 
                      alt={`Club media ${item}`} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for Club Posts
const ClubPost = ({ post, isPinned = false }) => {
  return (
    <div className={`club-post ${isPinned ? 'pinned' : ''}`}>
      {isPinned && (
        <div className="pinned-badge">
          <FaRegBookmark /> Pinned Post
        </div>
      )}
      <div className="post-header">
        <div className="poster-info">
          <FaUserCircle className="poster-avatar" />
          <div>
            <h4>Club Admin</h4>
            <span className="post-time">{post.time}</span>
          </div>
        </div>
        <FaEllipsisH className="options-icon" />
      </div>
      <div className="post-content">
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="Post content" className="post-image" />}
      </div>
      <div className="post-actions">
        <button className="action-btn">
          <FaHeart /> {post.likes}
        </button>
        <button className="action-btn">
          <BiMessageDetail /> {post.comments} comments
        </button>
        <button className="action-btn">
          <FaShare /> Share
        </button>
      </div>
    </div>
  );
};

// Sub-component for Club Events
const ClubEvent = ({ event }) => {
  return (
    <div className="club-event">
      <div className="event-date">
        <span className="day">{new Date(event.date).getDate()}</span>
        <span className="month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
      </div>
      <div className="event-details">
        <h3>{event.title}</h3>
        <div className="event-meta">
          <span className="event-time">
            <FaCalendarAlt /> {event.time}
          </span>
          <span className="event-location">
            <FaUserCircle /> {event.location}
          </span>
        </div>
        <p className="event-description">{event.description}</p>
        <div className="event-actions">
          <button className="btn primary">Going</button>
          <button className="btn secondary">Interested</button>
          <span className="attendees">{event.attendees} going</span>
        </div>
      </div>
    </div>
  );
};

export default ClubProfile;