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
};