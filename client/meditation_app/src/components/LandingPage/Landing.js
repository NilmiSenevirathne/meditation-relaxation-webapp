import React from 'react'
import './landing.css'
import backgroundVideo from '../../assets/landingVideo.mp4';
import Navbar from '../Navbar/Navbar';

function Landing() {
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
            <button className='get-started-btn'>Get Started</button>
            
        </div> 
    </div>
  )
}

export default Landing
