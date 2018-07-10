const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ErrorSchema = new Schema({
    email: String,
    text: String
});

module.exports = mongoose.model('Error', ErrorSchema);