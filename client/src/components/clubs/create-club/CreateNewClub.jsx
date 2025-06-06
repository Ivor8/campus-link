import React, { useState } from 'react';
import { FaUsers, FaImage, FaPlus, FaTimes } from 'react-icons/fa';
import './createclub.css';

const CreateNewClub = () => {
  const [clubData, setClubData] = useState({
    name: '',
    category: '',
    description: '',
    meetingSchedule: '',
    tags: [],
    newTag: '',
    isPublic: true,
    requiresApproval: false,
    coverImage: null,
    logoImage: null
  });

  const [preview, setPreview] = useState({
    cover: null,
    logo: null
  });

  const categories = [
    'Academic', 'Cultural', 'Sports', 'Technology', 
    'Arts', 'Social', 'Volunteer', 'Political', 'Religious'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    setClubData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Handle image preview
    if (type === 'file' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(prev => ({
          ...prev,
          [name === 'coverImage' ? 'cover' : 'logo']: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleAddTag = () => {
    if (clubData.newTag.trim() && !clubData.tags.includes(clubData.newTag.trim())) {
      setClubData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (tag) => {
    setClubData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting club:', clubData);
    // Add your submission logic here
    alert('Club created successfully!');
  };

  return (
    <div className="create-club-container">
      <h1 className="create-club-header">Create New Club</h1>
      
      <form onSubmit={handleSubmit} className="create-club-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2><FaUsers /> Basic Information</h2>
          
          <div className="form-group">
            <label>Club Name *</label>
            <input
              type="text"
              name="name"
              value={clubData.name}
              onChange={handleChange}
              required
              placeholder="Tech Innovators Society"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={clubData.category}
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
              value={clubData.description}
              onChange={handleChange}
              required
              placeholder="Describe your club's purpose, activities, and goals..."
              minLength="50"
            />
            <div className="character-count">{clubData.description.length}/500</div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <div className="tags-container">
                {clubData.tags.map(tag => (
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
                  value={clubData.newTag}
                  onChange={(e) => setClubData({...clubData, newTag: e.target.value})}
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

        {/* Images */}
        <div className="form-section">
          <h2><FaImage /> Club Images</h2>
          
          <div className="image-upload-group">
            <div className="image-upload">
              <label>Cover Photo</label>
              <div className={`image-preview ${preview.cover ? 'has-image' : ''}`}>
                {preview.cover ? (
                  <>
                    <img src={preview.cover} alt="Cover preview" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setPreview({...preview, cover: null});
                        setClubData({...clubData, coverImage: null});
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
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="image-upload">
              <label>Logo</label>
              <div className={`image-preview ${preview.logo ? 'has-image' : ''}`}>
                {preview.logo ? (
                  <>
                    <img src={preview.logo} alt="Logo preview" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setPreview({...preview, logo: null});
                        setClubData({...clubData, logoImage: null});
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
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="form-section">
          <h2>Club Settings</h2>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={clubData.isPublic}
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
                checked={clubData.requiresApproval}
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
              value={clubData.meetingSchedule}
              onChange={handleChange}
              placeholder="Every Tuesday at 3pm in CS Lab 2"
            />
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="submit-btn">
            Create Club
          </button>
          <p className="required-note">* Required fields</p>
        </div>
      </form>
    </div>
  );
};

export default CreateNewClub;