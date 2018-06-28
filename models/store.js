const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    name: String,
    link: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: String,
    contacts: {
        phone: String,
        email: String,
        address: String,
    },
    resident: {
        type: String,
        tax_num: String,
        state_num: String,
        bank_type: String,
        bank_num: String
    },
    goods_type: String,
    rating: {
        type: Number,
        default: 0
    },
    short_description: String,
    logo: String,
    background: String,
    balance: {
        type: Number,
        default: 0
    },
    tags: [String],
    creator_id: { type: Schema.Types.ObjectId, ref: 'User' },
    location: {
        lat: {
            type: Number,
            default: null
        },
        lng: {
            type: Number,
            default: null
        }
    },
    contact_faces: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    is_promoted: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Store', StoreSchema);