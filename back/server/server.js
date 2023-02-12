const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = `C:/Users/user/Desktop/ps8-2023-triple-a/front/playOneVsOne`;

console.log(`serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (sock) => {
  sock.on('message', (text) => io.emit('message', text));
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('server IS READY');
});
