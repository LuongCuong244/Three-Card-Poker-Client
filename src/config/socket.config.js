import { io } from "socket.io-client";

const socket = io('http://192.168.0.102:3000');

module.exports = socket;