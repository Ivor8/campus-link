import React, { useState, useEffect } from 'react';
import { FaUsers, FaImage, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './createclub.css';

const CreateNewClub = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    meetingSchedule: '',
    tags: [],
    newTag: '',
    isPublic: true,
    requiresApproval: false
  });

  const [files, setFiles] = useState({
    coverImage: null,
    logoImage: null
  });

  const [previews, setPreviews] = useState({
    cover: null,
    logo: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const categories = [
    'Academic', 'Cultural', 'Sports', 'Technology',
    'Arts', 'Social', 'Volunteer', 'Political', 'Religious'
  ];

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: '/create-club' } });
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      setFiles(prev => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(prev => ({
          ...prev,
          [name === 'coverImage' ? 'cover' : 'logo']: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!userToken) {
        navigate('/login', { state: { from: '/create-club' } });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('meetingSchedule', formData.meetingSchedule);
      formDataToSend.append('tags', formData.tags.join(','));
      formDataToSend.append('isPublic', formData.isPublic);
      formDataToSend.append('requiresApproval', formData.requiresApproval);
      
      if (files.coverImage) formDataToSend.append('coverImage', files.coverImage);
      if (files.logoImage) formDataToSend.append('logoImage', files.logoImage);

      const response = await axios.post('http://localhost:5000/api/clubs', formDataToSend, {
        headers: {
              'Authorization': `Bearer ${userToken}`, // 🔐 Required
              'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/club/${response.data.data.club._id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login', { state: { from: '/create-club' } });
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to create club. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return <div className="loading-screen">Checking authentication...</div>;
  }

  return (
    <div className="create-club-container">
      <h1 className="create-club-header">Create New Club</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="create-club-form">
        <div className="form-section">
          <h2><FaUsers /> Basic Information</h2>
          
          <div className="form-group">
            <label>Club Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Tech Innovators Society"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your club's purpose, activities, and goals..."
              minLength="50"
              rows="5"
            />
            <div className="character-count">{formData.description.length}/500</div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <div className="tags-container">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="remove-tag"
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
              <div className="add-tag">
                <input
                  type="text"
                  value={formData.newTag}
                  onChange={(e) => setFormData({...formData, newTag: e.target.value})}
                  placeholder="Add tag..."
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  className="add-tag-btn"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2><FaImage /> Club Images</h2>
          
          <div className="image-upload-group">
            <div className="image-upload">
              <label>Cover Photo</label>
              <div className={`image-preview ${previews.cover ? 'has-image' : ''}`}>
                {previews.cover ? (
                  <>
                    <img src={previews.cover} alt="Cover preview" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setPreviews({...previews, cover: null});
                        setFiles({...files, coverImage: null});
                      }}
                      className="remove-image"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    <FaImage />
                    <span>Click to upload cover</span>
                  </div>
                )}
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="image-upload">
              <label>Logo</label>
              <div className={`image-preview ${previews.logo ? 'has-image' : ''}`}>
                {previews.logo ? (
                  <>
                    <img src={previews.logo} alt="Logo preview" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setPreviews({...previews, logo: null});
                        setFiles({...files, logoImage: null});
                      }}
                      className="remove-image"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    <FaImage />
                    <span>Click to upload logo</span>
                  </div>
                )}
                <input
                  type="file"
                  name="logoImage"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Club Settings</h2>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <span>Public Club</span>
              <p className="hint">Anyone can see club content</p>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requiresApproval"
                checked={formData.requiresApproval}
                onChange={handleChange}
              />
              <span>Require approval to join</span>
              <p className="hint">New members need admin approval</p>
            </label>
          </div>

          <div className="form-group">
            <label>Meeting Schedule</label>
            <input
              type="text"
              name="meetingSchedule"
              value={formData.meetingSchedule}
              onChange={handleChange}
              placeholder="Every Tuesday at 3pm in CS Lab 2"
            />
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Club'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewClub;