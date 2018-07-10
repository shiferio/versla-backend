const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeatureSchema = new Schema({
    email: String,
    text: String
});

module.exports = mongoose.model('Feature', FeatureSchema);