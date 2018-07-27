const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JointPurchaseSchema = new Schema({
    name: String,
    picture: String,
    description: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'GoodCategory'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address: String,
    volume: Number,
    min_volume: Number,
    remaining_volume: Number,
    price_per_unit: Number,
    measurement_unit: {
        type: Schema.Types.ObjectId,
        ref: 'MeasurementUnit'
    },
    date: Date,
    state: Number, // 0 - created (no participants), 1 - opened, 2 - saturated, 3 - closed
    payment_type: Number, // 0 - via site, 1 - to creator's bank card, 2 - when delivered
    history: [
        {
            parameter: String,
            value: Object,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    participants: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            volume: Number
        }
    ],
    black_list: {    // Array of documents contains ONLY IDs of users as STRINGS
        type: Array, // No more nested documents or implicit '_id' by mongoose
        default: []  // Because we use '$addToSet' operator
    },
    is_public: {
        type: Boolean,
        default: true
    },
    white_list: {    // Array of documents contains ONLY IDs of users as STRINGS
        type: Array, // No more nested documents or implicit '_id' by mongoose
        default: []  // Because we use '$addToSet' operator
    }
});

module.exports = mongoose.model('JointPurchase', JointPurchaseSchema);
