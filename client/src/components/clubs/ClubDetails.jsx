import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaImage } from 'react-icons/fa';
import './createclub.css'; // reuse styles from CreateNewClub

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/clubs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClub(response.data.data.club);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load club');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClub();
  }, [id]);

  if (isLoading) return <div className="loading-screen">Loading club data...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!club) return null;

  return (
    <div className="create-club-container">
      <h1 className="create-club-header">{club.name}</h1>

      <div className="form-section">
        <h2><FaUsers /> Basic Information</h2>
        <p><strong>Category:</strong> {club.category}</p>
        <p><strong>Description:</strong> {club.description}</p>
        <p><strong>Meeting Schedule:</strong> {club.meetingSchedule || 'Not set'}</p>
        <p><strong>Tags:</strong> {club.tags.length > 0 ? club.tags.join(', ') : 'No tags'}</p>
        <p><strong>Visibility:</strong> {club.isPublic ? 'Public' : 'Private'}</p>
        <p><strong>Join Approval:</strong> {club.requiresApproval ? 'Yes' : 'No'}</p>
      </div>

      <div className="form-section">
        <h2><FaImage /> Club Images</h2>
        <div className="image-upload-group">
          {club.coverImage && (
            <div className="image-preview has-image">
              <img src={`http://localhost:5000/${club.coverImage}`} alt="Cover" />
            </div>
          )}
          {club.logoImage && (
            <div className="image-preview has-image">
              <img src={`http://localhost:5000/${club.logoImage}`} alt="Logo" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
