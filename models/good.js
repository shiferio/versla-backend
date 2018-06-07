const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-plugin-autoinc').autoIncrement;

const GoodSchema = new Schema({
    goodId: {
        type: Number,
        unique: true
    },
    name: String,
    description: String,
    short_description: String,
    logo: String,
    tags: [String],
    creator_id: String,
    store_id: String,
    rating: Number,
    type: String,
    is_promoted: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

GoodSchema.plugin(autoIncrement, { model: 'Good', field: 'goodId' });

module.exports = mongoose.model('Good', GoodSchema);