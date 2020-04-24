const app = require('./app');


app.set('port', process.env.PORT || 3000);

const server = app.listen(3000);

var io = require('socket.io').listen(server);

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