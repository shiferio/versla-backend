const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Store = require('../models/store');

const config = require('../config');
const checkJWT = require('../middlewares/check-jwt.js');

/**
 * @api {post} /api/accounts/signup User SignUp
 * @apiName SignUp
 * @apiGroup Accounts
 *
 * @apiParam {String} login
 * @apiParam {String} password
 * @apiParam {String} email
 * @apiParam {String} phone
 *
 * @apiSuccess {String} token Security token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "You are successfully logined"
 *     },
 *     data: {
 *      "token": "token"
 *     }
 */

router.post('/signup', (req, res, next) => {
    let user = new User();
    user.login = req.body.login;
    user.password = req.body.password;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.picture = user.gravatar();

    User.findOne({
        email: req.body.email
    }, (err, existingUser) => {
        if (existingUser) {
            res.json({
                meta: {
                    success: false,
                    code: 503,
                    message: 'Account with that email is already exists'
                },
                data: null
            });
        } else {
            user.save();
            var token = jwt.sign({
                user: user
            }, config.secret, {
                expiresIn: '360d'
            });

            res.json({
                meta: {
                    success: true,
                    code: 200,
                    message: 'You are successfully logined'
                },
                data: {
                    token: token
                }
            });
        }
    });
});

/**
 * @api {post} /api/accounts/login User authorization
 * @apiName Login
 * @apiGroup Accounts
 *
 * @apiParam {String} email
 * @apiParam {String} password
 *
 * @apiSuccess {String} token Security token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "You are successfully logined"
 *     },
 *     data: {
 *      "token": "token"
 *     }
 */
router.post('/login', (req, res, next) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) throw err;
        console.log(req.body.email);
        console.log(user)
        if (!user) {
            res.json({
                meta: {
                    success: false,
                    code: 503,
                    message: 'Authentification failed. User not found'
                },
                data: null
            });
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    meta: {
                        success: false,
                        code: 503,
                        message: 'Authentification failed. Wrong password.'
                    },
                    data: null
                });
            } else {
                var token = jwt.sign({
                    user: user
                }, config.secret, {
                    expiresIn: '7d'
                });
                res.json({
                    meta: {
                        success: true,
                        code: 200,
                        message: 'You are successfully logined'
                    },
                    data: {
                        token: token
                    }
                });
            }
        }
    });
});

/**
 * @api {get} /api/accounts/profile Get user profile
 * @apiName Get Profile
 * @apiGroup Accounts
 *
 * @apiHeader {token} User token
 *
 * @apiSuccess {Object} user User profile
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Successfully get your profile"
 *     },
 *     data: {
 *      "user": {
 *			"address": {
 *				"addr1": "Street 1",
 *				"addr2": "Street",
 *				"city": "Kirov",
 *				"country": "Russia",
 *				"postalCode": "610000"
 *			},
 *			"isSeller": true,
 *			"_id": "5b137f7e57d4fe093f5b51f3",
 *			"created": "2018-06-03T05:41:18.798Z",
 *			"login": "denis",
 *			"password": "$2a$10$/MsH1M3s/5GzRM2A60f0R.DXx7BhWPerNbMWPgqJtX76bm27EARji",
 *			"email": "dl@progears.ru",
 *			"picture": "http://images.versla.ru/files/7f847a561a88046a59989dc394e6efef91e8bb56bf43ed04a342b2f8ec16fbad.jpeg",
 *			"__v": 0,
 *			"first_name": "Denis",
 *			"last_name": "Lubyannikov",
 *			"phone": "9991008820"
 *		}
 *     }
 */
router.route('/profile').get(checkJWT, (req, res, next) => {
    User.findOne({
        _id: req.decoded.user._id
    }, (err, user) => {
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully get your profile"
            },
            data: {
                user: user
            }
        });
    });
}).post(checkJWT, (req, res, next) => {
    User.findOne({
        _id: req.decoded.user._id
    }, (err, user) => {
        if (err) return next(err);
        if (req.body.first_name) user.first_name = req.body.first_name;
        if (req.body.last_name) user.last_name = req.body.last_name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.phone) user.phone = req.body.phone;

        user.save();
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully updated your profile"
            },
            data: null
        });
    });
});

router.route('/profile/security').put(checkJWT, (req, res, next) => {
    User.findOne({
        _id: req.decoded.user._id
    }, (err, user) => {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        }
        if (req.body.password) {
            if (req.body.old_password) {
                if (req.body.confirmation_password) {
                    if (req.body.confirmation_password === req.body.password) {
                        if (user.comparePassword(req.body.old_password)) {
                            user.password = req.body.password;
                            user.save();
                            res.json({
                                meta: {
                                    code: 200,
                                    success: true,
                                    message: "Successfully updated your password"
                                },
                                data: null
                            });
                        } else {
                            res.json({
                                meta: {
                                    code: 200,
                                    success: false,
                                    message: "Old password wrong"
                                },
                                data: null
                            });
                        }
                    }
                }
            }
        }
    });
});

router.route('/profile/address').put(checkJWT, (req, res, next) => {
    User.findOne({
        _id: req.decoded.user._id
    }, (err, user) => {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        }

        user.address.addr1 = req.body.addr1;
        user.address.addr2 = req.body.addr2;
        user.address.city = req.body.city;
        user.address.country = req.body.country;
        user.address.postalCode = req.body.postalCode;

        user.save();
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully updated your address"
            },
            data: null
        });
    });
});

router.route('/profile/avatar').put(checkJWT, (req, res, next) => {
    User.findOne({
        _id: req.decoded.user._id
    }, (err, user) => {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        }

        user.picture = req.body.picture;

        user.save();
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully updated your avatar"
            },
            data: null
        });
    });
});

router.route('/address').get(checkJWT, (req, res, next) => {
    User.findOne({
        _id: req.decoded.user._id
    }, (err, user) => {
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully get your address"
            },
            data: {
                address: user.address
            }
        });

    });
}).post(checkJWT, (req, res, next) => {
    User.findOne({
        _id: req.decoded.user._id
    }, (err, user) => {
        if (err) return next(err);

        if (req.body.addr1) user.address.addr1 = req.body.addr1;
        if (req.body.addr2) user.address.addr2 = req.body.addr2;
        if (req.body.city) user.address.city = req.body.city;
        if (req.body.state) user.address.state = req.body.state;
        if (req.body.country) user.address.country = req.body.country;
        if (req.body.postalCode) user.address.postalCode = req.body.postalCode;

        user.save();
        res.json({
            meta: {
                code: 200,
                success: true,
                message: 'Successfully updated your address'
            },
            data: null
        });
    });
});

router.route('/stores').get(checkJWT, (req, res, next) => {
    Store.find({
        creator_id: req.decoded.user._id
    }, (err, stores) => {
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully get your stores"
            },
            data: {
                stores: stores
            }
        });
    });
});

module.exports = router;