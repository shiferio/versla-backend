const GoodCategory = require('../../models/gcategory');
const mongoose = require('mongoose');

module.exports = {
    /**
     * Add category
     * @param data Data of new Category
     * @param userId Creator id
     * @returns {Promise<*>}
     */
    addCategory: async (data, userId) => {
        let category = new GoodCategory();

        category.user = mongoose.Types.ObjectId(userId);
        category.name = data.name;

        category.save();

        return {
            meta: {
                code: 200,
                success: true,
                message: "Category successfully added"
            },
            data: {
                category: category
            }
        };
    },

    /**
     * Get categories
     * @returns {Object}
     */
    getCategories: async () => {
        let categories = await GoodCategory.find().exec();
        if (categories) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get categories"
                },
                data: {
                    categories: categories
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No categories'
                },
                data: null
            };
        }
    }
};