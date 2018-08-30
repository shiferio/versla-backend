const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoodSchema = new Schema({
    price: Number,
    name: String,
    description: String,
    short_description: String,
    picture: String,
    tags: [String],
    creator_id: {type: Schema.Types.ObjectId, ref: 'User'},
    store_id: {type: Schema.Types.ObjectId, ref: 'Store'},
    category: {type: Schema.Types.ObjectId, ref: 'GoodCategory'},
    city: {type: Schema.Types.ObjectId, ref: 'City'},
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
    },
    purchase_info: {
        wholesale_price: Number,
        min_volume: Number,
        purchase_enabled: Boolean
    },
    volume: Number
});


module.exports = mongoose.model('Good', GoodSchema);
