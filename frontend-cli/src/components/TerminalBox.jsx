import React, { useState, useRef, useEffect } from "react";
import "./BoxStyles.css";
import { followUser, unfollowUser } from "../services/api";

export default function TerminalBox({
  setRightView,
  setProfileUser,
  setChatUser,
  users,
  dmUsers,
  onFollowToggle,
  currentUser,
  activeCommand,
  setActiveCommand,
}) {
  const [lines, setLines] = useState([
    "Welcome to ChatCLI!",
    'Type "help" to see available commands.'
  ]);
  const [input, setInput] = useState("");
  const terminalEndRef = useRef(null);

  const printCmd = (cmd, outputs = []) => {
    setLines((prev) => [...prev, `$ ${cmd}`, ...outputs]);
  };

  const commands = {
    help: () => [
      "ChatCLI commands:",
      "  help              Show this help",
      "  clear             Clear terminal",
      "  whoami            Show your profile",
      "  users             Open Users List (on right)",
      "  home              Open Home view (on right)",
      "  open <user>       Open a user's profile (left)",
      "  follow <user>     Follow a user",
      "  unfollow <user>   Unfollow a user",
      "  dm                Show DM list (right)",
      "  chat <user>       Open chat with a user in DM list (right)",
      "  logout            Log out and return to login page"
    ],

    clear: () => { setLines([]); return []; },

    whoami: () => [
      `@${currentUser?.username || "N/A"}`,
      `Bio: ${currentUser?.details?.bio || "N/A"}`,
      `Gender: ${currentUser?.details?.gender || "N/A"}`
    ],

    users: () => { setRightView("users"); return ["Switched to Users List view (right side)."]; },

    home: () => { setRightView("chat"); setProfileUser(null); return ["Switched to home view (right side)."]; },

    open: (args) => {
      if (!args.length) return ["Usage: open <username>"];
      const usernameInput = args[0].toLowerCase();
      const target = users.find(u => u.username.toLowerCase() === usernameInput);
      if (target) {
        setProfileUser(target);
        return [
          `Opened profile of @${target.username}`,
          `Bio: ${target.details?.bio || "N/A"}`,
          `Gender: ${target.details?.gender || "N/A"}`
        ];
      }
      return [`User not found: ${args[0]}`];
    },

    follow: async (args) => {
      if (!args.length) return ["Usage: follow <username>"];
      const usernameInput = args[0].toLowerCase();
      const targetUser = users.find(u => u.username.toLowerCase() === usernameInput);
      if (!targetUser) return [`User not found: ${args[0]}`];

      try {
        const res = await followUser(targetUser.username, currentUser._id);
        if (res.data.success) {
          onFollowToggle(targetUser.username, true);
          setActiveCommand(`follow ${targetUser.username}`);
          return [`You are now following @${targetUser.username}`];
        }
        return [`Error: ${res.data.message}`];
      } catch (err) {
        console.error("Follow API error:", err);
        return ["Error following user"];
      }
    },

    unfollow: async (args) => {
      if (!args.length) return ["Usage: unfollow <username>"];
      const usernameInput = args[0].toLowerCase();
      const targetUser = users.find(u => u.username.toLowerCase() === usernameInput);
      if (!targetUser) return [`User not found: ${args[0]}`];

      try {
        const res = await unfollowUser(targetUser.username, currentUser._id);
        if (res.data.success) {
          onFollowToggle(targetUser.username, false);
          setActiveCommand(`unfollow ${targetUser.username}`);
          return [`You have unfollowed @${targetUser.username}`];
        }
        return [`Error: ${res.data.message}`];
      } catch (err) {
        console.error("Unfollow API error:", err);
        return ["Error unfollowing user"];
      }
    },

    dm: () => { setChatUser(null); setRightView("dm"); return ["Opened DM List on the right panel."]; },

    chat: (args) => {
      if (!args.length) return ["Usage: chat <username>"];
      const usernameInput = args[0].toLowerCase();
      const user = dmUsers.find(u => u.username.toLowerCase() === usernameInput);
      if (!user) return [`Error: ${args[0]} is not in your DM list.`];

      setChatUser(user);
      setRightView("dm");
      setProfileUser(user);
      return [`Opening chat with ${user.username}... (input is focused)`];
    },
  };

  const handleCommand = (rawCmd) => {
    const tokens = rawCmd.trim().split(/\s+/);
    if (!tokens.length) return;

    const command = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    if (commands[command]) {
      const out = commands[command](args);
      if (out instanceof Promise) out.then(res => printCmd(rawCmd, res));
      else printCmd(rawCmd, Array.isArray(out) ? out : [String(out)]);
    } else {
      printCmd(rawCmd, [`Unknown command: ${command}`, 'Type "help" for list.']);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  };

  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  return (
    <div className="section terminal-box">
      <div className="terminal-header">
        <div className="terminal-lights">
          <div className="light red"></div>
          <div className="light yellow"></div>
          <div className="light green"></div>
        </div>
        <div className="terminal-title">CHAT-CLI TERMINAL</div>
      </div>

      <div className="terminal-output">
        <div className="output-content">
          {lines.map((line, i) => (
            <div className="line" key={i}>
              <span className="line-prefix">{i > 1 ? ">" : ""}</span>
              {line}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      <form className="terminal-input" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <span className="prompt">system&gt;</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            aria-label="terminal-input"
            className="terminal-cursor"
          />
        </div>
      </form>
    </div>
  );
}
