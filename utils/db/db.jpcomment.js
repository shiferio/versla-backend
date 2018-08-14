const Comment = require('../../models/jpcomment');
const mongoose = require('mongoose');
const pre = require('preconditions').singleton();

const commentDFS = async (comment) => {
    const subcomments = await Comment
        .find({
            parent: comment._id
        }, null, {
            sort: { created: 1 }
        })
        .exec();
    const models = [];
    for (const subcomment of subcomments) {
        const model = await commentDFS(subcomment);
        models.push(model);
    }

    return {
        id: comment._id,
        user: comment.creator.login,
        date: comment.created,
        body: comment.text,
        children: models
    };
};

module.exports = {
    addComment: async (data, userId) => {
        pre
            .shouldBeString(data.text, 'MISSED TEXT')
            .shouldBeString(data.id, 'MISSED PURCHASE')
            .checkArgument(data.id.length === 24, 'INVALID ID');

        const dbData = {
            creator: userId,
            purchase: data.id,
            text: data.text
        };
        if (data.parent_id) {
            dbData.parent = mongoose.Types.ObjectId(data.parent_id);
        }

        const comment = new Comment(dbData);

        await comment.save();

        return comment;
    },

    getPurchaseCommentTree: async (purchaseId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const topLevelComments = await Comment
            .find({
                purchase: purchaseId,
                parent: {
                    '$exists': false
                }
            }, null, {
                sort: { created: 1 }
            })
            .exec();
        const models = [];
        for (const comment of topLevelComments) {
            const model = await commentDFS(comment);
            models.push(model);
        }
        return models;
    }
};
