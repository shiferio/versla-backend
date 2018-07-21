const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');

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
 * @apiParam {Number} price_per_unit
 * @apiParam {ObjectID} measurement_unit_id
 * @apiParam {Date} date
 * @apiParam {Number} state
 * @apiParam {Number} payment_type
 */
router.route('/add').post(checkJWT, async (req, res) => {
    const data = await dbJointPurchases.addPurchase(req.body, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

/**
 * @api {get} /api/jointpurchases/get/:id Get Joint purchase by ID
 * @apiName Get Joint purchase
 * @apiGroup Joint purchases
 *
 * @apiParam {String} id Purchase ID
 */
router.get('/get/:id', async (req, res) => {
    const data = await dbJointPurchases.getPurchaseById(req.params.id);
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'name',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'picture',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'description',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'category',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'address',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'volume',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'price_per_unit',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'measurement_unit',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'state',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updateField(
        'payment_type',
        req.body.value,
        req.body.id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.addUserToBlackList(
        req.body.id,
        req.body.user_id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.removeUserFromBlackList(
        req.body.id,
        req.body.user_id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.updatePublicState(
        req.body.id,
        req.body.public,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.addUserToWhiteList(
        req.body.id,
        req.body.user_id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
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
    const data = await dbJointPurchases.removeUserFromWhiteList(
        req.body.id,
        req.body.user_id,
        req.decoded.user._id
    );
    return res.status(data['meta'].code).send(data);
});

module.exports = router;