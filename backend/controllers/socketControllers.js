const Game = require("../models/Game");

/**
 * Find the game and control if it's still available
 */
exports.joinRoom = (gameId, playerName, io, socketId) => {
    Game.findById({ _id: gameId })
        .then((game) => {
            var playersList = game['players'];
            // Game is full
            if (playersList.length == game['playersNum']) {
                io.to(socketId).emit('error', { message: 'The game you want to join is full...' });
            }
            // Game is closed or in progress
            else if (game['status'] != 'open') {
                io.to(socketId).emit('error', { message: 'The game you want to join dot not exist anymore...' });
            }
            // Game is available : update players and emit to the others
            else {
                playersList.push(playerName);
                game['players'] = playersList;
                Game.updateOne({ _id: gameId }, { players: playersList })
                    .then(() => {
                        console.log("Update players success !");
                        io.sockets.in(gameId).emit('new-user', game);
                    })
                    .catch(() => console.error("Update players failed..."));
            }
        })
        // The game id is wrong
        .catch((error) => {
            console.error(error);
            io.to(socketId).emit('error', { message: 'The game you want to join do not exist...' });
        });
};

/**
 * Find the game and update the players list when a user leave and emit the new game object
 */
exports.leaveRoom = (gameId, playerName, io) => {
    Game.findById({ _id: gameId })
        .then((game) => {
            var playersList = game['players'];
            playersList.pop(playerName);
            game['players'] = playersList;

            // If the admin left, close the game
            if (playerName == game['admin']) {
                Game.updateOne({ _id: gameId }, { status: 'closed' })
                    .then(() => {
                        console.log("Update status success !");
                        io.sockets.in(gameId).emit('error', { message: "The admin leave the house :(" });
                    })
                    .catch(() => console.error("Update status failed..."));
            }
            // Else update players and emit to the others
            else {
                Game.updateOne({ _id: gameId }, { players: playersList })
                    .then(() => {
                        console.log("Update players success !");
                        io.sockets.in(gameId).emit('user-leave', game);
                    })
                    .catch(() => console.error("Update players failed..."));
            }
        })
        .catch((error) => {
            console.error(error);
        });
}