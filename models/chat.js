const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    participants: {
        type: Array,
        default: []
    },
    display_name: String
});

module.exports = mongoose.model('Chat', ChatSchema);