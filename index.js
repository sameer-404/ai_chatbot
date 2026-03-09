const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (text) => {
    console.log('Message from user:', text);

    // Simple AI reply for now
    const reply = getReply(text);
    socket.emit('bot reply', reply);
  });
});

function getReply(text) {
  text = text.toLowerCase();
  if (text.includes('hello') || text.includes('hi')) return 'Hey there! How can I help you?';
  if (text.includes('how are you')) return 'I am just a bot, but I am doing great!';
  if (text.includes('your name')) return 'I am your AI chatbot!';
  if (text.includes('bye')) return 'Goodbye! Have a great day!';
  return 'Interesting! Tell me more.';
}

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});