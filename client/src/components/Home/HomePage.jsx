import React from 'react';
import { FaSearch, FaBell, FaUserCircle, FaHeart, FaComment, FaEllipsisH, FaPlus, FaLink, FaBars } from 'react-icons/fa';
import { MdGroups, MdTrendingUp, MdBookmark } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './home.css'
const HomePage = () => {
  // Sample data - in a real app this would come from your backend
  const popularClubs = [
    { id: 1, name: 'Tech Innovators', members: 245, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 2, name: 'Debate Society', members: 189, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 3, name: 'Art Collective', members: 132, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 4, name: 'Sports Enthusiasts', members: 312, image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  ];

  const myClubs = [
    { id: 1, name: 'Coding Club', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 2, name: 'Photography Society', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  ];

  const feedPosts = [
    {
      id: 1,
      club: 'Tech Innovators',
      content: 'Join us this Friday for our workshop on Web Development with MERN Stack! Bring your laptops and ideas.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      likes: 42,
      comments: 8,
      time: '2h ago'
    },
    {
      id: 2,
      club: 'Debate Society',
      content: 'Our next debate topic: "Artificial Intelligence will do more harm than good to society". Sign up to participate!',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      likes: 28,
      comments: 14,
      time: '5h ago'
    },
  ];

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo-container">
          <FaLink className="logo-icon" />
          <h1>Campus Link</h1>
        </div>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search clubs, societies, or posts..." />
        </div>
        <div className="user-actions">
          <FaBell className="icon" />
          <FaUserCircle className="icon" />
          <FaBars className="icon" />
        </div>
      </header>

      <div className="main-content">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          <div className="sidebar-section">
            <h3>My Clubs</h3>
            <div className="my-clubs-list">
              {myClubs.map(club => (
                <>
                <Link className='page-links' to='/clubProfile'>
                <div key={club.id} className="club-item">
                  <img src={club.image} alt={club.name} />
                  <span>{club.name}</span>
                </div>
                </Link>
                </>
              ))}
            </div>
            <Link to='create-club'>
            <button className="create-club-btn">
              <FaPlus /> Create New Club
            </button>
            </Link>
          </div>

          <div className="sidebar-section">
            <h3>Quick Links</h3>
            <ul className="quick-links">
              <li><MdBookmark className="icon" /> Saved Posts</li>
              <li><MdTrendingUp className="icon" /> Trending</li>
              <li><MdGroups className="icon" /> All Clubs</li>
            </ul>
          </div>
        </div>

        {/* Main Feed */}
        <div className="feed-container">
          <div className="create-post">
            <FaUserCircle className="user-avatar" />
            <input type="text" placeholder="Share something with your clubs..." />
          </div>

          {feedPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src={post.image} alt={post.club} className="club-avatar" />
                <div className="post-info">
                  <Link to='/clubProfile'><h4>{post.club}</h4></Link>
                  <span className="post-time">{post.time}</span>
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
                  <FaComment /> {post.comments}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-section">
            <h3>Popular Clubs</h3>
            <div className="popular-clubs">
              {popularClubs.map(club => (
                <div key={club.id} className="popular-club">
                  <img src={club.image} alt={club.name} />
                  <div className="club-details">
                    <Link className='page-links' to='/clubProfile'>
                    <h4>{club.name}</h4>
                    </Link>
                    <span>{club.members} members</span>
                    <Link className='page-links' to='/joinClub'><button className="join-btn">Join</button></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Discover New</h3>
            <div className="discover-grid">
              {popularClubs.slice().reverse().map(club => (
                <div key={club.id} className="discover-item">
                  <img src={club.image} alt={club.name} />
                  <span>{club.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;