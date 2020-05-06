const Game = require("../models/Game");
const Word = require("../models/Words");
const WordsTool = require("../tools/wordTools");

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
};

/**
 * Launch the game : send 'play' to redirect and then 'init-game' to send game info to client
 */
exports.launchGame = (gameId, name, io, socketId) => {
    console.log('Launching game on room: ' + gameId);

    // Emit to redirect
    io.sockets.in(gameId).emit('play');

    Game.findById({ _id: gameId })
        .then((game) => {
            Word.findOneRandom((err, result) => {
                if (!err) {
                    var clients = io.sockets.adapter.rooms[gameId].sockets;
                    var position = 0;
                    var words = WordsTool.selectRandomWord(result);
                    // Pick a random player position
                    var undercoverPosition = Math.floor(Math.random() * game['playersNum']);
                    for (var clientId in clients) {
                        // This is the socket of each client in the room.
                        var clientSocket = io.sockets.connected[clientId];
                        if(position == undercoverPosition){
                            clientSocket.emit('init-game', { players: game['players'],
                                                             position: position,
                                                             yourWord: words.undercoverWord,
                                                             undercoverPosition: undercoverPosition,
                                                             undercoverWord: words.undercoverWord,
                                                             normalWord: words.normalWord
                                                            });
                        }
                        else {
                            clientSocket.emit('init-game', { players: game['players'],
                                                             position: position,
                                                             yourWord: words.normalWord,
                                                             undercoverPosition: undercoverPosition,
                                                             undercoverWord: words.undercoverWord,
                                                             normalWord: words.normalWord
                                                            });
                        }

                        position++;
                    }
                } else {
                    console.log(error);
                }
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

/**
 * Broadcast a message to the others players of the room
 */
exports.broadcastMessage = (message, gameId, username, socket) => {
    socket.to(gameId).emit('message', { username: username, message: message });
};

/**
 * Next player event
 */
exports.nextPlayer = (gameId, word, counter, emitterName, io) => {
    var clients = io.sockets.adapter.rooms[gameId].sockets;
    var position = 0;
    var playersNum = Object.keys(clients).length;
    var positionOfEmitter = counter % playersNum;
    var positionOfNextPlayer = positionOfEmitter == (playersNum - 1) ? 0 : positionOfEmitter + 1;


    for (var clientId in clients) {
        // This is the socket of each client in the room.
        var clientSocket = io.sockets.connected[clientId];
        // If it's the emitter
        if (position == positionOfEmitter) {
            clientSocket.emit('next-player', { counter: counter + 1, nextPosition: positionOfNextPlayer });
        }
        // If it's the next player
        else if (position == positionOfNextPlayer) {
            clientSocket.emit('next-player', { emitterName: emitterName, word: word, isYourTurn: true, counter: counter + 1, nextPosition: positionOfNextPlayer });
        } else {
            clientSocket.emit('next-player', { emitterName: emitterName, word: word, isYourTurn: false, counter: counter + 1, nextPosition: positionOfNextPlayer });
        }
        position++;
        // End of word sending, let's go to the vote !
        if (counter == 3 * playersNum - 1) {
            io.sockets.in(gameId).emit('voteTime');
        }
    }
};

// Emit to the others players of the room a vote
exports.vote = (index, username, players, roomId, socket) => {
    socket.to(roomId).emit('vote', { index: index, players: players, username: username });
};

exports.endGame = (roomId, io) => {
    io.sockets.in(roomId).emit('end-game');
};