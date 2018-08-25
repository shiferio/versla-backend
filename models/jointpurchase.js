const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const JointPurchaseSchema = new Schema({
    name: String,
    picture: String,
    description: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'GoodCategory',
        autopopulate: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    address: String,
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        autopopulate: true
    },
    volume: Number,
    min_volume: Number,
    price_per_unit: Number,
    measurement_unit: {
        type: Schema.Types.ObjectId,
        ref: 'MeasurementUnit',
        autopopulate: true
    },
    date: Date,
    state: Number, // 0 - created, 1 - orders collected, 2 - closed
    payment_type: Number, // 0 - via site, 1 - to creator's bank card, 2 - when delivered
    payment_info: String, // for bank card
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
            volume: Number,
            paid: {
                type: Boolean,
                default: false
            },
            delivered: {
                type: Boolean,
                default: false
            },
            sent: {
                type: Boolean,
                default: false
            },
            fake_user: {
                login: String
            }
        }
    ],
    black_list: {    // Array of documents contains ONLY IDs of users as STRINGS
        type: Array, // No more nested documents or implicit '_id' by mongoose
        default: []  // Because we use '$addToSet' operator
    },
    is_public: {
        type: Boolean,
        default: true
    }
});

JointPurchaseSchema.virtual('stats').get(function () {
    const stats = {};
    stats['ordered_volume'] = this.participants.reduce(((total, part) => total + part.volume), 0);
    stats['remaining_volume'] = this.volume - stats['ordered_volume'];
    return stats;
});

JointPurchaseSchema.virtual('remaining_volume').get(function () {
    const orderedVolume = this.participants.reduce(((total, part) => total + part.volume), 0);
    return this.volume - orderedVolume;
});


JointPurchaseSchema.set("toObject", { virtuals: true });
JointPurchaseSchema.set("toJSON", { virtuals: true });

JointPurchaseSchema.plugin(autopopulate);
module.exports = mongoose.model('JointPurchase', JointPurchaseSchema);
