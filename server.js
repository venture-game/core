var client = require('../client/index').client;
var http = require('http').Server(client);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    io.emit('event:connect', socket.id+' has connected!');

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});