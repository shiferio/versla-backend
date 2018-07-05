const Store = require('../../models/store');
const User = require('../../models/user');
const Good = require('../../models/good');

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
};