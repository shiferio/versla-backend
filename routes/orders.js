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

router.get('/user/:id', async (req, res) => {
    let data = await dbOrders.getOrderByUserId(req.params.id);
    return res.status(data['meta'].code).send(data);
});

module.exports = router;