const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');

const dbOrders = require('../utils/db/db.order');

/**
 * @api {post} /api/comments/add Add Order
 * @apiName Add Order
 * @apiGroup Orders
 *
 * @apiParam {ObjectID} user
 * @apiParam {ObjectId} store
 * @apiParam {ObjectID} good
 * @apiParam {Number} quantity
 * @apiParam {Array} values
 * @apiParam {Number} price
 *
 * @apiSuccess {String} token Security token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Comment successfully added"
 *     },
 *     data: {
 *       "comment": comment
 *     }
 */
router.route('/add').post(checkJWT, async (req, res) => {
    let data = await dbOrders.addOrder(req.body, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

router.route('/add/array').post(checkJWT, async (req, res) => {
    let data = await dbOrders.addOrders(req.body.orders, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

router.get('/user/:id', async (req, res) => {
    let data = await dbOrders.getOrderByUserId(req.params.id);
    return res.status(data['meta'].code).send(data);
});

router.route('/status/delivered').put(checkJWT, async (req, res) => {
    try {
        const order = dbOrders.updateStatusDelivered(
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
                order: order
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

router.route('/status/obtained').put(checkJWT, async (req, res) => {
    try {
        const order = dbOrders.updateStatusObtained(
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
                order: order
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