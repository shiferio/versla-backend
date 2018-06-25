const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const CommentSchema = new Schema({
    title: String,
    creator_id: { type: Schema.Types.ObjectId, ref: 'User' },
    type: Number,
    good_id: { type: Schema.Types.ObjectId, ref: 'Good' },
    comment_id: { type: Schema.Types.ObjectId, ref: 'Comment' },
    text: String,
    rating: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', CommentSchema);