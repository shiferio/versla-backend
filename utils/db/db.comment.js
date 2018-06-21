const Comment = require('../../models/comment');

module.exports = {
    /**
     * Add comment
     * @param commentData Data of new Comment
     * @param userId Creator id
     * @returns {Promise<*>}
     */
    addComment: async (commentData, userId) => {
        let comment = new Comment();

        comment.creator_id = userId;
        if (commentData.text) comment.text = commentData.text;
        if (commentData.title) comment.title = commentData.title;
        if (commentData.type) comment.type = commentData.type;

        if (commentData.type === 1) {
            if (commentData.good_id) comment.good_id = commentData.good_id;
        } else if (commentData.type === 2) {
            if (commentData.comment_id) comment.comment_id = commentData.comment_id;
        }

        comment.save();
        return {
            meta: {
                code: 200,
                success: true,
                message: "Comment successfully added"
            },
            data: {
                comment: comment
            }
        };
    },
    /**
     * Get all Good Comments
     * @param good_id
     * @returns {Object}
     */
    getAllGoodComments: async (good_id) => {
        let comments = await Comment.find().where("good_id").in(good_id).exec();
        if (comments) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get comments"
                },
                data: {
                    comments: comments
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No comments with such good id'
                },
                data: null
            };
        }
    },
    /**
     * Get All Comment Comments
     * @param comment_id
     * @returns {Object}
     */
    getAllCommentComments: async (comment_id) => {
        let comments = await Comment.find().where("comment_id").in(comment_id).exec();
        if (comments) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get comments"
                },
                data: {
                    comments: comments
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No comments with such comment id'
                },
                data: null
            };
        }
    }
};