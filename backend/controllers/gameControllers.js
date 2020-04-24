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

exports.updateStatusGame = (req, res, next) => {
    Game.updateOne({ _id: req.params.id }, {
            status: req.body['status']
        })
        .then(() => {
            res.status(200).json({ message: "Update status successfull !" });
            console.log('Update success !');
        })
        .catch((error) => res.status(400).json({ error: error }));
};

exports.updatePlayers = (req, res, next) => {
    Game.updateOne({ _id: req.params.id }, {
            players: req.body['players']
        })
        .then(() => {
            res.status(200).json({ message: "Update players successfull !" });
            console.log('Update success !');
        })
        .catch((error) => res.status(400).json({ error: error }));
};

exports.getById = (req, res, next) => {
    Game.findOne({ _id: req.params.id })
        .then(game => {
            res.status(200).json(game);
        })
        .catch((error) => res.status(404).json({ error }));
}