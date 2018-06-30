const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    name: String,
    location: {
        lat: Number,
        lng: Number
    }
});

module.exports = mongoose.model('City', CitySchema);