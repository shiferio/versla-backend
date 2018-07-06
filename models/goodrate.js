const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoodRateSchema = new Schema({
    value: {
        type: Number
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    good: {type: Schema.Types.ObjectId, ref: 'Good'}
});

module.exports = mongoose.model('GoodRate', GoodRateSchema);