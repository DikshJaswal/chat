//here we will use the jwt auth for the socket.io verification

const jwt = require("jsonwebtoken");

io.use((socket, next) => {
    //the frontend use the token from the cookies and sends it here for verification
  const token = socket.handshake.auth.token; // frontend sends here
  if (!token) {
    return next(new Error("Authentication error: No token"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || "123");
    socket.user = decoded; // attach user info to socket
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});
