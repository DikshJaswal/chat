// middlewares/socketMiddleware.js
const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: No token"));
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY || "123");
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Authentication error"));
  }
};

module.exports = socketAuth;
