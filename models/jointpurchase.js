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
    price_per_unit: Number,
    measurement_unit: {
        type: Schema.Types.ObjectId,
        ref: 'MeasurementUnit'
    },
    date: Date,
    state: Number,
    payment_type: Number,
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
    ]
});

module.exports = mongoose.model('JointPurchase', JointPurchaseSchema);
