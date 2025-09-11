// middlewares/socketMiddleware.js
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const socketAuth = (socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) {
    return next(new Error("No cookie provided"));
  }

  const cookies = cookie.parse(cookieHeader);
  const token = cookies.token;

  if (!token) {
    return next(new Error("Authentication error: No token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || "xY7!kL9@qW3nR$sE5vG2#mP8&wZ6^tB1uN4oQcV7jX2%aF9");
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
};

module.exports = socketAuth;