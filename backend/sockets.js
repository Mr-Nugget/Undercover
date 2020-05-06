var socket = require('socket.io');
var socketControllers = require('./controllers/socketControllers');

module.exports.listen = function(server) {
    var io = socket.listen(server);

    io.on('connection', (socket) => {
        var roomId = null;
        var name = null;

        socket.on('room', (room) => {
            roomId = room;
            socket.join(room);
        });

        socket.on('new-user', (data) => {
            name = data['name'];

            socketControllers.joinRoom(roomId, name, io, socket.id);
        });

        socket.on('play', () => {
            socketControllers.launchGame(roomId, name, io, socket.id);
        });

        socket.on('next-player', (data) => {
            socketControllers.nextPlayer(roomId, data['word'], data['counter'], data['username'], io);
        });

        socket.on('message', (data) => {
            socketControllers.broadcastMessage(data['message'], roomId, name, socket);
        });

        socket.on('vote', (data) => {
            socketControllers.vote(data['index'], data['username'], data['players'], roomId, socket);
        });

        socket.on('end-game', () => {
            socketControllers.endGame(roomId, io);
        });

        socket.on('disconnect', () => {
            socket.leave(roomId);

            socketControllers.leaveRoom(roomId, name, io);
        });
    });
}