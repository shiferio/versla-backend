const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const JointPurchaseCommentSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    purchase: {
        type: Schema.Types.ObjectId,
        ref: 'JointPurchase'
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'JointPurchaseComment'
    },
    text: String,
    created: {
        type: Date,
        default: Date.now
    }
});

JointPurchaseCommentSchema.plugin(autopopulate);
module.exports = mongoose.model('JointPurchaseComment', JointPurchaseCommentSchema);