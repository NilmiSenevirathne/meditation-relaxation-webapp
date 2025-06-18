import React from 'react'
import './landing.css'
import backgroundVideo from '../../assets/landingVideo.mp4'

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
        <div className='content'>
            <h1>Take a deep breath</h1>
            <p>Start your journey to more relaxed, mindful life.</p>
            <button className='get-started-btn'>Get Started</button>
            
        </div> 
    </div>
  )
}

export default Landing
