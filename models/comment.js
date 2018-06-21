const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    title: String,
    creator_id: String,
    type: Number,
    good_id: String,
    comment_id: String,
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