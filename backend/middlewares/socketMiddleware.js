//here we will use the jwt auth for the socket.io verification
const cookie = require('cookie');
const jwt = require("jsonwebtoken");

// Authentication middleware
io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("No cookie provided"));
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication error: No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY || "123");
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});
