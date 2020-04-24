const express = require('express');
const router = express.Router();

const GameController = require('../controllers/gameControllers');

router.post('/create', GameController.createGame);

router.put('/updateStatus/:id', GameController.updateStatusGame);

router.put('/updatePlayers/:id', GameController.updatePlayers);

router.get('/getById/:id', GameController.getById);

module.exports = router;