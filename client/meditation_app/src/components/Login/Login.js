import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {IconButton} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import landingVideo from '../../assets/landingVideo.mp4';
import './login.css'

function Login() {
  const navigate = useNavigate();

  const [email , setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('');

  //submit form function
  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!email || !password){
      setMessage('All fields are required')
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      const { token, role, name } = res.data;

      // Save token and user data to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);

      setMessage('Login successful');
      alert('User Successfully Login !')
      navigate('/dashboard')
      
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  }

   //handle back button
     const handleBack = () => {
    navigate('/');
  };

  return (
    <div className='login-container'>
      <video className='background-video' autoPlay muted loop>
         <source src={landingVideo} type='video/mp4' />    
      </video>
        <form className='login-form' onSubmit={handleSubmit}>
            <h2> Login</h2>

            <input
               type='email'
               placeholder='Email'
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required

            />
            
          <div className='password-container'>
           <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
           />
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
               {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
         </div>

          <div className="button-group" >
            <button  className='submit-btn' type='submit'>Log in</button>
            <button className='cancel-btn' onClick={handleBack}>Cancel</button>
          </div>

        </form>
      
    </div>
  )
}

export default Login
