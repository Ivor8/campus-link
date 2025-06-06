import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaIdCard, FaPenAlt, FaLightbulb, FaGraduationCap, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './ClubApplication.css'

const ClubApplicationForm = ({ clubName }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    matricule: '',
    department: '',
    level: '100',
    reason: '',
    passion: '',
    goals: '',
    skills: '',
    commitment: 'medium',
    previousExperience: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Business Administration'
  ];

  const levels = ['100', '200', '300', '400', '500'];
  const commitmentLevels = [
    { value: 'low', label: 'Low (1-2 hours/week)' },
    { value: 'medium', label: 'Medium (3-5 hours/week)' },
    { value: 'high', label: 'High (6+ hours/week)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.matricule.trim()) newErrors.matricule = 'Matricule is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.reason.trim()) newErrors.reason = 'Please explain your reason for joining';
    if (!formData.passion.trim()) newErrors.passion = 'Please share your passion';
    if (!formData.goals.trim()) newErrors.goals = 'Please describe your goals';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send this data to your backend
      console.log('Application submitted:', formData);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        className="application-success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon">
          <FaCheck />
        </div>
        <h2>Application Submitted!</h2>
        <p>Your application to join <strong>{clubName}</strong> has been received.</p>
        <p>The club admin will review your application and get back to you soon.</p>
        <button 
          className="return-button"
          onClick={() => setSubmitted(false)}
        >
          Submit Another Application
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="club-application-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="application-header">
        <h2>Join {clubName}</h2>
        <p>Please fill out this application form to be considered for membership</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className="form-section">
          <h3><FaUser /> Personal Information</h3>
          <div className="form-row">
            <div className={`input-group ${errors.fullName ? 'error' : ''}`}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className={`input-group ${errors.email ? 'error' : ''}`}>
              <label>University Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@unibamenda.edu"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className={`input-group ${errors.matricule ? 'error' : ''}`}>
              <label>Matriculation Number</label>
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                placeholder="e.g. UB2023CS1234"
              />
              {errors.matricule && <span className="error-message">{errors.matricule}</span>}
            </div>

            <div className={`input-group ${errors.department ? 'error' : ''}`}>
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select your department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Academic Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              {levels.map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Application Questions Section */}
        <div className="form-section">
          <h3><FaPenAlt /> Application Questions</h3>
          
          <div className={`input-group ${errors.reason ? 'error' : ''}`}>
            <label>Why do you want to join {clubName}? *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Explain your motivation for joining this club..."
              rows={4}
            />
            {errors.reason && <span className="error-message">{errors.reason}</span>}
          </div>

          <div className={`input-group ${errors.passion ? 'error' : ''}`}>
            <label>What are you passionate about? *</label>
            <textarea
              name="passion"
              value={formData.passion}
              onChange={handleChange}
              placeholder="Share your interests and passions..."
              rows={4}
            />
            {errors.passion && <span className="error-message">{errors.passion}</span>}
          </div>

          <div className={`input-group ${errors.goals ? 'error' : ''}`}>
            <label>What do you hope to achieve by joining this club? *</label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="Describe your personal and academic goals..."
              rows={4}
            />
            {errors.goals && <span className="error-message">{errors.goals}</span>}
          </div>

          <div className="input-group">
            <label>What skills or experiences can you bring to the club?</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Any relevant skills, experiences, or talents..."
              rows={4}
            />
          </div>

          <div className="input-group">
            <label>Do you have any previous experience with similar clubs or activities?</label>
            <textarea
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleChange}
              placeholder="Describe any relevant past experiences..."
              rows={4}
            />
          </div>
        </div>

        {/* Commitment Section */}
        <div className="form-section">
          <h3><FaLightbulb /> Time Commitment</h3>
          <div className="input-group">
            <label>How much time can you commit to club activities?</label>
            <div className="radio-group">
              {commitmentLevels.map(level => (
                <label key={level.value} className="radio-option">
                  <input
                    type="radio"
                    name="commitment"
                    value={level.value}
                    checked={formData.commitment === level.value}
                    onChange={handleChange}
                  />
                  <span className="radio-label">{level.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-footer">
          <p className="required-note">* Required fields</p>
          <button type="submit" className="submit-button">
            Submit Application
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ClubApplicationForm;