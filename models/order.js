const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    good: { type: Schema.Types.ObjectId, ref: 'Good' },
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    quantity: Number,
    values: [{
        name: String,
        value: String
    }],
    price: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);