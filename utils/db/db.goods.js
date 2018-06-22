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
    }
};