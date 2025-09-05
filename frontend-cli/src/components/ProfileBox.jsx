import React from "react";
import { useNavigate } from "react-router-dom";
import "./BoxStyles.css";
import API from "../services/api";

export default function ProfileBox({ 
  username = "neo_coder",
  gender = "Male",
  bio = "Hacking the matrix one line at a time",
  joinDate = "15/08/2025",
<<<<<<< HEAD
  isOnline = true
=======
  isOnline = true,
  onLogout
>>>>>>> bf14f87abce5a4f06342526b4138c64abdc917da
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post('/api/logout');
      localStorage.removeItem('user');
      navigate('/login');
      alert('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
    }
  };

  return (
    <div className="section profile-box">
      {/* Animated background elements */}
      <div className="cyber-grid-overlay"></div>
      <div className="particle-aura"></div>
      
      {/* Username Header with enhanced styling */}
      <div className="profile-header">
        <h3 className="username">
          <span className="username-bracket">[</span>
          @{username}
          <span className="username-bracket">]</span>
        </h3>
        <span className={`status ${isOnline ? 'online' : 'offline'}`}>
          <span className="status-indicator"></span>
          {isOnline ? 'ACTIVE' : 'INACTIVE'}
        </span>
        <button 
<<<<<<< HEAD
          onClick={handleLogout}
=======
          onClick={onLogout}
>>>>>>> bf14f87abce5a4f06342526b4138c64abdc917da
          className="logout-btn"
          style={{
            background: 'red',
            color: 'white',
            border: 'none',
            padding: '2px 8px',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          Logout
        </button>
      </div>
      
      {/* Profile Content - Side by side layout */}
      <div className="profile-content">
        {/* Profile Details - Left side */}
        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{gender}</span>
          </div>
          <div className="detail-row bio">
            <span className="detail-label">BIO:</span>
            <span className="detail-value bio-text">{bio}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">DATE JOINED:</span>
            <span className="detail-value">{joinDate}</span>
          </div>
        </div>
        
        {/* Enhanced Profile Frame - Right side */}
        <div className="profile-frame">
          <div className="frame-border-animation"></div>
          <div className="frame-corner tl"></div>
          <div className="frame-corner tr"></div>
          <div className="frame-corner bl"></div>
          <div className="frame-corner br"></div>
          <img
            src="https://i.imgur.com/9pNffkj.png"
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-image-overlay"></div>
        </div>
      </div>
      
      {/* Additional decorative elements */}
      <div className="tech-lines"></div>
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration top-right"></div>
      <div className="corner-decoration bottom-left"></div>
      <div className="corner-decoration bottom-right"></div>
    </div>
  );
}