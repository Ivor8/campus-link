import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaSearch, FaBell, FaUserCircle, FaHeart, FaComment, FaEllipsisH, FaPlus, FaCalendarAlt,
  FaUsers, FaInfoCircle, FaRegBookmark, FaShare, FaChevronDown, FaMapMarkerAlt, FaUserPlus, FaEdit,
  FaImage, FaPaperPlane, FaTrash
} from 'react-icons/fa';
import { MdGroups, MdEvent, MdNotifications, MdSettings, MdPhotoLibrary, MdEventNote } from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';
import './clubs-profile.css';
import './clubPost.css'

const ClubProfile = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [clubData, setClubData] = useState(null);
  const [events, setEvents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [showMoreEvents, setShowMoreEvents] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState({ text: '', image: null });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return navigate('/login');
    }

async function fetchClubData() {
  try {
    setLoading(true);
    
    // Decode token to get current user ID
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = decoded.id;
    setUserId(userId);

    // Fetch all data in parallel
    const [clubRes, eventsRes, meetingsRes, postsRes] = await Promise.all([
      axios.get(`http://localhost:5000/api/clubs/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:5000/api/clubadmin/${clubId}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:5000/api/clubadmin/${clubId}/meetings`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:5000/api/${clubId}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    // IMPORTANT FIX: Update these lines to match your actual API response structure
    const data = clubRes.data.data.club; // Try this first
    // If that doesn't work, try:
    // const data = clubRes.data.club;
    
    setClubData(data);
    setEvents(eventsRes.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    setMeetings(meetingsRes.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    
    // IMPORTANT FIX: Update posts to match your API response
    setPosts(postsRes.data.data.posts); // Try this first
    // If that doesn't work, try:
    // setPosts(postsRes.data.posts);

    // Check membership
    const memberIds = data.members?.map(m => typeof m === 'object' ? m._id : m);
    const adminIds = data.admins?.map(a => typeof a === 'object' ? a._id : a);

    setIsMember(memberIds?.includes(userId));
    setIsAdmin(adminIds?.includes(userId));

  } catch (err) {
    console.error('Full error:', {
      message: err.message,
      response: err.response?.data,
      stack: err.stack
    });
    setError(err.response?.data?.message || 'Could not load club data.');
  } finally {
    setLoading(false);
  }
}

    fetchClubData();
  }, [clubId, navigate]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };

      const formData = new FormData();
      formData.append('text', newPost.text);
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      const res = await axios.post(
        `http://localhost:5000/api/${clubId}/posts`,
        formData,
        config
      );

      setPosts([res.data.data.post, ...posts]);
      setNewPost({ text: '', image: null });
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.patch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        config
      );

      setPosts(posts.map(post => 
        post._id === postId ? res.data.data.post : post
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!newComment.trim()) return;
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { text: newComment },
        config
      );

      setPosts(posts.map(post => 
        post._id === postId ? res.data.data.post : post
      ));
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewPost({ ...newPost, image: e.target.files[0] });
    }
  };

  if (loading) return <div className="club-profile-container"><p>Loading...</p></div>;
  if (error) return <div className="club-profile-container"><p className="error">{error}</p></div>;

  const {
    name, description, coverImage, logoImage,
    members = [], tags = [], notifications = []
  } = clubData;
  
  const backendUrl = 'http://localhost:5000';
  const logoUrl = logoImage ? `${backendUrl}/${logoImage}` : '/default-logo.jpg';
  const coverUrl = coverImage ? `${backendUrl}/${coverImage}` : '/default-cover.jpg';

  // Format date as "Month Day, Year"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time as "HH:MM AM/PM"
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="club-profile-container">
      {/* Header Section - unchanged */}
      <div className="club-header">
        <div 
          className="cover-photo" 
          style={{
            backgroundImage: `url(${coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="club-info-overlay">
            <img src={logoUrl} alt={name} className="club-logo" />
            <div className="club-meta">
              <h1>{name}</h1>
              <p>{members.length} members • {tags.join(', ')}</p>
            </div>
            <div className="club-actions">
              {isMember ? (
                <>
                  <Link to={`/clubs/${clubId}/messages`} className="page-links">
                    <button className="btn primary"><BiMessageDetail /> Message</button>
                  </Link>
                  <button className="btn secondary"><FaUsers /> Invite</button>
                  {isAdmin && (
                    <Link to={`/clubs/${clubId}/admin`} className="page-links">
                      <button className="btn admin"><MdSettings /> Manage</button>
                    </Link>
                  )}
                </>
              ) : (
              <Link to={`/clubs/${club._id}/apply`}>
                <button className="btn primary">
                  <MdGroups /> Join Club
                </button>
              </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - unchanged */}
      <div className="club-nav">
        <button 
          className={activeTab==='posts'?'active':''} 
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button 
          className={activeTab==='events'?'active':''} 
          onClick={() => setActiveTab('events')}
        >
          <MdEvent /> Events
        </button>
        <button 
          className={activeTab==='media'?'active':''} 
          onClick={() => setActiveTab('media')}
        >
          <MdPhotoLibrary /> Media
        </button>
        <button 
          className={activeTab==='notifications'?'active':''} 
          onClick={() => setActiveTab('notifications')}
        >
          <MdNotifications /> Notifications
        </button>
        <button 
          className={activeTab==='about'?'active':''} 
          onClick={() => setActiveTab('about')}
        >
          <FaInfoCircle /> About
        </button>
      </div>

      {/* Main Content */}
      <div className="club-content">
        {/* Sidebar - unchanged */}
        <div className="club-sidebar">
          {/* About Section */}
          <div className="sidebar-section about-section">
            <h3>About</h3>
            <p>{description || 'No description provided.'}</p>
            <div className="club-stats">
              <div className="stat-item">
                <MdGroups /> <span>{members.length} members</span>
              </div>
              <div className="stat-item">
                <MdEvent /> <span>{events.length} upcoming events</span>
              </div>
            </div>
          </div>

          {/* Meetings Section */}
          <div className="sidebar-section">
            <div className="section-header">
              <h3>Upcoming Meetings</h3>
              {isAdmin && (
                <Link 
                  to={`/clubs/${clubId}/admin?tab=Meetings`} 
                  className="icon-button"
                  aria-label="Schedule meeting"
                >
                  <FaPlus />
                </Link>
              )}
            </div>
            
            {meetings.length > 0 ? (
              <div className="meetings-list">
                {meetings.slice(0, 3).map(meeting => (
                  <div key={meeting._id} className="meeting-card">
                    <div className="meeting-date-badge">
                      <span className="day">{new Date(meeting.date).getDate()}</span>
                      <span className="month">
                        {new Date(meeting.date).toLocaleString('default', {month: 'short'})}
                      </span>
                    </div>
                    <div className="meeting-content">
                      <h4>{meeting.agenda}</h4>
                      <div className="meeting-meta">
                        <span><FaCalendarAlt /> {formatTime(meeting.date)}</span>
                        {meeting.location && (
                          <span><FaMapMarkerAlt /> {meeting.location}</span>
                        )}
                      </div>
                      {meeting.notes && (
                        <p className="meeting-notes">{meeting.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <MdEventNote size={24} />
                <p>No meetings scheduled</p>
              </div>
            )}
            
            {meetings.length > 3 && (
              <Link to={`/clubs/${clubId}/meetings`} className="view-all-link">
                View all meetings
              </Link>
            )}
          </div>

          {/* Members Section */}
          <div className="sidebar-section">
            <h3>Club Members ({members.length})</h3>
            <div className="members-preview">
              {members.slice(0, 5).map(member => (
                <div key={member._id || member} className="member-item">
                  {typeof member === 'object' && member.profilePicture ? (
                    <img 
                      src={member.profilePicture} 
                      alt={member.name} 
                      className="member-avatar" 
                    />
                  ) : (
                    <div className="member-avatar">
                      <FaUserCircle />
                    </div>
                  )}
                  <span>{typeof member === 'object' ? member.name : 'Member'}</span>
                </div>
              ))}
              {members.length > 5 && (
                <div className="more-members">
                  +{members.length - 5} more
                </div>
              )}
            </div>
            {members.length > 0 && (
              <Link to={`/clubs/${clubId}/members`} className="view-all-link">
                View all members
              </Link>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="club-main">
          {/* Posts Tab - updated with new functionality */}
          {activeTab === 'posts' && (
            <div className="posts-section">
              {isMember && (
                <div className="create-post">
                  <form onSubmit={handlePostSubmit}>
                    <textarea
                      placeholder={`What's happening in ${name}?`}
                      value={newPost.text}
                      onChange={(e) => setNewPost({...newPost, text: e.target.value})}
                      required
                    />
                    <div className="post-actions">
                      <label className="image-upload">
                        <FaImage />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          style={{ display: 'none' }} 
                        />
                      </label>
                      <button type="submit" disabled={!newPost.text}>
                        <FaPaperPlane /> Post
                      </button>
                    </div>
                    {newPost.image && (
                      <div className="image-preview">
                        <img src={URL.createObjectURL(newPost.image)} alt="Preview" />
                        <button onClick={() => setNewPost({...newPost, image: null})}>
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}
              
              <h3>Recent Posts</h3>
              {posts.length > 0 ? (
                posts.map(post => (
                  <div key={post._id} className="club-post">
                    <div className="post-header">
                      <img 
                        src={post.author?.profilePicture || '/default-user.jpg'} 
                        alt={post.author?.name} 
                      />
                      <div>
                        <span>{post.author?.name}</span>
                        <small>{new Date(post.createdAt).toLocaleString()}</small>
                      </div>
                      <FaEllipsisH />
                    </div>
                    <div className="post-content">
                      <p>{post.text}</p>
                      {post.image && (
                        <img 
                          src={`${backendUrl}/${post.image}`} 
                          alt="Post content" 
                          className="post-image"
                        />
                      )}
                    </div>
                    <div className="post-actions">
                      <button onClick={() => handleLike(post._id)}>
                        <FaHeart className={post.likes?.includes(userId) ? 'liked' : ''} />
                        {post.likes?.length || 0}
                      </button>
                      <button>
                        <FaComment /> {post.comments?.length || 0}
                      </button>
                    </div>
                    <div className="comment-section">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <button onClick={() => handleCommentSubmit(post._id)}>
                        <FaPaperPlane />
                      </button>
                    </div>
                    {post.comments?.length > 0 && (
                      <div className="comments-list">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="comment">
                            <img 
                              src={comment.user?.profilePicture || '/default-user.jpg'} 
                              alt={comment.user?.name} 
                            />
                            <div>
                              <strong>{comment.user?.name}</strong>
                              <p>{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-posts">
                  <p>No posts yet. Be the first to post!</p>
                </div>
              )}
            </div>
          )}

          {/* Events Tab - unchanged */}
          {activeTab === 'events' && (
            <div className="events-tab">
              <div className="section-header">
                <h2>Club Events</h2>
                {isAdmin && (
                  <Link 
                    to={`/clubs/${clubId}/admin?tab=Events`} 
                    className="icon-button"
                  >
                    <FaPlus /> Create Event
                  </Link>
                )}
              </div>
              
              {events.length > 0 ? (
                <div className="events-grid">
                  {events.slice(0, showMoreEvents ? events.length : 4).map(event => (
                    <div key={event._id} className="event-card">
                      {event.image && (
                        <div className="event-image">
                          <img src={event.image} alt={event.title} />
                          <div className="event-date-tag">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                            <span>{new Date(event.date).getDate()}</span>
                          </div>
                        </div>
                      )}
                      <div className="event-details">
                        <div className="event-time">{formatTime(event.date)}</div>
                        <h3>{event.title}</h3>
                        <div className="event-meta">
                          {event.location && (
                            <span className="location">
                              <FaMapMarkerAlt /> {event.location}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="event-description">
                            {event.description.substring(0, 100)}
                            {event.description.length > 100 && '...'}
                          </p>
                        )}
                        <div className="event-actions">
                          <button className="rsvp-button">
                            <FaUserPlus /> RSVP
                          </button>
                          {isAdmin && (
                            <button className="edit-button">
                              <FaEdit /> Edit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-events">
                  <MdEvent size={48} className="empty-icon" />
                  <h3>No upcoming events</h3>
                  <p>When events are scheduled, they'll appear here</p>
                  {isAdmin && (
                    <Link 
                      to={`/clubs/${clubId}/admin?tab=Events`} 
                      className="create-button"
                    >
                      <FaPlus /> Create First Event
                    </Link>
                  )}
                </div>
              )}
              
              {events.length > 4 && (
                <button 
                  onClick={() => setShowMoreEvents(!showMoreEvents)}
                  className="view-more-button"
                >
                  {showMoreEvents ? 'Show Less' : `View All (${events.length})`}
                  <FaChevronDown className={`chevron ${showMoreEvents ? 'up' : ''}`} />
                </button>
              )}
            </div>
          )}

          {/* Other Tabs - unchanged */}
          {activeTab === 'notifications' && (
            <div className="notifications-section">
              <h2>Notifications</h2>
              {notifications.length ? (
                notifications.map(n => (
                  <div 
                    key={n._id} 
                    className={`notification-item ${n.isNew ? 'new' : ''}`}
                  >
                    <p>{n.content}</p>
                    <span>{n.time}</span>
                  </div>
                ))
              ) : (
                <p>No notifications.</p>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="about-section">
              <h2>About {name}</h2>
              <p>{description || 'No description.'}</p>
              <div className="about-details">
                <div><strong>Members:</strong> {members.length}</div>
                <div><strong>Tags:</strong> {tags.join(', ') || 'None'}</div>
                <div><strong>Category:</strong> {clubData.category || 'Unspecified'}</div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="media-section">
              <h2>Club Media</h2>
              <p>(media functionality coming soon)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubProfile;