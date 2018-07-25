const router = require('express').Router();
const checkJWT = require('../middlewares/check-jwt.js');

const dbChat = require('../utils/db/db.chat');
const dbChatMessage = require('../utils/db/db.chatmessage');

/**
 * @api {post} /api/chat/new Open chat with specified user
 * @apiName Open chat
 * @apiGroup Chats
 *
 * @apiParam {ObjectID} user_id
 */
router.route('/new').post(checkJWT, async (req, res) => {
    try {
        const chat = await dbChat.getChatOrCreate(
            req.decoded.user._id,
            req.body.user_id
        );

        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'FOUND'
            },
            data: {
                chat: chat
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
 * @api {get} /api/chat/all Get all chats in which user participate
 * @apiName Get all chats
 * @apiGroup Chats
 */
router.route('/all').get(checkJWT, async (req, res) => {
    try {
        const chats = await dbChat.getChatsWithUser(
            req.decoded.user._id
        );

        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'FOUND'
            },
            data: {
                chats: chats
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
 * @api {get} /api/chat/history Get chat history by chat ID
 * @apiName Get chat history
 * @apiGroup Chats
 */
router.route('/history/:id').get(checkJWT, async (req, res) => {
    try {
        const history = await dbChatMessage.getChatHistory(req.params.id);

        return res.status(200).send({
            meta: {
                code: 200,
                success: true,
                message: 'FOUND'
            },
            data: {
                history: history
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
