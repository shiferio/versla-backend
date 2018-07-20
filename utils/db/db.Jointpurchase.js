const JointPurchase = require('../../models/jointpurchase');
const mongoose = require('mongoose');

module.exports = {
    addPurchase: async (data, userId) => {
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

        try {
            await purchase.save();

            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Joint purchase successfully added"
                },
                data: {
                    purchase: purchase
                }
            }
        } catch (err) {
            return {
                meta: {
                    code: 500,
                    success: false,
                    message: "Error during purchase adding"
                },
                data: null
            }
        }
    },

    getPurchaseById: async (purchaseId) => {
        try {
            const purchase = await JointPurchase
                .findOne({_id: purchaseId})
                .populate('category')
                .populate('creator')
                .populate('measurement_unit')
                .exec();

            if (purchase) {
                return {
                    meta: {
                        code: 200,
                        success: true,
                        message: "Successfully get purchase"
                    },
                    data: {
                        purchase: purchase
                    }
                };
            } else {
                return {
                    meta: {
                        code: 404,
                        success: true,
                        message: "No purchase with such ID"
                    },
                    data: null
                };
            }
        } catch (err) {
            return {
                meta: {
                    code: 500,
                    success: false,
                    message: "Error during purchase search"
                },
                data: null
            }
        }
    },

    updateField: async (name, value, purchaseId, userId) => {
        const modifiable = [
            'name', 'picture', 'description', 'category',
            'address', 'volume', 'price_per_unit', 'measurement_unit',
            'state', 'payment_type'
        ];

        if (modifiable.indexOf(name) === -1) {
            return {
                meta: {
                    code: 405,
                    success: false,
                    message: "Field is not modifiable"
                },
                data: null
            }
        }

        const setOp = {};
        setOp[name] = value;

        try {
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
                return {
                    meta: {
                        code: 200,
                        success: true,
                        message: "Successfully updated purchase"
                    },
                    data: {
                        purchase: purchase
                    }
                };
            } else {
                return {
                    meta: {
                        code: 404,
                        success: true,
                        message: "Can't update purchase"
                    },
                    data: null
                };
            }
        } catch (err) {
            return {
                meta: {
                    code: 500,
                    success: false,
                    message: "Error during purchase update"
                },
                data: null
            }
        }
    },

    addUserToBlackList: async (purchaseId, userId, creatorId) => {
        try {
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
                return {
                    meta: {
                        code: 200,
                        success: true,
                        message: "Successfully added user to black list"
                    },
                    data: {
                        purchase: purchase
                    }
                };
            } else {
                return {
                    meta: {
                        code: 404,
                        success: true,
                        message: "Can't add user to black list"
                    },
                    data: null
                };
            }
        } catch (err) {
            return {
                meta: {
                    code: 500,
                    success: false,
                    message: "Error during black list update"
                },
                data: null
            }
        }
    },

    removeUserFromBlackList: async (purchaseId, userId, creatorId) => {
        try {
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
                return {
                    meta: {
                        code: 200,
                        success: true,
                        message: "Successfully removed user from black list"
                    },
                    data: {
                        purchase: purchase
                    }
                };
            } else {
                return {
                    meta: {
                        code: 404,
                        success: true,
                        message: "Can't remove user from black list"
                    },
                    data: null
                };
            }
        } catch (err) {
            return {
                meta: {
                    code: 500,
                    success: false,
                    message: "Error during black list update"
                },
                data: null
            }
        }
    }
};
