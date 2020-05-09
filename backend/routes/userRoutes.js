const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userControllers');

router.post('/getByUsername', UserController.getUserByUsername);

router.post('/addUser', UserController.addUser);

module.exports = router;