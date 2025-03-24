const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
res.send('Server is running');
});

let players = {};

io.on('connection', (socket) => {
console.log('A player connected:', socket.id);

players[socket.id] = { x: 300, y: 300, size: 20 };
socket.emit('currentPlayers', players);
socket.broadcast.emit('newPlayer', { id: socket.id, x: 300, y: 300, size: 20 });

socket.on('playerMove', (data) => {
players[socket.id].x = data.x;
players[socket.id].y = data.y;
io.emit('playerMoved', { id: socket.id, x: data.x, y: data.y });
});

socket.on('disconnect', () => {
console.log('Player disconnected:', socket.id);
delete players[socket.id];
io.emit('playerDisconnected', socket.id);
});
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
