
import { io } from "socket.io-client";

//this enables the client side services for the socket.io
export const socket = io("http://localhost:4500", {
  withCredentials: true,  // important to send cookies
});
