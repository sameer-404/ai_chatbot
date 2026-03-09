const socket = io();
const btn = document.querySelector('#talk-btn');
const status = document.querySelector('#status');
const messages = document.querySelector('#messages');
const textInput = document.querySelector('#text-input');
const sendBtn = document.querySelector('#send-btn');

// Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

// When you click the mic button, start listening
btn.addEventListener('click', () => {
  recognition.start();
  status.textContent = '🎤 Listening...';
});

// When speech is recognized, send it to server
recognition.addEventListener('result', (e) => {
  const text = e.results[0][0].transcript;
  addMessage('You', text);
  socket.emit('chat message', text);
  status.textContent = '⏳ Waiting for reply...';
});

// When send button is clicked, send typed message
sendBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (!text) return;
  addMessage('You', text);
  socket.emit('chat message', text);
  textInput.value = '';
  status.textContent = '⏳ Waiting for reply...';
});

// Also send when pressing Enter
textInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});

// When server sends back a reply, speak it
socket.on('bot reply', (replyText) => {
  addMessage('Bot', replyText);
  synthVoice(replyText);
  status.textContent = '';
});

// Add message to chat window
function addMessage(sender, text) {
  const p = document.createElement('p');
  p.textContent = sender + ': ' + text;
  messages.appendChild(p);
}

// Speak the reply out loud
function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}