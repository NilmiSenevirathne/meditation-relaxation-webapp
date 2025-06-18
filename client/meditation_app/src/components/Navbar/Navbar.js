import React from 'react';
import './navbar.css';

function Navbar() {
  return (
    <nav className='navbar' role='navigation'>
       <div className='nav-logo'>
            Meditation & Relaxation
       </div>

       <ul className='navbar-links'>
         <li><a href=''>Home</a></li>
         <li><a href=''>About</a></li>
         <li><a href='/signup'>SignUp</a></li>
         <li><a href=''>Login</a></li>
       </ul>
    </nav>
  )
}

export default Navbar
