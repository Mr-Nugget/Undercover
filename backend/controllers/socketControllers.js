const Game = require("../models/Game");

exports.joinRoom = (gameId, playerName, io) => {
    Game.findById({ _id: gameId })
        .then((game) => {
            var playersList = game['players'];
            playersList.push(playerName);
            game['players'] = playersList;
            Game.updateOne({ _id: gameId }, { players: playersList })
                .then(() => {
                    console.log("Update players success !");
                    io.sockets.in(gameId).emit('new-user', game);
                })
                .catch(() => console.error("Update players failed..."));
        })
        .catch((error) => {
            console.error(error);
        })
};