import React, { useEffect, useState } from 'react';
import './dashboard.css';
import axios from 'axios';
import landingVideo from '../../assets/landingVideo.mp4';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';


Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const name = localStorage.getItem('name') || 'User';
  const role = localStorage.getItem('role') || 'user';

  const [sessions, setSessions] = useState([]);
  const [userList, setUserList] = useState([])
  const [adminStats, setAdminStats] = useState(null);

  // Add logout function
  const handleLogout = () => {
    // Clear all user data from localStorage when logout
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('currentSession');
    
    // Redirect to login page
    window.location.href = '/login'; // Change this to your login route
  };

  useEffect(() => {
  if (role === 'admin') {
    axios.get('http://localhost:5000/api/admin-stats', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setAdminStats(res.data))
    .catch(err => console.error('Failed to load admin stats:', err));

    // Fetch users
    axios.get('http://localhost:5000/api/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setUserList(res.data))
    .catch(err => console.error('Failed to load users:', err));
  }
}, [role]);

//load sessions for normal users
useEffect(() => {
  if (role !== 'admin') {
    axios.get('http://localhost:5000/api/sessions')
      .then(res => setSessions(res.data))
      .catch(err => console.error('Failed to load sessions:', err));
  }
}, [role]);

  return (
    <div className="dashboard">
       <video className="background-video" autoPlay muted loop>
         <source src={landingVideo} type="video/mp4" />
      
        </video>
      <div className="header">
        <h2>Hello, {name}</h2>
        <p>We Wish you have a good day !</p>
       
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      
      {/* Admin Stats Section */}
      {role === 'admin' && adminStats && (
        <>
          <div className="admin-stats">
            <div 
              className="stat-card" 
              style={{ cursor: 'pointer' }} 
              onClick={() => {
              const listSection = document.querySelector('.user-list');
              listSection?.scrollIntoView({ behavior: 'smooth' });
            }}  >
            Total Users<br />
            <strong>{adminStats.totalUsers}</strong>
          </div>
            <div 
               className="stat-card" 
               style={{ cursor: 'pointer' }} 
               onClick={() => window.location.href = '/newsession'}  // Adjust this path to your actual route
            >
               Total Sessions<br />
              <strong>{adminStats.totalSessions}</strong>
            </div>

          </div>

          <div className='user-list'>
            <h3 style={{ marginBottom: '10px' }}>All Registered Users</h3>
            <table className="user-table">
            <thead>
              <tr>
                 <th>#</th>
                 <th>Name</th>
                 <th>Email</th>
                 <th>Role</th>
             </tr>
            </thead>
            <tbody>
              {userList.map((user, index) => (
                <tr key={user._id}>
                 <td>{index + 1}</td>
                 <td>{user.name}</td>
                 <td>{user.email}</td>
                 <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
        </>
      )}

      {/* Session Cards Section for external users */}
      {role !== 'admin' && (
        <>
          <div className="sessions">
            {sessions.map((session, index) => (
              <div
                key={session._id}
                className="session-card"
                style={{ backgroundColor: ['#A9A1F7', '#FFD494', '#333333','#444444','#555555'][index % 5] }}
              >
                <div className="session-info">
                  <span className="emoji">🧘‍♀️</span>
                  <h3>{session.title}</h3>
                  <p>{session.category}</p>
                  <span className="time">{session.duration} MIN</span>
                </div>
                 <button
                  className="start-btn"
                  onClick={() => {
                  localStorage.setItem('currentSession', session._id);
                  window.location.href = `/session/${session._id}`;
                  }}
                >
                  START
                 </button>
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
}

export default Dashboard;