const express = require('express');
const router = express.Router();

const GameController = require('../controllers/gameControllers');

router.post('/create', GameController.createGame);

module.exports = router;