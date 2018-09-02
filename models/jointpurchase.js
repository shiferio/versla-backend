const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;
const Big = require('big.js');

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
    volume_dec: Schema.Types.Decimal128,
    min_volume_dec: Schema.Types.Decimal128,
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
                type: String,
                default: null
            },
            delivered: {
                type: Boolean,
                default: false
            },
            sent: {
                type: String,
                default: null
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
    },
    good: { // for good purchases
        type: Schema.Types.ObjectId,
        ref: 'Good',
        autopopulate: true
    }
});

JointPurchaseSchema.virtual('stats').get(function () {
    const stats = {};
    const accumulator = (total, part) => total.plus(part.volume);

    const participants = this.participants.map(part => {
        return {
            volume: new Big(part.volume),
            paid: part.paid,
            sent: part.sent
        };
    });

    stats['ordered'] = participants.reduce(accumulator, new Big(0)).toFixed();
    stats['remaining'] = new Big(this.volume).minus(stats['ordered']).toFixed();

    stats['paid'] = participants
        .filter(part => !!part.paid)
        .reduce(accumulator, new Big(0))
        .toFixed();
    stats['not_paid'] = participants
        .filter(part => !part.paid)
        .reduce(accumulator, new Big(0))
        .toFixed();

    const paidAndSent = participants
        .filter(part => part.paid && part.sent)
        .reduce(accumulator, new Big(0));
    const paidAndNotSent = participants
        .filter(part => part.paid && !part.sent)
        .reduce(accumulator, new Big(0));
    const notPaidAndSent = participants
        .filter(part => !part.paid && part.sent)
        .reduce(accumulator, new Big(0));
    const notPaidAndNotSent = participants
        .filter(part => !part.paid && !part.sent)
        .reduce(accumulator, new Big(0));

    stats['paid_and_sent'] = paidAndSent.toFixed();
    stats['paid_and_not_sent'] = paidAndNotSent.toFixed();
    stats['not_paid_and_sent'] = notPaidAndSent.toFixed();
    stats['not_paid_and_not_sent'] = notPaidAndNotSent.toFixed();

    stats['sent'] = paidAndSent.plus(notPaidAndSent).toFixed();
    stats['not_sent'] = paidAndNotSent.plus(notPaidAndNotSent).toFixed();

    return stats;
});

JointPurchaseSchema.virtual('remaining_volume_big').get(function () {
    const volumeBig = new Big(this.volume_dec.toString());
    return this.participants
        .reduce(((total, part) => total.minus(part.volume)), volumeBig);
});

JointPurchaseSchema.virtual('remaining_volume').get(function () {
    const volumeBig = new Big(this.volume_dec.toString());
    return Number.parseFloat(this.participants
        .reduce(((total, part) => total.minus(part.volume)), volumeBig));
});

JointPurchaseSchema.virtual('volume_big').get(function () {
    return new Big(this.volume_dec.toString());
});

JointPurchaseSchema.virtual('min_volume_big').get(function () {
    return new Big(this.min_volume_dec.toString());
});

JointPurchaseSchema.virtual('volume').get(function () {
    return Number.parseFloat(this.volume_dec);
});

JointPurchaseSchema.virtual('min_volume').get(function () {
    return Number.parseFloat(this.min_volume_dec);
});

JointPurchaseSchema.set("toObject", { virtuals: true });
JointPurchaseSchema.set("toJSON", { virtuals: true });

JointPurchaseSchema.plugin(autopopulate);
module.exports = mongoose.model('JointPurchase', JointPurchaseSchema);
