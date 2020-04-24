var socket = require('socket.io');

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

            io.sockets.in(roomId).emit('new-user', { name: name });
        });
    });
}