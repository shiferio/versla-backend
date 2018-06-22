const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Store = require('../models/store');
const Good = require('../models/good');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwt.js');
const mongoose = require('mongoose');
const dbGoods = require('../utils/db/db.goods');

/**
 * @api {get} /api/goods/list/:pageNumber/:pageSize List all goods
 * @apiName List Goods
 * @apiGroup Goods
 *
 * @apiParam {Number} pageNumber Page Number.
 * @apiParam {Number} pageSize Page Size
 *
 * @apiSuccess {Object} goods Array of goods
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Successfully get goods"
 *     },
 *     data: {
 *      "goods": []
 *     }
 */
router.get('/list/:pageNumber/:pageSize', (req, res, next) => {
    let pageNumber = parseInt(req.params.pageNumber);
    let pageSize = parseInt(req.params.pageSize);

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

/**
 * @api {get} /api/goods/:id Get good info
 * @apiName Get good info
 * @apiGroup Goods
 *
 * @apiParam {Number} id Id of Good
 *
 * @apiSuccess {Object} Good
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Successfully get good"
 *     },
 *     data: {
 *      "goods": good
 *     }
 */
router.get('/:good_id', (req, res, next) => {
    Good.findOne({
        good_id: req.params.good_id
    }, (err, good) => {
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
                    good: good
                }
            });
        }
    });
});

/**
 * @api {post} /api/goods/add Add good
 * @apiName Add good
 * @apiGroup Goods
 *
 * @apiParam {String} store_id Good store id
 * @apiParam {String} name Good name
 * @apiParam {Number} price Good price
 * @apiParam {String} picture Good picture
 * @apiParam {Object} tags Good tags
 * @apiParam {String} type Good type
 *
 * @apiSuccess {Object} Good
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Good successfully added"
 *     },
 *     data: {
 *      "goods": good
 *     }
 */
router.route('/add').post(checkJWT, async (req, res, next) => {
     User.findOne({
        _id: req.decoded.user._id,
    }, (err, user) => {
        if (user.isSeller) {
            Store.findOne({
                _id: req.body.store_id
            }, async (err, store) => {
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
                        await good.save();

                        let newgood = await Good.findOne().where("_id").in(good._id).exec();

                        if (newgood) {
                            res.json({
                                meta: {
                                    code: 200,
                                    success: true,
                                    message: "Good successfully added"
                                },
                                data: {
                                    good: newgood
                                }
                            });
                        } else {
                            res.json({
                                meta: {
                                    success: false,
                                    code: 200,
                                    message: 'FATAL ERROR'
                                },
                                data: null
                            });
                        }
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

/**
 * @api {delete} /api/goods/delete Delete good
 * @apiName Delete good
 * @apiGroup Goods
 *
 * @apiParam {Number} good_id Good store id
 *
 * @apiSuccess {Object} Good
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Good successfully deleted"
 *     },
 *     data: {
 *      "good": null
 *     }
 */
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

router.route('/update/name').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        good_id: req.body.good_id
    }, {
        $set: {
            name: req.body.name
        }
    }, {new: true}, function (err, good) {
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
                    message: "Store successfully updated"
                },
                data: {
                    good: good
                }
            });
        }
    });
});

router.route('/update/price').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        good_id: req.body.good_id
    }, {
        $set: {
            price: req.body.price
        }
    }, {new: true}, function (err, good) {
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
                    message: "Store successfully updated"
                },
                data: {
                    good: good
                }
            });
        }
    });
});


router.route('/update/description').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        good_id: req.body.good_id
    }, {
        $set: {
            description: req.body.description
        }
    }, {new: true}, function (err, good) {
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
                    message: "Store successfully updated"
                },
                data: {
                    good: good
                }
            });
        }
    });
});

router.route('/update/short_description').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        good_id: req.body.good_id
    }, {
        $set: {
            short_description: req.body.short_description
        }
    }, {new: true}, function (err, good) {
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
                    message: "Store successfully updated"
                },
                data: {
                    good: good
                }
            });
        }
    });
});

router.route('/update/tags').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        good_id: req.body.good_id
    }, {
        $set: {
            tags: req.body.tags
        }
    }, {new: true}, function (err, good) {
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
                    message: "Good successfully updated"
                },
                data: {
                    good: good
                }
            });
        }
    });
});

router.route('/update/type').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        good_id: req.body.good_id
    }, {
        $set: {
            type: req.body.type
        }
    }, {new: true}, function (err, good) {
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
                    message: "Good successfully updated"
                },
                data: {
                    good: good
                }
            });
        }
    });
});

router.route('/update/picture').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        good_id: req.body.good_id
    }, {
        $set: {
            picture: req.body.picture
        }
    }, {new: true}, function (err, good) {
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
                    message: "Good successfully updated"
                },
                data: {
                    good: good
                }
            });
        }
    });
});

router.route('/update/params').put(checkJWT, async (req, res) => {
    let data = await dbGoods.updateGoodParams(req.body.good_id, req.body.params, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});


module.exports = router;