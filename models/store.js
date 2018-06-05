const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    name: String,
    link: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: String,
    short_description: String,
    logo: String,
    background: String,
    tags: [String],
    creator_id: String,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Store', StoreSchema);