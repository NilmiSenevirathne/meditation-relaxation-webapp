import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css';
import landingVideo from '../../assets/landingVideo.mp4';
import { Visibility, VisibilityOff } from '@mui/icons-material';  // MUI icons
import IconButton from '@mui/material/IconButton';

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      setMessage(res.data.message || 'User registered successfully');
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="signup-page">
      <video className="background-video" autoPlay muted loop>
        <source src={landingVideo} type="video/mp4" />
      </video>

      <div className="form-container">
        <h2>Sign Up</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row password-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              className="eye-icon"
              aria-label="toggle password visibility"
              edge="start"
              type="button"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </div>

          <div className="form-row password-wrapper">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <IconButton
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="eye-icon"
              aria-label="toggle confirm password visibility"
              edge="start"
              type="button"
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </div>

          <div className="form-row">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="btn-group">
            <button className="btn-submit" type="submit">Sign Up</button>
            <button className="btn-back" type="button" onClick={handleBack}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
