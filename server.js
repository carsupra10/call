const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New client connected: ', socket.id);

  socket.on('signal', (data) => {
    socket.broadcast.emit('signal', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
