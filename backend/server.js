const express = require('express');
//this is the cross origin resource sharing for smooth data transfer
const cors = require('cors');
require('dotenv').config();
//allows to create http server manually 
const { createServer } = require("node:http");
const { Server } = require("socket.io"); // this is socket.io's Server

//allows to join several paths in a single segment
const { join } = require('node:path');

const connectDB = require('./config/config');


const port = process.env.PORT || 5000;
const app = express(); //creating an express instance
//wraps express inside the http server and allows to attach extra functions
const server = createServer(app);


//middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

//routes
app.use('/api', require('./routes/loginRoute'));
app.use('/api', require('./routes/registerRoute'));
app.use('/api', require('./routes/profileRoute'));
app.use('/api', require('./routes/logoutRoute'));

app.get('/', (req, res) => {
    res.send('backend is running');
});


//socket.io 
//create the socket.io instance , unique for each user
const io = new Server(server,{
    //it enables restoration of rooms and any missed events when the connection is disrupted
    //its a temporary act
    connectionStateRecovery: {}
  });

// we are setting up a listner to the event where client connects to socket.io server and if 
//this is passed successfully then we get access to the socket.io objects & methods
io.on('connect', (socket) => {
    console.log('user connected',socket.user.email);
    // here we print the message from the client
    socket.on('chat message', (msg) => {
        const messageData={
            sender: socket.user.username, // from JWT payload
            text: msg.text,
            to: msg.to, // if doing private chats
        }
        //send msg to everyone accept the sender
        socket.broadcast.emit('chat message',messageData);
    });
    socket.on('disconnect',()=>{
        console.log('User disconnected',socket.user.email);
    });
});



connectDB().then(() => {
    server.listen(port, () => {
        console.log(`server is running on port : ${port}`);
    })
})
