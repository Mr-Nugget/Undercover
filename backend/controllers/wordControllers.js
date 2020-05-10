const Word = require('../models/Words');

exports.countWords = (req, res, next) => {
    Word.countDocuments()
        .then((number) => {
            console.log(number);
            res.status(200).json({ number: number });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Error" });
        });
};

exports.getRandomWords = () => {
    Word.countDocuments()
        .then((number) => {
            var random = Math.floor(Math.random() * number)
            Word.findOne().skip(random)
                .then((word) => {
                    return word;
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
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
        secondWord: req.body['secondWord'],
        creator: req.body['username']
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