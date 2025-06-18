import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css'


function SignUp() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState(({
        name:'',
        email:'',
        password:'',
        role:'user',
    }));

    const [message , setMessage] = useState('');

    //form data handle function
    const handleChange = (e) => {
       setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //submit function handling
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
           const res = await axios.post('http://localhost:5000/api/register', formData);
           setMessage(res.data.message || 'User registered successfully');
           setFormData({ name: '', email: '', password: '', role: 'user' }); // reset
        } catch (err) {
           setMessage(err.response?.data?.message || 'Registration failed');
        }
    };

    //handle back button
     const handleBack = () => {
    navigate('/');
  };


  

    return (
        <div className='form-container'>

            <h2>Sign Up</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type='text' name='name' placeholder='Full Name ' value={formData.name} onChange={handleChange} required/>
                <input type='email' name='email' placeholder='Enter your email' value={formData.email} onChange={handleChange} required/>
                <input type='password' name='password' placeholder='Enter your password' value={formData.password} onChange={handleChange} required/>
                <select name="role" value={formData.role} onChange={handleChange}>
                   <option value="user">User</option>
                   <option value="admin">Admin</option>
                </select>

                <div className='btn-group'>
                  <button className= 'btn-submit'type='submit' >Register</button>
                  <button className='btn-back' onClick={handleBack}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
