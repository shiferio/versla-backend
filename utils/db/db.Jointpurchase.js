const JointPurchase = require('../../models/jointpurchase');
const mongoose = require('mongoose');
const CodeError = require('../code-error');
const pre = require('preconditions').singleton();

const MODIFIABLE_FIELDS = [
    'name', 'picture', 'description', 'category',
    'address', 'volume', 'price_per_unit', 'measurement_unit',
    'state', 'payment_type'
];

const PURCHASE_STATES = {
    CREATED: 0,
    COLLECTED: 1,
    CLOSED: 2
};

module.exports = {
    MODIFIABLE_FIELDS: MODIFIABLE_FIELDS,

    PURCHASE_STATES: PURCHASE_STATES,

    addPurchase: async (data, userId) => {
        pre
            .shouldBeString(data.name, 'MISSED NAME')
            .shouldBeString(data.picture, 'MISSED PICTURE')
            .shouldBeString(data.description, 'MISSED DESCRIPTION')
            .shouldBeString(data.category_id, 'MISSED CATEGORY')
            .checkArgument(data.category_id.length === 24, 'INVALID ID')
            .shouldBeString(data.address, 'MISSED ADDRESS')
            .shouldBeNumber(data.volume, 'MISSED VOLUME')
            .shouldBeNumber(data.min_volume, 'MISSED MINIMUM VOLUME')
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
            min_volume: data.min_volume,
            remaining_volume: data.volume,
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

    updateVolume: async (volume, purchaseId, userId) => {
        pre
            .shouldBeDefined(volume, 'MISSED FIELD VALUE')
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase.findById(purchaseId);

        if (!purchase) {
            throw new Error('NO SUCH PURCHASE');
        }

        const oldVolume = purchase.volume;
        const remainingVolume = purchase.remaining_volume;
        const usedVolume = oldVolume - remainingVolume;
        if (volume < usedVolume) {
            throw new Error('LESSER THAN USED');
        }

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: userId,
                volume: oldVolume,
                remaining_volume: remainingVolume
            }, {
                '$set': {
                    volume: volume
                },
                '$inc': {
                    remaining_volume: volume - oldVolume
                },
                '$push': {
                    history: {
                        parameter: 'volume',
                        value: volume
                    }
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
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
    },

    joinWithPurchase: async (purchaseId, userId, volume) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(purchaseId, 'MISSED USER ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeNumber(volume, 'MISSED VOLUME')
            .checkArgument(volume > 0, 'INVALID VOLUME');

        const purchase = await JointPurchase.findById(purchaseId);

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(purchase.min_volume <= volume, 'VOLUME IS LESSER THAN MINIMUM')
            .checkArgument(purchase.remaining_volume >= volume, 'TOO MUCH VOLUME')
            .checkArgument(
                purchase.black_list.indexOf(userId.toString()) === -1 &&
                (purchase.is_public || purchase.white_list.indexOf(userId.toString()) !== -1),
                'ACCESS DENIED'
            )
            .checkArgument(
                purchase.participants.findIndex(p => p.user.toString() === userId.toString()) === -1,
                'ALREADY JOINT'
            );

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                min_volume: {'$lte': volume},
                remaining_volume: {'$gte': volume},
                'participants.user': {'$nin': [userId]},
                black_list: {'$nin': [userId.toString()]},
                '$or': [
                    {is_public: true},
                    {white_list: {'$in': userId.toString()}}
                ]
            }, {
                '$inc': {
                    remaining_volume: -volume
                },
                '$push': {
                    participants: {
                        user: userId,
                        volume: volume
                    }
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new CodeError('NOT JOINT');
        }
    },

    detachFromThePurchase: async (purchaseId, userId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(purchaseId, 'MISSED USER ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase.findById(purchaseId);

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(
                purchase.participants.findIndex(p => p.user.equals(userId)) !== -1,
                'NOT JOINT'
            );

        const index = purchase
            .participants
            .findIndex(p => p.user.equals(userId));
        const volume = purchase.participants[index].volume;

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                'participants.user': userId
            }, {
                '$pull': {
                    participants: {
                        user: userId
                    }
                },
                '$inc': {
                    remaining_volume: volume
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT DETACHED');
        }
    },

    approveUserPayment: async (purchaseId, userId, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(purchaseId, 'MISSED USER ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase.findById(purchaseId);

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(
                purchase.participants.findIndex(p => p.user.equals(userId)) !== -1,
                'NOT JOINT'
            );

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: mongoose.Types.ObjectId(creatorId),
                'participants.user': userId
            }, {
                '$set': {
                    'participants.$.paid': true
                }
            }, {
                'new': true
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT APPROVED');
        }
    },

    getUserPurchases: async (creatorId) => {
        const purchases = await JointPurchase
            .find({
                creator: creatorId
            })
            .populate('category')
            .populate('creator')
            .populate('measurement_unit')
            .exec();

        if (purchases) {
            return purchases;
        } else {
            return [];
        }
    }
};
