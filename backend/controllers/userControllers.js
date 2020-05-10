const User = require('../models/User');
const jwt = require("jsonwebtoken");


exports.getUserByUsername = (req, res, next) => {
    const jwtExpirySeconds = "1h";
    const jwtKey = "nimvav94";
    User.findOne({ username: req.body['username'] })
        .then(user => {
            const password = req.body['password'];
            if(password != user.password || password == undefined || password == ''){
                res.status(400).json({error: "Password doesn't match"});
            }else{
                // Generate a new jwt authentification token to return to client
                const token = jwt.sign({username: user.username}, jwtKey, {
                    algorithm: "HS256",
                    expiresIn: jwtExpirySeconds,
                });
                console.log("token: ", token);
                res.status(200).json({user: user, token: token});
            }
        })
        .catch(() => {
            res.status(404).json({error: "User not found"});
        });
};

exports.addUser = (req, res, next) => {
    const newUser = new User({
        username : req.body['username'],
        password: req.body['password']
    });

    newUser.save(function (err, user){
        if(err){
            console.error("Error during user recording");
            res.status(400).json({ error: "Error during user recording" });
        }else{
            console.log("New user created with success");
            res.status(200).json({ message: "New user created with success !" });
        }
    });

};

exports.userExists = (req, res, next) => {
    User.findOne({ username: req.params.username })
        .then(user => {
            if(user != null){
                res.status(200).json({exist: true});
            }else{
                res.status(404).json({exist: false});
            }
            
        })
        .catch((err) =>{
            res.status(404).json({exist: false});
        });
};