const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    good: { type: Schema.Types.ObjectId, ref: 'Good' },
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    quantity: Number,
    payment_type: Number, // 1 - оплата лично продавцу, 2 - оплата онлайн
    delivery: Boolean, // true - нужна, false - нет
    delivery_address: String,
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