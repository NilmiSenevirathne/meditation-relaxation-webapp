import React, { useState, useEffect } from 'react';
import './sessionplayer.css';
import axios from 'axios';

function SessionPlayer() {
  const [session, setSession] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // Get session ID from URL or local storage
  const sessionId = window.location.pathname.split('/').pop() || localStorage.getItem('currentSession');

  useEffect(() => {
    // Fetch session details
    axios.get(`http://localhost:5000/api/sessions/${sessionId}`)
      .then(res => {
        setSession(res.data);
        setDuration(res.data.duration * 60); // Convert minutes to seconds
      })
      .catch(err => console.error('Failed to load session:', err));
  }, [sessionId]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Here you would typically interact with an audio/video player API
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    // Here you would seek the audio/video player to newTime
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    // Here you would set the volume on the audio/video player
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return <div className="loading">Loading session...</div>;
  }

  return (
    <div className="session-player">
      <div className="player-header">
        <h2>{session.title}</h2>
        <p className="session-time">Today: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div className="player-container">
        <div className="progress-container">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
          />
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="controls">
          <button className="control-btn" onClick={handlePlayPause}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className="volume-control-container">
            <button 
              className="control-btn" 
              onClick={() => setShowVolumeControl(!showVolumeControl)}
            >
              {volume > 50 ? '🔊' : volume > 0 ? '🔉' : '🔇'}
            </button>
            {showVolumeControl && (
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-control"
              />
            )}
          </div>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h4>Today</h4>
          <p>120</p>
        </div>
        <div className="stat-card">
          <h4>Yesterday</h4>
          <p>350</p>
        </div>
        <div className="stat-card">
          <h4>Reports</h4>
          <p>15</p>
        </div>
      </div>
    </div>
  );
}

export default SessionPlayer;