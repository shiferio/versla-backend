const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Store = require('../models/store');
const Good = require('../models/good');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwt.js');

router.get('/list/:pageNumber/:pageSize', (req, res, next) => {
    var pageNumber = parseInt(req.params.pageNumber);
    var pageSize = parseInt(req.params.pageSize);

    Good.find({}).skip(pageNumber > 0 ? ((pageNumber - 1) * pageSize) : 0).limit(
        pageSize).exec((err, goods) => {
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully get goods"
            },
            data: {
                goods: goods
            }
        });
    });
});

router.get('/:good_id', (req, res, next) => {
    Good.findOne({
        good_id: req.params.good_id
    }, (err, store) => {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get good"
                },
                data: {
                    good: store
                }
            });
        }
    });
});


router.route('/add').post(checkJWT, (req, res, next) => {
     User.findOne({
        _id: req.decoded.user._id,
    }, (err, user) => {
        if (user.isSeller) {
            Store.findOne({
                _id: req.body.store_id
            }, (err, store) => {
                if (store) {
                    if (store.creator_id === req.decoded.user._id) {
                        let good = new Good();
                        good.store_id = store._id;
                        good.creator_id = req.decoded.user._id;
                        good.price = req.body.price;
                        good.name = req.body.name;
                        good.picture = req.body.picture;
                        good.tags = req.body.tags;
                        good.type = req.body.type;
                        good.save();
                        res.json({
                            meta: {
                                code: 200,
                                success: true,
                                message: "Good successfully added"
                            },
                            data: {
                                good: good
                            }
                        });
                    }
                }
            });
        } else {
            res.json({
                meta: {
                    code: 403,
                    success: false,
                    message: "User isn't seller"
                },
                data: null
            });
        }
    });
});

router.route('/delete').delete(checkJWT, (req, res, next) => {
    Good.deleteOne({
        creator_id: req.decoded.user._id,
        good_id: req.body.good_id
    }, (err) => {
        if (err) {
            res.json({
                meta: {
                    code: 200,
                    success: false,
                    message: err.message
                },
                data: null
            });
        } else {
            res.json({
                meta: {
                    code: 200,
                    success: true,
                    message: "Good successfully deleted"
                },
                data: null
            });
        }
    });
});


module.exports = router;