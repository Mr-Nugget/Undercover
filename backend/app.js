const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const gameRoutes = require('./routes/gameRoutes');
const wordRoutes = require('./routes/wordRoutes');



const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

mongoose.connect('mongodb+srv://mrnugget:nimvav94@test-c7tyh.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB connection successfull"))
    .catch(() => console.log("DB connection failed"));

app.use(bodyParser.json());

app.use('/game', gameRoutes);

app.use('/word', wordRoutes);

module.exports = app;