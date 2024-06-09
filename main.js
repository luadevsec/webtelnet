#!/usr/bin/env node

'use strict';

var info = require('./package.json');

var path = require('path'),
    socketio = require('socket.io'),
    express = require('express'),
    http = require('http'),
    webtelnet = require('./webtelnet-proxy.js');

// Inicialize a configuração do servidor
var conf = {
  telnet: {
    host: '127.0.0.1',
    port: 23,
  },
  web: {
    host: '0.0.0.0',
    port: 8080,
  },
  www: path.resolve(__dirname + '/www'),
  logTraffic: true,
};

// Processamento dos argumentos da linha de comando
var argv = process.argv;
var args = require('minimist')(argv.slice(2));

// Verificação da sintaxe da linha de comando
if(args._.length < 2) {
  process.stdout.write(
    'Syntax: webtelnet <http-port> <telnet-port> [options]\n' +
    'Options: \n' +
    '    [-h <telnet-host>]\n' +
    '    [-w <path/to/www>]\n' +
    '    [-c <charset>]\n'
  );
  process.exit(0);
}

// Configuração das portas do servidor
conf.web.port = parseInt(args._[0], 10);
conf.telnet.port = parseInt(args._[1], 10);

// Definição do host do servidor Telnet
if(args.h) conf.telnet.host = args.h;
// Definição do diretório www
if(args.w) conf.www = path.resolve(args.w);

// Configuração do aplicativo Express
var app = express().use(express.static(conf.www));
var httpserver = http.createServer(app);

// Inicialização do servidor HTTP
httpserver.listen(conf.web.port, conf.web.host, function(){
  console.log('listening on ' + conf.web.host + ':' + conf.web.port);
});

// Criação do servidor de WebSocket
var io = socketio.listen(httpserver);

// Criação do proxy WebTelnet e associação ao WebSocket
var webtelnetd = webtelnet(io, conf.telnet.port, conf.telnet.host);
if(args.c) webtelnetd.setCharset(args.c);
