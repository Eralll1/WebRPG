import socketIOClient from "socket.io-client";


export const socket = socketIOClient("http://localhost:4000");