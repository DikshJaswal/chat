import React, { useState, useEffect, useRef } from "react";
import "./ChatSection.css";
import { socket } from "../services/socket";

export default function ChatSection({ user, goBack, setProfileUser }) {
  // stores messages with the username in an array
  const [allMessages, setAllMessages] = useState({});
  const [input, setInput] = useState(""); //what are we typing in the present instance
  const inputRef = useRef(null); //brings focus on the field of input automatically
  const messagesEndRef = useRef(null);
  const currentMessages = allMessages[user.username] || [];

  // Auto-focus input whenever a new user chat opens
  useEffect(() => {
    inputRef.current?.focus();
  },[user]);

  //listen for incoming messages
  useEffect(() => {
    const handleMessage = (message) => {
      setAllMessages((prev) => ({
        ...prev,
        //here we update the allMessage state and add the new messages to the group w.r.t the sender name
        [message.sender]: [
          //access to the previous messages of the sender is allowed in here
          ...(prev[message.sender] || []),
          //we are setting a deafault format
          { sender: message.sender, text: message.text },
        ],
      }));
    };
  //links to the event chat message and calls handle message
    socket.on("chat message", handleMessage);
    
    //cleans the listner when the function re-renders
    return () => socket.off("chat message", handleMessage);
  }, []);
  
  
  useEffect(() => {
    //allows the autoscroll to the last message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  //shows the profile of the person you texting with
  const handleUsernameClick = () => {
    setProfileUser(user);
  };

  const handleSend = () => {
    if (!input.trim()) return;// prevent sending the empty lines
  
    // update your message locally
    setAllMessages((prev) => ({
      ...prev,
      [user.username]: [
        ...(prev[user.username] || []),
        { sender: "You", text: input },
      ],
    }));
  
    // Send to backend
    socket.emit("chat message", {
      to: user.username,
      text: input,
    });
  
    setInput("");//clear input field
  };
  

    // Optional simulated reply
    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [user.username]: [
          ...(prev[user.username] || []),
          { sender: user.username, text: `Reply: ${input}` },
        ],
      }));
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-section-container">
      <div className="chat-header">
        <button className="back-btn" onClick={goBack}>← Back</button>
        <h3>
          Chat with{" "}
          <span
            className="clickable-username"
            onClick={handleUsernameClick}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {user.username}
          </span>
        </h3>
      </div>
      <div className="chat-messages">
        {currentMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === "You" ? "sent" : "received"}`}
          >
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
