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
                    message: 'Users successfully founded'
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


router.get('/find/id/:id', (req, res, next) => {
    User.findOne({
        _id: req.params.id
    }, (err, user) => {
        if (user) {
            res.json({
                meta: {
                    success: true,
                    code: 200,
                    message: 'User successfully found'
                },
                data: {
                    user: user
                }
            });
        } else {
            res.json({
                meta: {
                    success: false,
                    code: 200,
                    message: 'No users with such id'
                },
                data: null
            });
        }
    });
});


module.exports = router;