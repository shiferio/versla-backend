const JointPurchase = require('../../models/jointpurchase');
const Good = require('../../models/good');
const mongoose = require('mongoose');
const pre = require('preconditions').singleton();
const {Comparator} = require('../search/filter');
const Big = require('big.js');

const MODIFIABLE_FIELDS = [
    'name', 'picture', 'description', 'category', 'price_per_unit',
    'address', 'volume', 'min_volume', 'measurement_unit',
    'date', 'state', 'payment_type', 'payment_info', 'is_public'
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
            .shouldBeNumber(data.payment_type, 'MISSED PAYMENT TYPE')
            .shouldBeBoolean(data.is_public, 'MISSED PUBLIC STATE')
            .shouldBeString(data.city_id, 'MISSED CITY')
            .checkArgument(data.city_id.length === 24, 'INVALID ID');

        const purchase = new JointPurchase({
            name: data.name,
            picture: data.picture,
            description: data.description,
            category: mongoose.Types.ObjectId(data.category_id),
            creator: userId,
            address: data.address,
            city: mongoose.Types.ObjectId(data.city_id),
            volume_dec: mongoose.Types.Decimal128.fromString(data.volume.toString()),
            min_volume_dec: mongoose.Types.Decimal128.fromString(data.min_volume.toString()),
            price_per_unit: data.price_per_unit,
            measurement_unit: mongoose.Types.ObjectId(data.measurement_unit_id),
            date: data.date,
            state: data.state,
            payment_type: data.payment_type,
            payment_info: data.payment_info,
            history: [
                {
                    parameter: 'state',
                    value: data.state
                }
            ],
            is_public: data.is_public
        });

        await purchase.save();

        return purchase;
    },

    addGoodPurchase: async (data, userId) => {
        pre
            .shouldBeString(data.good_id, 'MISSED GOOD')
            .checkArgument(data.good_id.length === 24, 'INVALID ID')
            .shouldBeString(data.description, 'MISSED DESCRIPTION')
            .shouldBeString(data.address, 'MISSED ADDRESS')
            .shouldBeNumber(data.volume, 'MISSED VOLUME')
            .shouldBeString(data.measurement_unit_id, 'MISSED MEASURE')
            .checkArgument(data.measurement_unit_id.length === 24, 'INVALID ID')
            .shouldBeDefined(data.date, 'MISSED DATE')
            .shouldBeNumber(data.state, 'MISSED STATE')
            .shouldBeNumber(data.payment_type, 'MISSED PAYMENT TYPE')
            .shouldBeBoolean(data.is_public, 'MISSED PUBLIC STATE')
            .shouldBeString(data.city_id, 'MISSED CITY')
            .checkArgument(data.city_id.length === 24, 'INVALID ID');

        const good = await Good.findById(data.good_id).populate('store_id');
        const store = good.store_id;
        pre
            .shouldBeDefined(good, 'GOOD NOT FOUND')
            .shouldBeDefined(store, 'STORE NOT FOUND');
        const price = store.goods_type === 'retail' ? good.price : good.purchase_info.wholesale_price;

        const purchase = new JointPurchase({
            name: good.name,
            picture: good.picture,
            description: data.description,
            category: good.category,
            creator: userId,
            address: data.address,
            city: mongoose.Types.ObjectId(data.city_id),
            volume_dec: mongoose.Types.Decimal128.fromString(data.volume.toString()),
            min_volume_dec: mongoose.Types.Decimal128.fromString(good.purchase_info.min_volume.toString()),
            price_per_unit: data.price_per_unit,
            measurement_unit: mongoose.Types.ObjectId(data.measurement_unit_id),
            date: data.date,
            state: data.state,
            payment_type: data.payment_type,
            payment_info: data.payment_info,
            history: [
                {
                    parameter: 'state',
                    value: data.state
                }
            ],
            is_public: data.is_public,
            good: mongoose.Types.ObjectId(data.good_id)
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

        const purchase = await JointPurchase
            .findOne({_id: purchaseId})
            .exec();

        if (!purchase) {
            throw new Error('NO SUCH PURCHASE');
        }

        const volumeBig = new Big(volume);
        const oldVolume = purchase.volume_big;
        const remainingVolume = purchase.remaining_volume_big;
        const usedVolume = oldVolume.minus(remainingVolume);
        if (volumeBig.lt(usedVolume)) {
            throw new Error('LESSER THAN USED');
        }

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: userId,
                volume_dec: purchase.volume_dec
            }, {
                '$set': {
                    volume_dec: mongoose.Types.Decimal128.fromString(volume.toString())
                },
                '$push': {
                    history: {
                        parameter: 'volume',
                        value: {
                            volume: volumeBig.toFixed(),
                            measurement_unit: purchase.measurement_unit.name
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT UPDATED');
        }
    },

    updateMinVolume: async (volume, purchaseId, userId) => {
        pre
            .shouldBeDefined(volume, 'MISSED FIELD VALUE')
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase
            .findOne({_id: purchaseId})
            .exec();

        if (!purchase) {
            throw new Error('NO SUCH PURCHASE');
        }

        const volumeBig = new Big(volume);
        if (volumeBig.gt(purchase.remaining_volume_big)) {
            throw new Error('GREATER THAN REMAINING');
        }

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: userId
            }, {
                '$set': {
                    min_volume_dec: mongoose.Types.Decimal128.fromString(volume.toString())
                },
                '$push': {
                    history: {
                        parameter: 'min_volume',
                        value: {
                            volume: volumeBig.toFixed(),
                            measurement_unit: purchase.measurement_unit.name
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT UPDATED');
        }
    },

    updateIsPublicState: async (state, purchaseId, userId) => {
        pre
            .shouldBeDefined(state, 'MISSED FIELD VALUE')
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase
            .findOne({_id: purchaseId})
            .exec();

        if (!purchase) {
            throw new Error('NO SUCH PURCHASE');
        }

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: userId,
            }, {
                '$set': {
                    is_public: state
                }
            }, {
                'new': true
            })
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
            .shouldBeString(userId, 'MISSED USER ID')
            .checkArgument(userId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase.findById(purchaseId);
        pre.shouldBeDefined(purchase, 'NO SUCH PURCHASE');

        const index = purchase.participants
            .filter(p => !!p.user)
            .findIndex(p => p.user.equals(userId));
        pre.checkArgument(index !== -1, 'NOT JOINT');

        const volume = purchase.participants[index].volume;

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: creatorId,
                'participants.user': userId
            }, {
                '$addToSet': {
                    black_list: userId.toString()
                },
                '$pull': {
                    participants: {
                        user: userId
                    }
                },
                '$push': {
                    history: {
                        parameter: 'black_list.add',
                        value: {
                            user: userId.toString()
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT ADDED');
        }
    },

    removeUserFromBlackList: async (purchaseId, userId, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(userId, 'MISSED USER ID')
            .checkArgument(userId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: creatorId
            }, {
                '$pull': {
                    black_list: userId.toString()
                },
                '$push': {
                    history: {
                        parameter: 'black_list.remove',
                        value: {
                            user: userId.toString()
                        }
                    }
                }
            }, {
                'new': true
            })
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
            .shouldBeNumber(volume, 'MISSED VOLUME')
            .checkArgument(volume > 0, 'INVALID VOLUME');

        const purchase = await JointPurchase.findById(purchaseId);
        const volumeBig = new Big(volume);
        const volumeDec = mongoose.Types.Decimal128.fromString(volume.toString());

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(purchase.min_volume_big.lte(volumeBig), 'VOLUME IS LESSER THAN MINIMUM')
            .checkArgument(purchase.remaining_volume_big.gte(volumeBig), 'TOO MUCH VOLUME')
            .checkArgument(
                purchase.black_list.indexOf(userId.toString()) === -1,
                'ACCESS DENIED'
            )
            .checkArgument(
                purchase.participants
                    .filter(p => !!p.user)
                    .findIndex(p => p.user.equals(userId)) === -1,
                'ALREADY JOINT'
            );

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                min_volume_dec: {'$lte': volumeDec},
                'participants.user': {'$nin': [userId]},
                black_list: {'$nin': [userId.toString()]}
            }, {
                '$push': {
                    participants: {
                        user: userId,
                        volume: volume
                    },
                    history: {
                        parameter: 'participants.joint',
                        value: {
                            user: userId,
                            volume: volumeBig.toFixed()
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT JOINT');
        }
    },

    joinFakeUserWithPurchase: async (purchaseId, creatorId, userLogin, volume) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(userLogin, 'MISSED USER LOGIN')
            .shouldBeNumber(volume, 'MISSED VOLUME')
            .checkArgument(volume > 0, 'INVALID VOLUME');

        const purchase = await JointPurchase
            .findOne({
                _id: purchaseId,
                creator: creatorId
            })
            .exec();
        const volumeBig = new Big(volume);
        const volumeDec = mongoose.Types.Decimal128.fromString(volume.toString());

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(purchase.min_volume_big.lte(volumeBig), 'VOLUME IS LESSER THAN MINIMUM')
            .checkArgument(purchase.remaining_volume_big.gte(volumeBig), 'TOO MUCH VOLUME')
            .checkArgument(
                purchase.participants
                    .filter(p => !!p.fake_user)
                    .findIndex(p => p.fake_user.login === userLogin) === -1,
                'ALREADY JOINT'
            );

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: creatorId,
                min_volume_dec: {'$lte': volumeDec},
                'participants.fake_user.login': {'$nin': [userLogin]}
            }, {
                '$push': {
                    participants: {
                        fake_user: {
                            login: userLogin
                        },
                        volume: volume
                    },
                    history: {
                        parameter: 'fake_participants.joint',
                        value: {
                            user: userLogin,
                            volume: volumeBig.toFixed()
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT JOINT');
        }
    },

    detachFromThePurchase: async (purchaseId, userId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase.findById(purchaseId);

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(
                purchase.participants
                    .filter(p => !!p.user)
                    .findIndex(p => p.user.equals(userId)) !== -1,
                'NOT JOINT'
            );

        const index = purchase
            .participants
            .filter(p => !!p.user)
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
                '$push': {
                    history: {
                        parameter: 'participants.detached',
                        value: {
                            user: userId,
                            volume: volume.toString()
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT DETACHED');
        }
    },

    detachFakeUserFromThePurchase: async (purchaseId, creatorId, userLogin) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(userLogin, 'MISSED USER LOGIN');

        const purchase = await JointPurchase
            .findOne({
                _id: purchaseId,
                creator: creatorId
            })
            .exec();

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(
                purchase.participants
                    .filter(p => !!p.fake_user)
                    .findIndex(p => p.fake_user.login === userLogin) !== -1,
                'NOT JOINT'
            );

        const index = purchase
            .participants
            .filter(p => !!p.fake_user)
            .findIndex(p => p.fake_user.login === userLogin);
        const volume = purchase.participants[index].volume;

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                'participants.fake_user.login': userLogin
            }, {
                '$pull': {
                    participants: {
                        fake_user: {
                            login: userLogin
                        }
                    }
                },
                '$push': {
                    history: {
                        parameter: 'fake_participants.detached',
                        value: {
                            user: userLogin,
                            volume: volume.toString()
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT DETACHED');
        }
    },

    updateUserPayment: async (purchaseId, userId, date, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(userId, 'MISSED USER ID')
            .checkArgument(userId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase.findById(purchaseId);

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(
                purchase.participants
                    .filter(p => !!p.user)
                    .findIndex(p => p.user.equals(userId)) !== -1,
                'NOT JOINT'
            );

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: mongoose.Types.ObjectId(creatorId),
                'participants.user': userId
            }, {
                '$set': {
                    'participants.$.paid': date
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT UPDATED');
        }
    },

    updateFakeUserPayment: async (purchaseId, userLogin, date, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(userLogin, 'MISSED USER LOGIN');

        const purchase = await JointPurchase
            .findOne({
                _id: purchaseId,
                creator: creatorId
            })
            .exec();

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(
                purchase.participants
                    .filter(p => !!p.fake_user)
                    .findIndex(p => p.fake_user.login === userLogin) !== -1,
                'NOT JOINT'
            );

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: mongoose.Types.ObjectId(creatorId),
                'participants.fake_user.login': userLogin
            }, {
                '$set': {
                    'participants.$.paid': date
                },
                '$push': {
                    history: {
                        parameter: 'fake_participants.paid',
                        value: {
                            user: userLogin,
                            state: date
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT UPDATED');
        }
    },

    updateUserOrderSent: async (purchaseId, userId, date, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(userId, 'MISSED USER ID')
            .checkArgument(userId.length === 24, 'INVALID ID');

        const purchase = await JointPurchase.findById(purchaseId);

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(
                purchase.participants
                    .filter(p => !!p.user)
                    .findIndex(p => p.user.equals(userId)) !== -1,
                'NOT JOINT'
            );

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: mongoose.Types.ObjectId(creatorId),
                'participants.user': userId
            }, {
                '$set': {
                    'participants.$.sent': date
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT UPDATED');
        }
    },

    updateFakeUserOrderSent: async (purchaseId, userLogin, date, creatorId) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(userLogin, 'MISSED USER LOGIN');

        const purchase = await JointPurchase
            .findOne({
                _id: purchaseId,
                creator: creatorId
            })
            .exec();

        pre
            .shouldBeDefined(purchase, 'NO SUCH PURCHASE')
            .checkArgument(
                purchase.participants
                    .filter(p => !!p.fake_user)
                    .findIndex(p => p.fake_user.login === userLogin) !== -1,
                'NOT JOINT'
            );

        const updatedPurchase = await JointPurchase
            .findOneAndUpdate({
                _id: purchaseId,
                creator: mongoose.Types.ObjectId(creatorId),
                'participants.fake_user.login': userLogin
            }, {
                '$set': {
                    'participants.$.sent': date
                },
                '$push': {
                    history: {
                        parameter: 'fake_participants.sent',
                        value: {
                            user: userLogin,
                            state: date
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT UPDATED');
        }
    },

    getUserPurchases: async (creatorId) => {
        const purchases = await JointPurchase
            .find({
                creator: creatorId
            })
            .exec();

        if (purchases) {
            return purchases;
        } else {
            return [];
        }
    },

    getPurchaseOrders: async (userId) => {
        const purchases = await JointPurchase
            .find({
                'participants.user': userId.toString()
            })
            .exec();

        if (purchases) {
            return purchases;
        } else {
            return [];
        }
    },

    updateUserDelivery: async (purchaseId, userId, state) => {
        pre
            .shouldBeString(purchaseId, 'MISSED PURCHASE ID')
            .checkArgument(purchaseId.length === 24, 'INVALID ID')
            .shouldBeString(userId, 'MISSED USER ID')
            .checkArgument(userId.length === 24, 'INVALID ID');

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
                'participants.user': userId
            }, {
                '$set': {
                    'participants.$.delivered': state
                },
                '$push': {
                    history: {
                        parameter: 'participants.delivered',
                        value: {
                            user: userId,
                            state: state
                        }
                    }
                }
            }, {
                'new': true
            })
            .exec();

        if (updatedPurchase) {
            return updatedPurchase;
        } else {
            throw new Error('NOT UPDATED');
        }
    },

    findByFilter: async (filter, skip, limit, order) => {
        const purchases = await JointPurchase
            .aggregate([
                {'$match': filter},
                {'$addFields': {
                        recent: {'$arrayElemAt': ['$history', -1]}
                    }
                },
                {'$sort': {recent: -1}},
                {'$skip': skip},
                {'$limit': limit},
                {
                    '$lookup': {
                        from: 'measurementunits',
                        localField: 'measurement_unit',
                        foreignField: '_id',
                        as: 'measurement_unit'
                    }
                },
                {'$unwind': '$measurement_unit'}
            ])
            .exec();
        const total = await JointPurchase
            .count(filter)
            .exec();

        if (order) {
            const cmp = new Comparator((a, b) => {
                const keyA = a.category._id.toString();
                const keyB = b.category._id.toString();
                return order.get(keyA) < order.get(keyB);
            });
            purchases.sort((a, b) => cmp.compare(a, b));
        }
        purchases.forEach(purchase => {
            purchase.volume = Number.parseFloat(purchase.volume_dec);
            purchase.min_volume = Number.parseFloat(purchase.min_volume_dec);

            const volumeBig = new Big(purchase.volume_dec.toString());
            purchase.remaining_volume = Number.parseFloat(purchase.participants
                .reduce(((total, part) => total.minus(part.volume)), volumeBig));
        });

        return {
            purchases,
            total
        };
    },

    findGoodByFilter: async (filter) => {
        const purchases = await JointPurchase
            .find(filter)
            .exec();

        return purchases || [];
    }
};
