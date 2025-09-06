
import { io } from "socket.io-client";

//this enables the client side services for the socket.io
export const socket = io("http://localhost:5000", {
  withCredentials: true,  // important to send cookies
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
