const Word = require('../models/Words');


exports.getRandomWords = () => {
    Word.findOneRandom((err, result) => {
        if (!err) {
            return result;
        } else {
            console.log(err);
            return null;
        }
    });
};

exports.getRandomWordsAPI = (req, res, next) => {
    Word.findOneRandom((err, result) => {
        if (!err) {
            res.status(200).json(result);
        } else {
            console.log(err);
            res.status(404).json({ error: "Cannot get random word..." });
        }
    });
};

exports.createWord = (req, res, next) => {
    const newWord = new Word({
        firstWord: req.body['firstWord'],
        secondWord: req.body['secondWord']
    });

    newWord.save(function(err, game) {
        if (!err) {
            res.status(201).json({ message: 'Sucess !' });
        } else {
            res.status(400).json({ error: 'Error' });
            console.log(err);
        }
    });
}