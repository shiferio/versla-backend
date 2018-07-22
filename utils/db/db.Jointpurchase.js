const JointPurchase = require('../../models/jointpurchase');
const mongoose = require('mongoose');
const CodeError = require('../code-error');
const pre = require('preconditions').singleton();

const MODIFIABLE_FIELDS = [
    'name', 'picture', 'description', 'category',
    'address', 'volume', 'price_per_unit', 'measurement_unit',
    'state', 'payment_type'
];

module.exports = {
    MODIFIABLE_FIELDS: MODIFIABLE_FIELDS,

    addPurchase: async (data, userId) => {
        pre
            .shouldBeString(data.name, 'MISSED NAME')
            .shouldBeString(data.picture, 'MISSED PICTURE')
            .shouldBeString(data.description, 'MISSED DESCRIPTION')
            .shouldBeString(data.category_id, 'MISSED CATEGORY')
            .checkArgument(data.category_id.length === 24, 'INVALID ID')
            .shouldBeString(data.address, 'MISSED ADDRESS')
            .shouldBeNumber(data.volume, 'MISSED VOLUME')
            .shouldBeNumber(data.price_per_unit, 'MISSED PRICE')
            .shouldBeString(data.measurement_unit_id, 'MISSED MEASURE')
            .checkArgument(data.measurement_unit_id.length === 24, 'INVALID ID')
            .shouldBeDefined(data.date, 'MISSED DATE')
            .shouldBeNumber(data.state, 'MISSED STATE')
            .shouldBeNumber(data.payment_type, 'MISSED PAYMENT TYPE');

        const purchase = new JointPurchase({
            name: data.name,
            picture: data.picture,
            description: data.description,
            category: mongoose.Types.ObjectId(data.category_id),
            creator: userId,
            address: data.address,
            volume: data.volume,
            price_per_unit: data.price_per_unit,
            measurement_unit: mongoose.Types.ObjectId(data.measurement_unit_id),
            date: data.date,
            state: data.state,
            payment_type: data.payment_type
        });

        await purchase.save();

        return purchase;
    },

    getPurchaseById: async (purchaseId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase
            .findOne({_id: purchaseId})
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (purchase) {
            return purchase
        } else {
            throw new Error('NO SUCH PURCHASE');
        }
    },

    updateField: async (name, value, purchaseId, userId) => {
        pre
            .shouldBeDefined(name, 'MISSED FIELD NAME')
            .shouldBeDefined(value, 'MISSED FIELD VALUE')
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .checkArgument(MODIFIABLE_FIELDS.indexOf(name) !== -1, 'UNMODIFIABLE FIELD');

        const setOp = {};
        setOp[name] = value;

        const purchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: userId
            }, {
                '$set': setOp,
                '$push': {
                    history: {
                        parameter: name,
                        value: value
                    }
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (purchase) {
            return purchase;
        } else {
            throw new Error('NOT UPDATED');
        }
    },

    addUserToBlackList: async (purchaseId, userId, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(purchaseId, 'MISSED USER ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: creatorId
            }, {
                '$addToSet': {
                    black_list: userId.toString()
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (purchase) {
            return purchase;
        } else {
            throw new Error('NOT ADDED');
        }
    },

    removeUserFromBlackList: async (purchaseId, userId, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(purchaseId, 'MISSED USER ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: creatorId
            }, {
                '$pull': {
                    black_list: userId.toString()
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (purchase) {
            return purchase;
        } else {
            throw new Error('NOT REMOVED');
        }
    },

    updatePublicState: async (purchaseId, publicState, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeBoolean(publicState, 'MISSED STATE');

        const purchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: creatorId
            }, {
                '$set': {
                    'is_public': publicState,
                    'white_list': []
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (purchase) {
            return purchase;
        } else {
            throw new Error('NOT UPDATED');
        }
    },

    addUserToWhiteList: async (purchaseId, userId, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(purchaseId, 'MISSED USER ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: creatorId,
                is_public: false
            }, {
                '$addToSet': {
                    white_list: userId.toString()
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (purchase) {
            return purchase;
        } else {
            throw new Error('NOT ADDED');
        }
    },

    removeUserFromWhiteList: async (purchaseId, userId, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(purchaseId, 'MISSED USER ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: creatorId,
                is_public: false
            }, {
                '$pull': {
                    white_list: userId.toString()
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (purchase) {
            return purchase;
        } else {
            throw new Error('NOT REMOVED');
        }
    }
};
