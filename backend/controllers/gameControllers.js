const Game = require('../models/Game');

exports.createGame = (req, res, next) => {
    const newGame = new Game({
        playersNum: req.body['players'],
        admin: req.body['username'],
        players: [req.body['username']]
    });

    newGame.save(function(err, game) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            var gameId = game._id;
            var players = parseInt(game.playersNum, 10);
            var admin = game.admin;
            res.status(201).json({
                gameId: gameId,
                playersNum: players,
                admin: admin
            });
            console.log("Game object created with success !");
        }
    });
};