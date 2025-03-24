const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Replace with your Render server URL after deployment
const socket = io('https://your-render-app.onrender.com');

let players = {};
let myId;

// Player movement
let x = 300, y = 300;
let speed = 5;

document.addEventListener('keydown', (e) => {
if (e.key === 'ArrowUp') y -= speed;
if (e.key === 'ArrowDown') y += speed;
if (e.key === 'ArrowLeft') x -= speed;
if (e.key === 'ArrowRight') x += speed;
socket.emit('playerMove', { x, y });
});

// Socket events
socket.on('currentPlayers', (serverPlayers) => {
players = serverPlayers;
myId = socket.id;
});

socket.on('newPlayer', (player) => {
players[player.id] = player;
});

socket.on('playerMoved', (data) => {
players[data.id].x = data.x;
players[data.id].y = data.y;
});

socket.on('playerDisconnected', (id) => {
delete players[id];
});

// Game loop
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
for (let id in players) {
const p = players[id];
ctx.beginPath();
ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
ctx.fillStyle = id === myId ? 'blue' : 'red';
ctx.fill();
}
requestAnimationFrame(draw);
}
draw();

