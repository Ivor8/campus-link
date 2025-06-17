import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';
import axios from 'axios';
import {
  FaLink, FaSearch, FaBell, FaUserCircle, FaBars,
  FaPlus
} from 'react-icons/fa';
import { MdBookmark, MdTrendingUp, MdGroups } from 'react-icons/md';

const HomePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [popularClubs, setPopularClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [userRes, clubsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/profile', config),
          axios.get('http://localhost:5000/api/clubs', config)
        ]);

        const userData = userRes.data.data.user;
        const clubs = clubsRes.data.data.clubs || [];

        const myClubsFiltered = clubs.filter(c => c.members.includes(userData._id));
        const popular = [...clubs].sort((a, b) => b.members.length - a.members.length);

        setUser(userData);
        setMyClubs(myClubsFiltered);
        setPopularClubs(popular);
        setFeedPosts([]); // Placeholder
      } catch (error) {
        console.error("❌ Home data fetch failed");

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error('Error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [navigate]);

  if (loading) {
    return <div className="loading-screen">Loading homepage...</div>;
  }

  return (
    <div className="home-container">
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
            <h3>{myClubs.length ? 'My Clubs' : 'Suggested Clubs'}</h3>
            <div className="my-clubs-list">
              {(myClubs.length ? myClubs : popularClubs).map(club => (
                <Link className="page-links" to={`/clubProfile/${club._id}`} key={club._id}>
                  <div className="club-item">
                    <img src={`http://localhost:5000/${club.logoImage}`} alt={club.name} />
                    <span>{club.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/create-club">
              <button className="create-club-btn page-link"><FaPlus /> Create New Club</button>
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

        {/* Feed Section */}
        <div className="feed-container">
          <div className="create-post">
            <FaUserCircle className="user-avatar" />
            <input type="text" placeholder="Share something with your clubs..." disabled />
          </div>

          {feedPosts.length > 0 ? (
            feedPosts.map(post => (
              <div key={post._id} className="post-card">
                {/* Post UI goes here */}
              </div>
            ))
          ) : (
            <p className="no-posts">No posts to show yet.</p>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-section">
            <h3>Popular Clubs</h3>
            <div className="popular-clubs">
              {popularClubs.map(club => (
                <div key={club._id} className="popular-club">
                  <img src={`http://localhost:5000/${club.logoImage}`} alt={club.name} />
                  <div className="club-details">
                    <Link className="page-links" to={`/clubProfile/${club._id}`}>
                      <h4>{club.name}</h4>
                    </Link>
                    <span>{club.members.length} members</span>
                    <Link className="page-links" to={`/joinClub/${club._id}`}>
                      <button className="join-btn">Join</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Discover New</h3>
            <div className="discover-grid">
              {[...popularClubs].reverse().map(club => (
                <div key={club._id} className="discover-item">
                  <img src={`http://localhost:5000/${club.logoImage}`} alt={club.name} />
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
