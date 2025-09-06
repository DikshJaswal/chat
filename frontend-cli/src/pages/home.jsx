//  Chat UI component (separated from main App router)
import TerminalBox from "../components/TerminalBox";
import ProfileBox from "../components/ProfileBox";
import ChatBox from "../components/ChatBox";
import UsersListBox from "../components/UserListBox";
import OpenedProfileBox from "../components/OpenedProfileBox";
import DMList from "../components/DMList";
import ChatSection from "../components/ChatSection";

//react
import { useState,useEffect } from "react";
import API from "../services/api";
//css
import "../components/BoxStyles.css";
import "../components/UsersListBox.css";
import "../components/DMList.css";

 export default function ChatUI() {


    const [rightView, setRightView] = useState("chat");
    const [currentUser, setCurrentUser] = useState("");
    const [profileUser, setProfileUser] = useState(null);
    const [chatUser, setChatUser] = useState(null);
  
    const [dmUsers, setDmUsers] = useState([]);
    const [users, setUsers] = useState([
      {
        username: "alice",
        gender: "Female",
        bio: "Explorer of cyber worlds",
        joinDate: "01/05/2024",
        isOnline: true,
        followers: 2,
        following: 1,
        isFollowing: false,
      },
      {
        username: "bob",
        gender: "Male",
        bio: "Defender of firewalls",
        joinDate: "12/03/2024",
        isOnline: true,
        followers: 5,
        following: 3,
        isFollowing: false,
      },
      {
        username: "charlie",
        gender: "Male",
        bio: "Debugger of chaos",
        joinDate: "22/06/2024",
        isOnline: false,
        followers: 1,
        following: 2,
        isFollowing: false,
      },
      {
        username: "neo_coder",
        gender: "Male",
        bio: "Hacking the matrix one line at a time",
        joinDate: "15/08/2025",
        isOnline: true,
        followers: 10,
        following: 4,
        isFollowing: false,
      },
    ]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.get('/api/userprofile');
        
        if (response.data.success) {
          // Extract only the needed data, not the whole object
          const userData = {
            username: response.data.user.username,
            gender: response.data.user.details?.gender,
            bio: response.data.user.details?.bio
          };
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Fallback to localStorage data if API fails
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) {
          setCurrentUser({
            username: localUser.username,
            gender: localUser.details?.gender,
            bio: localUser.details?.bio
          });
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
    //  Toggle follow/unfollow
    const handleFollowToggle = (username, follow) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.username === username
            ? {
                ...user,
                followers: follow
                  ? user.followers + 1
                  : Math.max(user.followers - 1, 0),
                isFollowing: follow,
              }
            : user
        )
      );
  
      if (profileUser?.username === username) {
        setProfileUser((prev) => ({
          ...prev,
          followers: follow
            ? prev.followers + 1
            : Math.max(prev.followers - 1, 0),
          isFollowing: follow,
        }));
      }
  
      if (follow) {
        const userToAdd = users.find((u) => u.username === username);
        if (userToAdd && !dmUsers.some((u) => u.username === username)) {
          setDmUsers((prev) => [...prev, userToAdd]);
        }
      }
    };
    
    if (loading) {
      return <div className="app">Loading user data...</div>;
    }
  
    return (
      <div className="app">
        {/* Left Section */}
        <div className="left-container">
          {profileUser ? (
            <OpenedProfileBox
              user={profileUser}
              onFollowToggle={handleFollowToggle}
              setActiveUser={setProfileUser}
            />
          ) : (
            <ProfileBox
              username={currentUser?.username || "neo_coder"}
              gender={currentUser?.details?.gender || "Male"}
              bio={currentUser?.details?.bio || "No bio set"}
              joinDate={new Date().toLocaleDateString()}
              isOnline={true}
  
  
            />
          )}
  
          <TerminalBox
            setRightView={setRightView}
            setProfileUser={setProfileUser}
            setChatUser={setChatUser}
            users={users}
            onFollowToggle={handleFollowToggle}
            dmUsers={dmUsers}
  
         
  
          />
        </div>
  
        {/* Right Section */}
        <div className="right-container">
          {rightView === "chat" && <ChatBox />}
  
          {rightView === "users" && (
            <UsersListBox users={users.map((u) => u.username)} />
          )}
  
          {rightView === "dm" && !chatUser && (
            <DMList
              dmUsers={dmUsers}
              openChatWithUser={(user) => {
                setChatUser(user);
                setRightView("dm");
              }}
            />
          )}
  
          {chatUser && rightView === "dm" && (
            <ChatSection user={chatUser} goBack={() => setChatUser(null)}
            setProfileUser={setProfileUser}
            />
          )}
        </div>
      </div>
    );
  }