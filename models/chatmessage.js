const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatMessageSchema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);