import { io } from "socket.io-client";

const token = localStorage.getItem("token"); // or however you store it

export const socket = io("http://localhost:5000", {
  auth: {
    token: token,
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
