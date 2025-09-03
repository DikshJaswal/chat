import React, { useState, useEffect, useRef } from "react";
import "./ChatSection.css";

export default function ChatSection({ user, goBack, setProfileUser }) {
  const [allMessages, setAllMessages] = useState({});
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null); 
  const currentMessages = allMessages[user.username] || []; 

  // Auto-focus input whenever a new user chat opens
  useEffect(() => {
    inputRef.current?.focus();
  }, [user]); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleUsernameClick = () => {
    setProfileUser(user); 
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setAllMessages((prev) => ({
      ...prev,
      [user.username]: [
        ...(prev[user.username] || []),
        { sender: "You", text: input },
      ],
    }));
    setInput("");

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
            style={{cursor: 'pointer', textDecoration: 'underline'}}
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
