// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    users[socket.id] = name;
    io.emit('updateUserList', Object.values(users));
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('updateUserList', Object.values(users));
  });

  socket.on('voice', (data) => {
    socket.broadcast.emit('voice', data);
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
