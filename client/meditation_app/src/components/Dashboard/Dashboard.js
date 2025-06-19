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

  useEffect(() => {
    if (role !== 'admin') {
      axios.get('http://localhost:5000/api/sessions')
        .then(res => setSessions(res.data))
        .catch(err => console.error('Failed to load sessions:', err));
    }

    if (role === 'admin') {
      axios.get('http://localhost:5000/api/admin-stats')
        .then(res => setAdminStats(res.data))
        .catch(err => console.error('Failed to load admin stats:', err));
    }
  }, [role]);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; // Adjust if your login route differs
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Hello, {name}</h2>
        <p>We Wish you have a good day</p>

        {/* ✅ Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

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
                  onClick={() => window.open(session.mediaURL, '_blank')}
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
