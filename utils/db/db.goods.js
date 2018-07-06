const Store = require('../../models/store');
const User = require('../../models/user');
const Good = require('../../models/good');
const GoodRate = require('../../models/goodrate');
const _ = require('underscore-node');

module.exports = {
    /**
     * Update good params
     * @param id Good id
     * @param params Params
     * @returns {Promise<*>}
     */
    updateGoodParams: async (id, params, user_id) => {
        let good = await Good.findOne().where("_id").in(id).exec();
        if (good) {
            if (params) good.params = params;
            good.save();
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Good successfully updated"
                },
                data: {
                    good: good
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No goods with such id'
                },
                data: null
            };
        }
    },
    /**
     * Update good rating
     * @param rate rating
     * @param good_id good id
     * @param user_id user id
     * @returns {Promise<*>}
     */
    updateGoodRating: async (rate, good_id, user_id) => {
        let goodrate = await GoodRate.findOne().where("good").in(good_id).where("user").in(user_id).exec();
        let good = await Good.findOne().where("_id").in(good_id).exec();
        if (good) {
            if (goodrate) {
                goodrate.value = +rate;
                await goodrate.save();
                let goodrates = await GoodRate.find().where("good").in(good_id).exec();
                let sumRates =  _.reduce(goodrates, function (memo, goodrate) {
                    return memo + goodrate.value;
                }, 0);
                good.rating = sumRates / +(goodrates.length);
                await good.save();

                return {
                    meta: {
                        code: 200,
                        success: true,
                        message: "Rate successfully updated"
                    },
                    data: {
                        good: good
                    }
                };
            } else {
                let newrate = new GoodRate();
                newrate.value = +rate;
                newrate.user = user_id;
                newrate.good = good_id;
                await newrate.save();
                let goodrates = await GoodRate.find().where("good").in(good_id).exec();
                let sumRates = _.reduce(goodrates, function (memo, goodrate) {
                    return memo + goodrate.value;
                }, 0);
                good.rating = sumRates / +(goodrates.length);
                await good.save();

                return {
                    meta: {
                        code: 200,
                        success: true,
                        message: "Rate successfully updated"
                    },
                    data: {
                        good: good
                    }
                };
            }
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No goods with such id'
                },
                data: null
            };
        }
    },
    /**
     * Update good params
     * @param id Good id
     * @param is_available Is Available Status
     * @returns {Promise<*>}
     */
    updateAvailableStatus: async (id, is_available, user_id) => {
        let good = await Good.findOne().where("_id").in(id).exec();
        if (good) {
            good.is_available = is_available;
            good.save();
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Good successfully updated"
                },
                data: {
                    good: good
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No goods with such id'
                },
                data: null
            };
        }
    },
    /**
     * Update category id
     * @param id Good id
     * @param category_id Cat id
     * @returns {Promise<*>}
     */
    updateCategoryId: async (data) => {
        let good = await Good.findOne().where("_id").in(data.good_id).exec();
        if (good) {
            good.category = data.category;
            good.save();
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Good successfully updated"
                },
                data: {
                    good: good
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No goods with such id'
                },
                data: null
            };
        }
    },
    /**
     * Find all stores of category
     * @param id
     * @returns {Object}
     */
    findGoodsByCategoryId: async (id) => {
        let goods = await Good.find().where("category").in(id).exec();
        if (goods) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get goods"
                },
                data: {
                    goods: goods
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No goods with such category id'
                },
                data: null
            };
        }
    },

    /**
     * Find all goods of filter
     * @param filter
     * @returns {Object}
     */
    findGoodsByFilters: async (filter) => {
        let goods;
        if (filter.category && filter.store) {
            goods = await Good.find().where("category").in(filter.category).where("store_id").in(filter.store).exec();
        } else if (filter.category && filter.city) {
            goods = await Good.find().where("category").in(filter.category).where("city").in(filter.city).exec();
        } else if (filter.store) {
            goods = await Good.find().where("store_id").in(filter.store).exec();
        } else if (filter.city) {
            goods = await Good.find().where("city").in(filter.city).exec();
        } else if (filter.category) {
            goods = await Good.find().where("category").in(filter.category).exec();
        }

        if (goods) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get goods"
                },
                data: {
                    goods: goods
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No goods with such category id'
                },
                data: null
            };
        }
    }
};