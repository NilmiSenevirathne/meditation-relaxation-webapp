import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './sessionplayer.css';

function SessionPlayer() {
  const [session, setSession] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef(null);
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    
    const updateTime = () => setCurrentTime(audioRef.current.currentTime);
    const updateDuration = () => setDuration(audioRef.current.duration);
    const handleError = () => {
      setError('Failed to load audio track');
      setIsLoading(false);
    };
    const handleEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audioRef.current.addEventListener('timeupdate', updateTime);
    audioRef.current.addEventListener('loadedmetadata', updateDuration);
    audioRef.current.addEventListener('error', handleError);
    audioRef.current.addEventListener('ended', handleEnd);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('loadedmetadata', updateDuration);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('ended', handleEnd);
        audioRef.current = null;
      }
    };
  }, []);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/sessions/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSession(response.data);
        
        if (response.data.audioUrl && audioRef.current) {
          audioRef.current.src = response.data.audioUrl;
          audioRef.current.volume = volume;
        }
      } catch (err) {
        console.error('Session fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load session');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, navigate, volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Playback error:', err);
          setError('Playback failed. Click play to try again.');
        });
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="session-player">
        <div className="error">{error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!session || isLoading) {
    return <div className="loading">Loading session...</div>;
  }

  return (
    <div className="session-player">
      <div className="player-header">
        <h2>{session.title}</h2>
        <p className="session-description">{session.description}</p>
        <p className="session-meta">
          {session.duration} min • {session.category}
        </p>
        <p className="session-time">Today: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div className="player-container">
        <div className="progress-container">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
            disabled={isLoading}
          />
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="controls">
          <button 
            className="control-btn" 
            onClick={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? '⌛' : isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className="volume-control-container">
            <button 
              className="control-btn"
              onClick={() => setShowVolumeControl(!showVolumeControl)}
              disabled={isLoading}
            >
              {volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔇'}
            </button>
            {showVolumeControl && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-control"
              />
            )}
          </div>
        </div>
      </div>

      <div className="session-stats">
        <div className="stat-card">
          <h4>Today</h4>
          <p>{session.stats?.today || 0}</p>
        </div>
        <div className="stat-card">
          <h4>Yesterday</h4>
          <p>{session.stats?.yesterday || 0}</p>
        </div>
        <div className="stat-card">
          <h4>Total Plays</h4>
          <p>{(session.stats?.today || 0) + (session.stats?.yesterday || 0)}</p>
        </div>
      </div>
    </div>
  );
}

export default SessionPlayer;