const mongoose = require('mongoose');
var random = require('mongoose-simple-random');

const wordSchema = mongoose.Schema({
    firstWord: { type: String, required: true },
    secondWord: { type: String, required: true }
});

wordSchema.plugin(random);

module.exports = mongoose.model('Word', wordSchema);