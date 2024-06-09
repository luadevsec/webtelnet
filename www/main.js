$(document).ready(function(){ 
  // Inicialize o terminal xterm.js
  const terminal = new Terminal();
  terminal.open(document.getElementById('terminal'));

  // Conecte-se ao servidor WebSocket
  const socket = io.connect();
  socket.on('connect', function() {
    console.log('Connected to server');
  });
  socket.on('disconnect', function() {
    console.log('Disconnected from server');
  });
  
  // Redirecione a entrada do terminal para o servidor Telnet
  terminal.onData(data => {
    socket.emit('stream', data);
  });

  // Exiba a saída recebida do servidor no terminal xterm.js
  socket.on('stream', function(data) {
    terminal.write(data);
  });

});
