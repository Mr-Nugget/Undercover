const express = require('express');
const router = express.Router();

const WordController = require('../controllers/wordControllers');

router.get('/random', WordController.getRandomWordsAPI);

router.post('/add', WordController.createWord);

module.exports = router;