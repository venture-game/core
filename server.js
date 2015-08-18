"use strict";

var app = require('./app'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    spawn = require('child_process').spawn;

io.on('connection', function(socket){
    io.emit('event:connect', socket.id+' has connected!');
    console.log('user connected');

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('user logged in', function(msg) {
        console.log('user logged in: %s', msg);
    });
    socket.on('user logged out', function(msg) {
        console.log('user logged out');
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('- SERVER listening on *:3000');
    var AS = spawn('node', ['../account_service/service.js']);
    AS.stdout.pipe(process.stdout);
    AS.stderr.pipe(process.stderr);
});
