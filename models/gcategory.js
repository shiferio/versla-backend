const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoodCategorySchema = new Schema({
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'GoodCategory'
    },
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('GoodCategory', GoodCategorySchema);