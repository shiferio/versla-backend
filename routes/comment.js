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

/**
 * @api {post} /api/comments/good/:id Get All comments for good
 * @apiName Get All Comments for Good
 * @apiGroup Comments
 *
 * @apiParam {String} id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Successfully get comments"
 *     },
 *     "comments": [
     {
         "rating": 0,
         "_id": "5b2b9c252b0ea00b39fb6347",
         "created": "2018-06-21T12:37:57.846Z",
         "creator_id": "5b215a9b719645637b7b939d",
         "text": "The breakthrough revolutionary product",
         "title": "Amazing good",
         "good_id": "5b27bce94de6a514b4cf1462",
         "__v": 0
     },
     {
         "rating": 0,
         "_id": "5b2b9c8d5ba2440b4d3740db",
         "created": "2018-06-21T12:39:41.686Z",
         "creator_id": "5b215a9b719645637b7b939d",
         "text": "The breakthrough revolutionary product",
         "title": "Amazing good",
         "type": 1,
         "good_id": "5b27bce94de6a514b4cf1462",
         "__v": 0
     }
     ]
 */
router.get('/good/:id', async (req, res) => {
    let data = await dbComment.getAllGoodComments(req.params.id);
    return res.status(data['meta'].code).send(data);
});

/**
 * @api {post} /api/comments/comment/:id Get All comments for comment
 * @apiName Get All Comments for Comment
 * @apiGroup Comments
 *
 * @apiParam {String} id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     meta: {
 *      "success": true,
 *      "code": 200,
 *      "message": "Successfully get comments"
 *     },
 *     data: {
 *       "comments": [
			{
				"rating": 0,
				"_id": "5b2b9c252b0ea00b39fb6347",
				"created": "2018-06-21T12:37:57.846Z",
				"creator_id": "5b215a9b719645637b7b939d",
				"text": "The breakthrough revolutionary product",
				"title": "Amazing good",
				"good_id": "5b27bce94de6a514b4cf1462",
				"__v": 0
			},
			{
				"rating": 0,
				"_id": "5b2b9c8d5ba2440b4d3740db",
				"created": "2018-06-21T12:39:41.686Z",
				"creator_id": "5b215a9b719645637b7b939d",
				"text": "The breakthrough revolutionary product",
				"title": "Amazing good",
				"type": 1,
				"good_id": "5b27bce94de6a514b4cf1462",
				"__v": 0
			}
		]
 *     }
 */
router.get('/comment/:id', async (req, res) => {
    let data = await dbComment.getAllCommentComments(req.params.id);
    return res.status(data['meta'].code).send(data);
});

module.exports = router;