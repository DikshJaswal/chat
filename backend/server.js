const express = require('express');
const cors = require('cors');
require('dotenv').config({ debug: true });
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const connectDB = require('./config/config');
const socketAuth = require("./middlewares/socketMiddleware"); // ✅ import
const cookieParser=require("cookie-parser");


const port = process.env.PORT || 5000;
const app = express();
const server = createServer(app);
const followRoutes = require("./routes/follow");

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true, //allows the cokie exchange
}));

// routes
app.use('/api', require('./routes/loginRoute'));
app.use('/api', require('./routes/registerRoute'));
app.use('/api', require('./routes/profileRoute'));
app.use('/api', require('./routes/logoutRoute'));
app.use('/api', require('./routes/userListRoute')); // ✅ fixed missing slash
app.use("/api", followRoutes);

app.get('/', (req, res) => {
    res.send('backend is running');
});

// socket.io instance
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
    connectionStateRecovery: {}
});

//  apply auth middleware *after io is created*
io.use(socketAuth);
// server.js
io.on("connection", (socket) => {
    console.log("User connected:", socket.user.email);
  
    socket.on("chat message", (msg) => {
      const messageData = {
        sender: socket.user.username, //  Trust backend, not frontend
        text: msg.text,
        to: msg.to,
      };
      socket.broadcast.emit("chat message", messageData);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.email);
    });
  });

// start server
connectDB().then(() => {
    server.listen(port, () => {
        console.log(`server is running on port : ${port}`);
    });
});
