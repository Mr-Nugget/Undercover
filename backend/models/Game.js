const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    playersNum: { type: Number, required: true },
    admin: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    players: { type: [String], required: true },
    status: { type: String, default: 'open', required: true }
});

module.exports = mongoose.model('Game', gameSchema);