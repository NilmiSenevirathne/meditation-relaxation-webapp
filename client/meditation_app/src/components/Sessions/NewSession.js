import React, { useState } from 'react';
import axios from 'axios';
import './newsession.css'; 
import { useNavigate } from 'react-router-dom';

function NewSession() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    mediaURL: '',
    duration: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/sessions', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess('Session created successfully!');
        setFormData({ title: '', description: '', category: '', mediaURL: '', duration: '' });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setError('Failed to create session. Please try again.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard'); // Change this path if your cancel destination is different
  };

  return (
    <div className="new-session-container">
      <h2>Create New Session</h2>
      <form onSubmit={handleSubmit} className="session-form">
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Category:</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} required />

        <label>Media URL:</label>
        <input type="text" name="mediaURL" value={formData.mediaURL} onChange={handleChange} required />

        <label>Duration (minutes):</label>
        <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />

        <div className="button-group">
          <button type="submit" className="submit-btn">Create Session</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
    </div>
  );
}

export default NewSession;
