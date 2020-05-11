const express = require('express');
const router = express.Router();

const WordController = require('../controllers/wordControllers');

router.get('/random', WordController.getRandomWords);

router.post('/add', WordController.createWord);

router.get('/count', WordController.countWords);

router.get('/userWords/:username', WordController.getUserWords);

router.post('/checkWords', WordController.checkExists);

module.exports = router;