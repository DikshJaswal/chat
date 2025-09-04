//here we will use the jwt auth for the socket.io verification
const cookie = require('cookie');
const jwt = require("jsonwebtoken");

io.use((socket, next) => {

    try {
        //the frontend use the token from the cookies and sends it here for verification
        if(!socket.handshake.headers.cookie){
            return next(new Error('No cookie found'));
        }
        const cookies=cookie.parse(socket.handshake.headers.cookie);
        const token = cookies.token; //jwt stored in token
        // frontend sends here
        if (!token) {
            return next(new Error("Authentication error: No token"));
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY || "123");
        socket.user = decoded; // attach user info to socket
        next();
    } catch (err) {
        next(new Error("Authentication error: Invalid token"));
    }
});
