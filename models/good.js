const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-plugin-autoinc').autoIncrement;
const mongoolia = require('mongoolia').default;

const GoodSchema = new Schema({
    good_id: {
        type: Number,
        unique: true
    },
    price: Number,
    name: String,
    description: String,
    short_description: String,
    picture: String,
    tags: [String],
    creator_id: {type: Schema.Types.ObjectId, ref: 'User'},
    store_id: {type: Schema.Types.ObjectId, ref: 'Store'},
    params: [
        {
            name: String,
            values: [String]
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    type: String,
    is_available: {
        type: Boolean,
        default: true
    },
    is_promoted: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

GoodSchema.plugin(autoIncrement, {model: 'Good', field: 'good_id', startAt: 1, incrementBy: 1});

GoodSchema.plugin(mongoolia, {
    appId: '1BL49RG52N',
    apiKey: 'fd368d8e55e2feea7d8e447cb2653ed9',
    indexName: 'dev_versla'
});

let Model = mongoose.model('Good', GoodSchema);

module.exports = Model;

