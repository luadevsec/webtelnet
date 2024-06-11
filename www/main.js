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

  // Exiba a saída recebida do servidor no terminal xterm.js
  socket.on('stream', function(data) {
    terminal.write(data);
    console.log(data);
  });

  // Redirecione a entrada do terminal para o servidor Telnet
  terminal.onData(data => {
    socket.emit('stream', data);
  });

  function filterProblematicANSI(data) {
    const ansiRegex = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -\/]*[@-~])/g;

    // Substituir os caracteres ANSI por uma string vazia
    return data.replace(ansiRegex, '');
}
function filterInvalidUTF8(data) {
  const utf8Regex = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}|[\xF8-\xFB][\x80-\xBF]{4}|[\xFC-\xFD][\x80-\xBF]{5}|[\xFE-\xFE][\x80-\xBF]{6}|[\x00-\x7F]|[\xC2-\xDF][\x00-\xBF]|[\xE0-\xEF][\x80-\xBF]|\xEF[\xBC][\x80-\xBF]|\xEF[\xBE][\x80-\xBF]/g;

  // Substituir os caracteres inválidos UTF-8 por uma string vazia
  return data.replace(utf8Regex, '');
}
});
