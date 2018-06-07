const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Store = require('../models/store');

const config = require('../config');
const checkJWT = require('../middlewares/check-jwt.js');


router.post('/find', (req, res, next) => {
    User.find({
        login: req.body.login
    }, (err, users) => {
        if (users) {
            res.json({
                meta: {
                    success: true,
                    code: 200,
                    message: 'Account with that email is already exists'
                },
                data: {
                    users: users
                }
            });
        } else {
            res.json({
                meta: {
                    success: false,
                    code: 200,
                    message: 'No users with such name'
                },
                data: null
            });
        }
    });
});


module.exports = router;