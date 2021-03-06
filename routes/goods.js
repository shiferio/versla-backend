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

    Good.find({is_available:true}).skip(pageNumber > 0 ? ((pageNumber - 1) * pageSize) : 0).limit(
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

router.get('/:good_id', async (req, res, next) => {

    let good = await Good.findOne().where("_id").in(req.params.good_id).where("is_available").in(true).populate('creator_id').populate('category').exec();

    if (good) {
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
    } else {
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Can't get good"
            },
            data: {
                good: null
            }
        });
    }
});

router.get('/cart/:good_id', async (req, res, next) => {

    let goods = await Good.find().where("_id").in(req.params.good_id).populate('creator_id').populate('category').exec();

    if (goods) {
        res.json({
            meta: {
                code: 200,
                success: true,
                message: "Successfully get good"
            },
            data: {
                good: goods[0]
            }
        });
    }
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
router.route('/add').post(checkJWT, async (req, res) => {
     try {
         const good = await dbGoods.addGood(req.body, req.decoded.user._id);
         return res.status(200).send({
             meta: {
                 code: 200,
                 success: true,
                 message: 'GOOD ADDED'
             },
             data: {
                 good: good
             }
         })
     } catch (error) {
         return res.status(500).send({
             meta: {
                 code: 500,
                 success: false,
                 message: error.message || 'UNKNOWN ERROR'
             },
             data: null
         })
     }
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
        _id: req.body.good_id
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
        _id: req.body.good_id
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
        _id: req.body.good_id
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
        _id: req.body.good_id
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
        _id: req.body.good_id
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
        _id: req.body.good_id
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
        _id: req.body.good_id
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
        _id: req.body.good_id
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

router.route('/update/city').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        _id: req.body.good_id
    }, {
        $set: {
            city: req.body.city
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

router.route('/update/volume').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        _id: req.body.good_id
    }, {
        $set: {
            volume: req.body.volume
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

router.route('/update/wholesale_price').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        _id: req.body.good_id
    }, {
        $set: {
            'purchase_info.wholesale_price': req.body.wholesale_price
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

router.route('/update/min_volume').put(checkJWT, (req, res, next) => {
    Good.findOneAndUpdate({
        creator_id: req.decoded.user._id,
        _id: req.body.good_id
    }, {
        $set: {
            'purchase_info.min_volume': req.body.min_volume
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

router.route('/update/rating').put(checkJWT, async (req, res) => {
    let data = await dbGoods.updateGoodRating(req.body.rate, req.body.good, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

router.get('/category/:id', async (req, res) => {
    let data = await dbGoods.findGoodsByCategoryId(req.params.id);
    return res.status(data['meta'].code).send(data);
});

router.get('/filter', async (req, res) => {
    let data = await dbGoods.findGoodsByFilters(req.body);
    return res.status(data['meta'].code).send(data);
});

router.route('/update/params').put(checkJWT, async (req, res) => {
    let data = await dbGoods.updateGoodParams(req.body.good_id, req.body.params, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

router.route('/update/category').put(checkJWT, async (req, res) => {
    let data = await dbGoods.updateCategoryId(req.body);
    return res.status(data['meta'].code).send(data);
});

router.route('/update/available').put(checkJWT, async (req, res) => {
    let data = await dbGoods.updateAvailableStatus(req.body.good_id, req.body.is_available, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});


module.exports = router;