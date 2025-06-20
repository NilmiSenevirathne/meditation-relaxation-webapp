import React from 'react';
import {useNavigate} from 'react-router-dom';
import './landing.css'
import backgroundVideo from '../../assets/landingVideo.mp4';
import Navbar from '../Navbar/Navbar';

function Landing() {
  const navigate  = useNavigate();


  return (

    <div className='landing-container'>

        <video 
            className='background-video'
            src={backgroundVideo}
            autoPlay
            loop
            muted
            playsInline
         
        /> 
        
          <Navbar/>
      
        <div className='content'>
            <h1 className='title-style'>Take a deep breath</h1>
            <p className='sentence'>Start your journey to more relaxed, mindful life.</p>
            <button className='get-started-btn'onClick={()=>navigate("/login")} >Get Started</button>
            
        </div> 
    </div>
  )
}

export default Landing
