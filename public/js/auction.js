const toggleButton = document.querySelector('.dark-light');
const colors = document.querySelectorAll('.color');


colors.forEach(color => {
  color.addEventListener('click', e => {
    colors.forEach(c => c.classList.remove('selected'));
    const theme = color.getAttribute('data-color');
    document.body.setAttribute('data-theme', theme);
    color.classList.add('selected');
  });
});

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
const urlSearchParams = new URLSearchParams(window.location.search);
const roomId = urlSearchParams.get('id')
var socket = io();
socket.emit('joinRoom', roomId);
socket.on('joinRoom', (message) => {
  console.log(message);
});
function appendincomingChatMessage(text) {
  const chatContainer = document.getElementById('chat-container');
  const newChatMsg = document.createElement('div');
  newChatMsg.className = 'chat-msg';
  newChatMsg.innerHTML = `
      <div class="chat-msg-profile">
          <img class="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
      </div>
      <div class="chat-msg-content">
          <div class="chat-msg-text">${text}</div>
      </div>
  `;
  chatContainer.appendChild(newChatMsg);
}
socket.on('chatMessage', (message) => {
// recieving socket messages from server
  if (!message.isOwner)
  {
    console.log('yes');
    appendincomingChatMessage(message.text)
  }
  
});
const sendButton = document.getElementById('chat-message');
const messageInput = document.getElementById('chat-message');
// const disconnectTime = 20000;
// const disconnectTimer = setInterval(() => {
//   socket.disconnect();
// }, disconnectTime);
function appendownerMessageToChatContainer(text) {
  const chatContainer = document.getElementById('chat-container');
  const newChatMsg = document.createElement('div');
  newChatMsg.className = 'chat-msg owner';

  newChatMsg.innerHTML = `
      <div class="chat-msg-profile">
          <img class="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png"
              alt="" />
      </div>
      <div class="chat-msg-content">
          <div class="chat-msg-text">${text}</div>
         
  `;
  chatContainer.appendChild(newChatMsg);
}

sendButton.addEventListener('keypress', function (event) {
  
  if (event.key == 'Enter')
  {
    const message = messageInput.value;
    appendownerMessageToChatContainer(message)
    socket.emit('chatMessage', message);
    
    messageInput.value = '';
  }
  
  
});

socket.on('disconnect', () => {
});