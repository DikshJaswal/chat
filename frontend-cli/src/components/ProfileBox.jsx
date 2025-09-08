import React from "react";
import { useNavigate } from "react-router-dom";
import "./BoxStyles.css";
import API from "../services/api";

export default function ProfileBox({ userData }) {  // Receive userData as prop
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/logout");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed");
    }
  };

  if (!userData) return <div className="section profile-box">Loading profile...</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="section profile-box">
      <div className="cyber-grid-overlay"></div>
      <div className="particle-aura"></div>
      
      <div className="profile-header">
        <h3 className="username">
          <span className="username-bracket">[</span>
          @{userData.username}
          <span className="username-bracket">]</span>
        </h3>
        <span className="status online">
          <span className="status-indicator"></span>
          ACTIVE
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      
      <div className="profile-content">
        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{userData.details?.gender || "Not specified"}</span>
          </div>
          <div className="detail-row bio">
            <span className="detail-label">BIO:</span>
            <span className="detail-value bio-text">
              {userData.details?.bio || "No bio set"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">DATE JOINED:</span>
            <span className="detail-value">
              {userData.createdAt ? formatDate(userData.createdAt) : "Unknown"}
            </span>
          </div>
        </div>
        
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
      
      <div className="tech-lines"></div>
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration top-right"></div>
      <div className="corner-decoration bottom-left"></div>
      <div className="corner-decoration bottom-right"></div>
    </div>
  );
}