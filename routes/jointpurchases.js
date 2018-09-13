const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');
const pre = require('preconditions').singleton();

const dbJointPurchases = require('../utils/db/db.Jointpurchase');
const dbJPComment = require('../utils/db/db.jpcomment');

/**
 * @api {post} /api/jointpurchases/add Add Joint purchase
 * @apiName Add Joint purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} name
 * @apiParam {String} picture
 * @apiParam {String} description
 * @apiParam {String} category_id
 * @apiParam {String} address
 * @apiParam {String} city_id
 * @apiParam {Number} volume
 * @apiParam {Number} min_volume
 * @apiParam {Number} price_per_unit
 * @apiParam {String} measurement_unit_id
 * @apiParam {String} date
 * @apiParam {Number} state
 * @apiParam {Number} payment_type
 * @apiParam {Boolean} is_public
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "PURCHASE ADDED"
 *     },
 *     "data": {
 *      "purchase": {
 *       "_id": "5b8c14a640a1c0234c76675f",
 *       "black_list": [],
 *       "is_public": true,
 *       "name": "Purchase",
 *       "picture": "http://images2.versla.ru/images/1.png",
 *       "description": "",
 *       "category": "5b5afbf9d94cc90f069b3741",
 *       "creator": "5b589346505ebe4fe345d44c",
 *       "address": "Address",
 *       "city": "5b5876e4fb6fc0105da12d92",
 *       "volume_dec": {
 *        "$numberDecimal": "11.0000000000000"
 *       },
 *       "min_volume_dec": {
 *        "$numberDecimal": "11.0000000000000"
 *       },
 *       "price_per_unit": 111,
 *       "measurement_unit": "5b805c77d5abaf05e54f40d0",
 *       "date": "2018-09-01T21:00:00.000Z",
 *       "state": 0,
 *       "payment_type": 2,
 *       "payment_info": "",
 *       "history": [],
 *       "participants": []
 *      }
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/add').post(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.addPurchase(req.body, req.decoded.user._id);
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'PURCHASE ADDED'
            },
            data: {
                purchase: purchase
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
 * @api {post} /api/jointpurchases/add/good Add Good Joint purchase
 * @apiName Add Good Joint purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} name
 * @apiParam {String} picture
 * @apiParam {String} description
 * @apiParam {String} category_id
 * @apiParam {String} address
 * @apiParam {String} city_id
 * @apiParam {Number} volume
 * @apiParam {Number} min_volume
 * @apiParam {Number} price_per_unit
 * @apiParam {String} measurement_unit_id
 * @apiParam {String} date
 * @apiParam {Number} state
 * @apiParam {Number} payment_type
 * @apiParam {Boolean} is_public
 * @apiParam {String} good_id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "PURCHASE ADDED"
 *     },
 *     "data": {
 *      "purchase": {
 *       "_id": "5b8c14a640a1c0234c76675f",
 *       "black_list": [],
 *       "is_public": true,
 *       "name": "Purchase",
 *       "picture": "http://images2.versla.ru/images/1.png",
 *       "description": "",
 *       "category": "5b5afbf9d94cc90f069b3741",
 *       "creator": "5b589346505ebe4fe345d44c",
 *       "address": "Address",
 *       "city": "5b5876e4fb6fc0105da12d92",
 *       "volume_dec": {
 *        "$numberDecimal": "11.0000000000000"
 *       },
 *       "min_volume_dec": {
 *        "$numberDecimal": "11.0000000000000"
 *       },
 *       "price_per_unit": 111,
 *       "measurement_unit": "5b805c77d5abaf05e54f40d0",
 *       "date": "2018-09-01T21:00:00.000Z",
 *       "state": 0,
 *       "payment_type": 2,
 *       "payment_info": "",
 *       "history": [],
 *       "participants": [],
 *       "good": "5b805c77d5abaf05e14f40d0"
 *      }
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/add/good').post(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.addGoodPurchase(req.body, req.decoded.user._id);
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'PURCHASE ADDED'
            },
            data: {
                purchase: purchase
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
 * @api {get} /api/jointpurchases/get/:id Get Joint purchase by ID
 * @apiName Get Joint purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "PURCHASE FOUND"
 *     },
 *     "data": {
 *      "purchase": {
 *       "black_list": [],
 *       "is_public": false,
 *       "_id": "5b898fc0bc9ae700a4cd9d93",
 *       "name": "Purchase",
 *       "picture": "",
 *       "description": "",
 *       "category": {
 *        "_id": "5b4666109795c00013b23dfb",
 *        "user": "5b4663f99795c00013b23df8",
 *        "name": "Category"
 *       },
 *       "creator": {
 *        "isSeller": false,
 *        "_id": "5b7e467d32123500b2c34afd",
 *        "login": "login",
 *        "password": "$2a$10$uLjypEyDT7d0sF6EWMIBRfwv3ILrMjwo.",
 *        "email": "mail@mail.mail",
 *        "phone": "71234567890",
 *        "city": "5b3eb2241c90d734a14217cb",
 *        "ip": "0.0.0.0",
 *        "cart": [],
 *        "created": "2018-08-23T05:30:37.349Z",
 *        "picture": "https://gravatar.com/avatar/a52794f007f574f2c?s200&d=retro"
 *       },
 *       "address": "Address",
 *       "city": {
 *        "location": {
 *         "lat": 0,
 *         "lng": 0
 *        },
 *        "_id": "5b56daa0820f4806ecbf6802",
 *        "name": "City"
 *       },
 *       "price_per_unit": 10,
 *       "measurement_unit": {
 *        "_id": "5b7e475232123500b5c34afe",
 *        "name": "л",
 *        "user": "5b7e467d32123520b5c34afd"
 *       },
 *       "date": "2018-08-31T21:00:00.000Z",
 *       "state": 2,
 *       "payment_type": 1,
 *       "payment_info": "",
 *       "history": [
 *        {
 *         "date": "2018-08-31T18:58:08.588Z",
 *         "_id": "5b898fc0bc9ae780a4cd9d94",
 *         "parameter": "state",
 *         "value": 0
 *        }
 *       ],
 *       "participants": [
 *        {
 *         "paid": "false",
 *         "delivered": false,
 *         "sent": "false",
 *         "_id": "5b898fcdbc9a1700a4cd9d96",
 *         "user": "5b898f20bc91e700a4cd9d8e",
 *         "volume": 10
 *        }
 *       ],
 *       "volume_dec": {
 *        "$numberDecimal": "11.0000000000000"
 *       },
 *       "min_volume_dec": {
 *        "$numberDecimal": "11.0000000000000"
 *       },
 *       "stats": {
 *        "ordered": "11",
 *        "remaining": "0",
 *        "paid": "11",
 *        "not_paid": "0",
 *        "paid_and_sent": "11",
 *        "paid_and_not_sent": "0",
 *        "not_paid_and_sent": "0",
 *        "not_paid_and_not_sent": "0",
 *        "sent": "11",
 *        "not_sent": "0"
 *       },
 *       "remaining_volume_big": "0",
 *       "remaining_volume": 0,
 *       "volume_big": "11",
 *       "min_volume_big": "11",
 *       "volume": 11,
 *       "min_volume": 11,
 *       "id": "5b898fc0bc9ae700a4cd9d93"
 *      }
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.get('/get/:id', async (req, res) => {
    try {
        const purchase = await dbJointPurchases.getPurchaseById(req.params.id);
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'PURCHASE FOUND'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/name Update name of joint purchase
 * @apiName Update Joint purchase's name
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} value New purchase name
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/name').put(checkJWT, async (req, res) => {
    try {
        pre.shouldBeString(req.body.value, 'MISSED NAME');

        const purchase = await dbJointPurchases.updateField(
            'name',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/picture Update picture of joint purchase
 * @apiName Update Joint purchase's picture
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} value New purchase picture url
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/picture').put(checkJWT, async (req, res) => {
    try {
        pre.shouldBeString(req.body.value, 'MISSED PICTURE');

        const purchase = await dbJointPurchases.updateField(
            'picture',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/description Update description of joint purchase
 * @apiName Update Joint purchase's description
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} value New purchase description
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/description').put(checkJWT, async (req, res) => {
    try {
        pre.shouldBeString(req.body.value, 'MISSED DESCRIPTION');

        const purchase = await dbJointPurchases.updateField(
            'description',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/category Update category of joint purchase
 * @apiName Update Joint purchase's category
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} value New purchase category ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/category').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeString(req.body.value, 'MISSED CATEGORY')
            .checkArgument(req.body.value.length === 24, 'INVALID ID');

        const purchase = await dbJointPurchases.updateField(
            'category',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/address Update address of joint purchase
 * @apiName Update Joint purchase's address
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} value New purchase address
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/address').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeString(req.body.value, 'MISSED ADDRESS');

        const purchase = await dbJointPurchases.updateField(
            'address',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/date Update date of joint purchase
 * @apiName Update Joint purchase's date
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} value New purchase date
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/date').put(checkJWT, async (req, res) => {
    try {
        pre.shouldBeString(req.body.value, 'MISSED DATE');

        const purchase = await dbJointPurchases.updateField(
            'date',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/is_public Update visibility of joint purchase
 * @apiName Update Joint purchase's visibility
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {Boolean} value New visibility state
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/is_public').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.updateIsPublicState(
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/volume Update volume of joint purchase
 * @apiName Update Joint purchase's volume
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {Number} value New purchase volume
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/volume').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeNumber(req.body.value, 'MISSED VOLUME')
            .checkArgument(req.body.value > 0, 'INVALID VOLUME');

        const purchase = await dbJointPurchases.updateVolume(
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/min_volume Update minimum volume to order of joint purchase
 * @apiName Update Joint purchase's minimum volume
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {Number} value New purchase minimum volume
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/min_volume').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeNumber(req.body.value, 'MISSED VOLUME')
            .checkArgument(req.body.value > 0, 'INVALID VOLUME');

        const purchase = await dbJointPurchases.updateMinVolume(
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/price_per_unit Update price per unit of joint purchase
 * @apiName Update Joint purchase's price per unit
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {Number} value New purchase price per unit
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/price_per_unit').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeNumber(req.body.value, 'MISSED PRICE')
            .checkArgument(req.body.value > 0, 'INVALID PRICE');

        const purchase = await dbJointPurchases.updateField(
            'price_per_unit',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/measurement_unit Update measurement unit of joint purchase
 * @apiName Update Joint purchase's measurement unit
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} value New purchase measurement unit ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/measurement_unit').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeString(req.body.value, 'MISSED MEASURE')
            .checkArgument(req.body.value.length === 24, 'INVALID ID');

        const purchase = await dbJointPurchases.updateField(
            'measurement_unit',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/state Update state of joint purchase
 * @apiName Update Joint purchase's state
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {Number} value New purchase state
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/state').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeNumber(req.body.value, 'MISSED STATE');

        const purchase = await dbJointPurchases.updateField(
            'state',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/payment_type Update payment type of joint purchase
 * @apiName Update Joint purchase's payment type
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {Number} value New payment type
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/payment_type').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeNumber(req.body.value, 'MISSED PAYMENT TYPE');

        const purchase = await dbJointPurchases.updateField(
            'payment_type',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/update/payment_info Update payment info of joint purchase
 * @apiName Update Joint purchase's payment info
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} value Payment info
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/update/payment_info').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeString(req.body.value, 'MISSED PAYMENT INFO');

        const purchase = await dbJointPurchases.updateField(
            'payment_info',
            req.body.value,
            req.body.id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/black_list Add user (participant only) to black list
 * @apiName Add user to black list
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} user_id ID of user to be banned
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "ADDED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/black_list').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.addUserToBlackList(
            req.body.id,
            req.body.user_id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'ADDED'
            },
            data: {
                purchase: purchase
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
 * @api {delete} /api/jointpurchases/black_list Remove user from black list
 * @apiName Remove user from black list
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} user_id ID of user to be removed
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "REMOVED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/black_list').delete(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.removeUserFromBlackList(
            req.body.id,
            req.body.user_id,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'REMOVED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/participants Join user to purchase
 * @apiName Join user to purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {Number} volume Volume user wants to order
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "JOINT"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/participants').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.joinWithPurchase(
            req.body.id,
            req.decoded.user._id,
            req.body.volume
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'JOINT'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/participants/fake Join fake user to purchase
 * @apiName Join fake user to purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} login Fake user login
 * @apiParam {Number} volume Volume user wants to order
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "JOINT"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/participants/fake').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.joinFakeUserWithPurchase(
            req.body.id,
            req.decoded.user._id,
            req.body.login,
            req.body.volume
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'JOINT'
            },
            data: {
                purchase: purchase
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
 * @api {delete} /api/jointpurchases/participants Detach user from purchase
 * @apiName Detach user from purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "DETACHED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/participants').delete(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.detachFromThePurchase(
            req.body.id,
            req.decoded.user._id,
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'DETACHED'
            },
            data: {
                purchase: purchase
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
 * @api {delete} /api/jointpurchases/participants/fake Detach fake user from purchase
 * @apiName Detach fake user from purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} login Fake user login
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "DETACHED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/participants/fake').delete(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.detachFakeUserFromThePurchase(
            req.body.id,
            req.decoded.user._id,
            req.body.login
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'DETACHED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/payments/update Update user payment state
 * @apiName Update user payment state
 * @apiGroup Joint purchases
 *
 * @apiParam {String} user_id ID of user which payment has to be updated
 * @apiParam {String} id Purchase ID
 * @apiParam {Boolean} state Payment state
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/payments/update').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.updateUserPayment(
            req.body.id,
            req.body.user_id,
            req.body.date,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/payments/update/fake Update fake user payment state
 * @apiName Update fake user payment state
 * @apiGroup Joint purchases
 *
 * @apiParam {String} login Login of fake user which payment has to be updated
 * @apiParam {String} id Purchase ID
 * @apiParam {Boolean} state Payment state
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/payments/update/fake').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.updateFakeUserPayment(
            req.body.id,
            req.body.login,
            req.body.date,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {get} /api/jointpurchases/owner Get list of Joint purchases of the given user
 * @apiName List of Joint purchases
 * @apiGroup Joint purchases
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "FETCHED"
 *     },
 *     "data": {
 *      "purchases": [
 *       { see /api/jointpurchases/get/:id },
 *       { see /api/jointpurchases/get/:id }
 *      ]
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/owner').get(checkJWT, async (req, res) => {
    try {
        const purchases = await dbJointPurchases.getUserPurchases(
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'FETCHED'
            },
            data: {
                purchases: purchases
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
 * @api {get} /api/jointpurchases/orders Get list of purchase orders of the given user
 * @apiName List of Joint purchases orders
 * @apiGroup Joint purchases
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "FETCHED"
 *     },
 *     "data": {
 *      "purchases": [
 *       { see /api/jointpurchases/get/:id },
 *       { see /api/jointpurchases/get/:id }
 *      ]
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/orders').get(checkJWT, async (req, res) => {
    try {
        const purchases = await dbJointPurchases.getPurchaseOrders(
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'FETCHED'
            },
            data: {
                purchases: purchases
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
 * @api {put} /api/jointpurchases/deliveries/update Update delivery status of the user's order
 * @apiName Update delivery status
 * @apiGroup Joint purchases
 *
 * @apiParam {String} user_id ID of user which wants to update delivery status
 * @apiParam {String} id Purchase ID
 * @apiParam {Boolean} state
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/deliveries/update').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.updateUserDelivery(
            req.body.id,
            req.body.user_id,
            req.body.state
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/sent/update Update user's order 'is sent' state
 * @apiName Update user's order 'is sent' state
 * @apiGroup Joint purchases
 *
 * @apiParam {String} user_id ID of user which order 'is sent' state has to be updated
 * @apiParam {String} id Purchase ID
 * @apiParam {Boolean} state 'is sent' state
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/sent/update').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.updateUserOrderSent(
            req.body.id,
            req.body.user_id,
            req.body.date,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {put} /api/jointpurchases/sent/update/fake Update fake user's order 'is sent' state
 * @apiName Update fake user's order 'is sent' state
 * @apiGroup Joint purchases
 *
 * @apiParam {String} login Login of fake user which order 'is sent' state has to be updated
 * @apiParam {String} id Purchase ID
 * @apiParam {Boolean} state 'is sent' state
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "UPDATED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/sent/update/fake').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.updateFakeUserOrderSent(
            req.body.id,
            req.body.login,
            req.body.date,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'UPDATED'
            },
            data: {
                purchase: purchase
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
 * @api {post} /api/jointpurchases/comment/add Add comment to Joint purchase
 * @apiName Add comment
 * @apiGroup Joint purchases
 *
 * @apiParam {String} text Comment body
 * @apiParam {String} id Purchase ID
 * @apiParam {String} parent_id Parent comment ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *      "success": true,
 *      "code": 200,
 *      "message": "ADDED"
 *     },
 *     "data": {
 *      "purchase": see /api/jointpurchases/get/:id
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.route('/comment/add').post(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJPComment.addComment(
            req.body,
            req.decoded.user._id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'ADDED'
            },
            data: {
                purchase: purchase
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
 * @api {get} /api/jointpurchases/comment/tree/:id Get comment tree for Joint purchase
 * @apiName Get comments
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "meta": {
 *     "code": 200,
 *     "success": true,
 *     "message": "FETCHED"
 *    },
 *     "data": {
 *     "comments": [
 *      {
 *       "id": "5b7e97d2cc9f470f14adf9dc",
 *       "user": "Lol",
 *       "date": "2018-08-23T11:17:38.717Z",
 *       "body": "vfadvdfvdf",
 *       "children": [
 *        {
 *         "id": "5b93c88fc1120316840c7573",
 *         "user": "W",
 *         "date": "2018-09-08T13:03:11.476Z",
 *         "body": "wow",
 *         "children": [
 *          {
 *           "id": "5b93ceb5c1120316840c757a",
 *           "user": "E",
 *           "date": "2018-09-08T13:29:25.112Z",
 *           "body": "lol",
 *           "children": []
 *          }
 *         ]
 *        }
 *       ]
 *      }
 *     ]
 *    }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     "meta": {
 *      "code": 500,
 *      "success": false,
 *      "message": message || "UNKNOWN ERROR"
 *     },
 *     "data": null
 */
router.get('/comment/tree/:id', async (req, res) => {
    try {
        const tree = await dbJPComment.getPurchaseCommentTree(
            req.params.id
        );
        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'FETCHED'
            },
            data: {
                comments: tree
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

module.exports = router;