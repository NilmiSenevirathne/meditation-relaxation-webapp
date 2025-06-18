import React, { useState } from 'react'
import {IconButton} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './login.css'

function Login() {

  const [email , setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  


  return (
    <div className='login-container'>
        <form className='login-form'>
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
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
         </div>


            <button type='submit'>Log in</button>

        </form>
      
    </div>
  )
}

export default Login
