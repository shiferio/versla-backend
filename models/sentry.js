const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreEntrySchema = new Schema({
    type: Number, // 1 is guest, 2 is registered user
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    store: {type: Schema.Types.ObjectId, ref: 'Store'},
    ip: String,

    visits: [
        {
            date: Date
        }
    ]
});

module.exports = mongoose.model('StoreEntry', StoreEntrySchema);