const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreCategorySchema = new Schema({
    name: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('StoreCategory', StoreCategorySchema);