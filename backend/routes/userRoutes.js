const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userControllers');

router.post('/getByUsername', UserController.getUserByUsername);

router.post('/addUser', UserController.addUser);

router.get('/userExists/:username', UserController.userExists);

module.exports = router;