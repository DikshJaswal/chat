import React, { useEffect, useState } from "react";
import "./OpenedProfileBox.css";
import { followUser, unfollowUser } from "../services/api";

export default function OpenedProfileBox({ user, currentUser, activeCommand, onFollowToggle }) {
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing || false);

  // Sync follow state with Terminal command
  useEffect(() => {
    if (!activeCommand || !user) return;
    const [command, target] = activeCommand.split(" ");
    if (target === user.username) {
      setIsFollowing(command === "follow");
    }
  }, [activeCommand, user]);

  if (!user) return null;

  const handleFollowToggle = async () => {
    if (!currentUser?._id) return console.error("Current user ID not available");

    try {
      let res;
      if (isFollowing) {
        res = await unfollowUser(user.username, currentUser._id);
        if (res.data.success) {
          setIsFollowing(false);
          onFollowToggle?.(user.username, false);
        }
      } else {
        res = await followUser(user.username, currentUser._id);
        if (res.data.success) {
          setIsFollowing(true);
          onFollowToggle?.(user.username, true);
        }
      }
    } catch (err) {
      console.error("Follow/Unfollow error:", err);
      alert("Something went wrong while updating follow status.");
    }
  };

  return (
    <div className="opened-profile-container">
      <div className="opened-profile-header">
        <span className="username">[@{user.username}]</span>
        <span className="status">{user.isOnline ? "● ACTIVE" : "○ OFFLINE"}</span>
      </div>

      <div className="opened-profile-body">
        <div className="profile-info">
          <p><span className="label">Username:</span> @{user.username || "Unknown"}</p>
          <p><span className="label">Bio:</span> <em>{user.details?.bio || "No bio available"}</em></p>
          <p><span className="label">Gender:</span> {user.details?.gender || "N/A"}</p>
          <p><span className="label">Date Joined:</span> {user.joinDate || "Unknown"}</p>
        </div>

        <div className="profile-dp">
          <div className="dp-circle">
            <img src={user.dp || "/default-dp.png"} alt="avatar" />
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button
          className={`follow-btn ${isFollowing ? "unfollow" : ""}`}
          onClick={handleFollowToggle}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
}
