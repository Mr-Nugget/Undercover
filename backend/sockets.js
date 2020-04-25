var socket = require('socket.io');
var socketControllers = require('./controllers/socketControllers');

module.exports.listen = function(server) {
    var io = socket.listen(server);

    io.on('connection', (socket) => {
        socket.on('room', (room) => {
            socket.join(room);
        });

        socket.on('new-user', (data) => {
            const roomId = data['roomId'];
            const name = data['name'];
            console.log(name + ' join the channel : ' + roomId);

            socketControllers.joinRoom(roomId, name, io, socket.id);
        });
    });
}