import React, { useState, useEffect } from "react";
import TerminalBox from "../components/TerminalBox";
import ProfileBox from "../components/ProfileBox";
import ChatBox from "../components/ChatBox";
import UsersListBox from "../components/UserListBox";
import OpenedProfileBox from "../components/OpenedProfileBox";
import DMList from "../components/DMList";
import ChatSection from "../components/ChatSection";
import API, { fetchUsers } from "../services/api";
import "../components/BoxStyles.css";
import "../components/UsersListBox.css";
import "../components/DMList.css";

export default function ChatUI() {
  const [rightView, setRightView] = useState("chat");
  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [dmUsers, setDmUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommand, setActiveCommand] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await API.get("/api/userprofile");
        if (response.data.success) setCurrentUser(response.data.user);
      } catch {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser) setCurrentUser(localUser);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const fetchAllUsers = async () => {
      try {
        const response = await fetchUsers(currentUser._id);
        if (response.data.success) setUsers(response.data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, [currentUser]);

  const handleFollowToggle = (username, follow) => {
    setUsers(prev => prev.map(u =>
      u.username === username ? { ...u, isFollowing: follow } : u
    ));
    if (profileUser?.username === username) {
      setProfileUser(prev => ({ ...prev, isFollowing: follow }));
    }
    if (follow) {
      const userToAdd = users.find(u => u.username === username);
      if (userToAdd && !dmUsers.some(u => u.username === username))
        setDmUsers(prev => [...prev, userToAdd]);
    } else {
      setDmUsers(prev => prev.filter(u => u.username !== username));
    }
  };

  if (loading) return <div className="app">Loading user data...</div>;

  return (
    <div className="app">
      <div className="left-container">
        {profileUser ? (
          <OpenedProfileBox
            user={profileUser}
            currentUser={currentUser}
            activeCommand={activeCommand}
            onFollowToggle={handleFollowToggle}
          />
        ) : (
          <ProfileBox userData={currentUser} />
        )}

        <TerminalBox
          setRightView={setRightView}
          setProfileUser={setProfileUser}
          setChatUser={setChatUser}
          users={users}
          dmUsers={dmUsers}
          onFollowToggle={handleFollowToggle}
          currentUser={currentUser}
          activeCommand={activeCommand}
          setActiveCommand={setActiveCommand}
        />
      </div>

      <div className="right-container">
        {rightView === "chat" && <ChatBox />}
        {rightView === "users" && (
          <UsersListBox users={users} onFollowToggle={handleFollowToggle} />
        )}
        {rightView === "dm" && !chatUser && (
          <DMList dmUsers={dmUsers} openChatWithUser={setChatUser} />
        )}
        {chatUser && rightView === "dm" && (
          <ChatSection
            user={chatUser}
            goBack={() => setChatUser(null)}
            setProfileUser={setProfileUser}
          />
        )}
      </div>
    </div>
  );
}
