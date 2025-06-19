import React, { useEffect, useState } from 'react';
import './dashboard.css';
import axios from 'axios';
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

// Register chart.js modules
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
  const [adminStats, setAdminStats] = useState(null);

  // Add logout function
  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('currentSession');
    
    // Redirect to login page
    window.location.href = '/login'; // Change this to your login route
  };

  useEffect(() => {
    // Fetch sessions for user only
    if (role !== 'admin') {
      axios.get('http://localhost:5000/api/sessions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => setSessions(res.data))
        .catch(err => console.error('Failed to load sessions:', err));
    }

    // Fetch admin stats if admin
    if (role === 'admin') {
      axios.get('http://localhost:5000/api/admin-stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => setAdminStats(res.data))
        .catch(err => console.error('Failed to load admin stats:', err));
    }
  }, [role]);

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Hello, {name}</h2>
        <p>We Wish you have a good day</p>
        {/* Add logout button */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Rest of your component remains the same */}
      {/* Admin Stats Section */}
      {role === 'admin' && adminStats && (
        <>
          <div className="admin-stats">
            <div className="stat-card">Total Users<br /><strong>{adminStats.totalUsers}</strong></div>
            <div className="stat-card">Total Sessions<br /><strong>{adminStats.totalSessions}</strong></div>
            <div className="stat-card">Reports<br /><strong>{adminStats.totalReports}</strong></div>
          </div>

          <div className="chart-container">
            <h4>Session History</h4>
            <Line
              data={{
                labels: adminStats.history.map(item => `Month ${item._id}`),
                datasets: [{
                  label: 'Sessions per Month',
                  data: adminStats.history.map(item => item.count),
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.2)',
                  fill: true,
                  tension: 0.3
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                }
              }}
            />
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
                style={{ backgroundColor: ['#A9A1F7', '#FFD494', '#333333'][index % 3] }}
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

          <h4 className="section-title">Recommended for you</h4>
        </>
      )}
    </div>
  );
}

export default Dashboard;