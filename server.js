var app = require('./app').client;
var http = require('http').Server(app);
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
    console.log('server listening on *:3000');
});
