const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');

const dbComment = require('../utils/db/db.comment');

/**
 * @api {post} /api/comments/add Add Comment
 * @apiName Add Comment
 * @apiGroup Comments
 *
 * @apiParam {String} title
 * @apiParam {Number} type
 * @apiParam {String} text
 * @apiParam {String} user_id
 * @apiParam {String} comment_id
 * @apiParam {String} good_id
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
    let data = await dbComment.addComment(req.body, req.decoded.user._id);
    return res.status(data['meta'].code).send(data);
});

module.exports = router;