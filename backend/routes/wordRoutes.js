const express = require('express');
const router = express.Router();

const WordController = require('../controllers/wordControllers');

router.get('/random', WordController.getRandomWords);

router.post('/add', WordController.createWord);

router.get('/count', WordController.countWords);

module.exports = router;