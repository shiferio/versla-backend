const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');
const pre = require('preconditions').singleton();

const dbJointPurchases = require('../utils/db/db.Jointpurchase');

/**
 * @api {post} /api/jointpurchases/add Add Joint purchase
 * @apiName Add Joint purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} name
 * @apiParam {String} picture
 * @apiParam {String} description
 * @apiParam {ObjectID} category_id
 * @apiParam {String} address
 * @apiParam {Number} volume
 * @apiParam {Number} min_volume
 * @apiParam {Number} price_per_unit
 * @apiParam {ObjectID} measurement_unit_id
 * @apiParam {Date} date
 * @apiParam {Number} state
 * @apiParam {Number} payment_type
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
 * @api {get} /api/jointpurchases/get/:id Get Joint purchase by ID
 * @apiName Get Joint purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
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
 * @api {put} /api/jointpurchases/update/volume Update volume of joint purchase
 * @apiName Update Joint purchase's volume
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {Number} value New purchase volume
 */
router.route('/update/volume').put(checkJWT, async (req, res) => {
    try {
        pre
            .shouldBeNumber(req.body.value, 'MISSED VOLUME')
            .checkArgument(req.body.value > 0, 'INVALID VOLUME');

        const purchase = await dbJointPurchases.updateField(
            'volume',
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
 * @api {put} /api/jointpurchases/black_list Add user to black list
 * @apiName Add user to black list
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} user_id ID of user to be banned
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
 * @api {put} /api/jointpurchases/public Manipulate purchase's visibility
 * @apiName Manipulate purchase's visibility
 * @apiGroup Joint purchases
 * @apiDescription Purchase can be visible for all (including non-registered users)
 * or only for users from white list
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {Boolean} public New purchase's visibility (true - for all, false - for users from white list)
 */
router.route('/public').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.updatePublicState(
            req.body.id,
            req.body.public,
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
 * @api {put} /api/jointpurchases/white_list Add user to white list
 * @apiName Add user to white list
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} user_id ID of user to be flavoured
 */
router.route('/white_list').put(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.addUserToWhiteList(
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
 * @api {delete} /api/jointpurchases/white_list Remove user from white list
 * @apiName Remove user from white list
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 * @apiParam {String} user_id ID of user to be removed
 */
router.route('/white_list').delete(checkJWT, async (req, res) => {
    try {
        const purchase = await dbJointPurchases.removeUserFromWhiteList(
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
 * @apiParam {Number} volume Volume user want to buy
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
 * @api {delete} /api/jointpurchases/participants Detach user from purchase
 * @apiName Detach user from purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
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

module.exports = router;