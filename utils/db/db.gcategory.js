const GoodCategory = require('../../models/gcategory');
const mongoose = require('mongoose');
const {Comparator} = require('../search/filter');

const categoryDFS = async (category, depth, map) => {
    if (map) {
        map.set(category._id.toString(), depth);
    }

    const subcategories = await GoodCategory
        .find({
            parent: category._id
        })
        .exec();
    const models = [];
    for (const subcategory of subcategories) {
        const model = await categoryDFS(subcategory, depth + 1, map);
        models.push(model);
    }

    return {
        id: category._id,
        name: category.name,
        children: models
    };
};

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
    },
    /**
     * Get category by id
     * id category
     * @returns {Object}
     */
    getCategoryById: async (id) => {
        let category = await GoodCategory.findOne().where("_id").in(id).exec();
        if (category) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get category"
                },
                data: {
                    category: category
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
    },
    getCategoryTree: async () => {
        const topLevelCategories = await GoodCategory
            .find({
                parent: {
                    '$exists': false
                }
            })
            .exec();
        const models = [];
        for (const category of topLevelCategories) {
            const model = await categoryDFS(category, 1);
            models.push(model);
        }
        return models;
    },
    categoryDFS: async (category, depth, map) => {
        return await categoryDFS(category, depth, map);
    },
    /**
     * @return {Object} categories: Array<String>, order: Map<String, Number>
     */
    getSubcategories: async (categoryId) => {
        const map = new Map();
        await categoryDFS({
            _id: categoryId,
            name: ''
        }, 1, map);

        const cmp = new Comparator((a, b) => {
            return map.get(a) < map.get(b);
        });

        return {
            categories: Array
                .of(...map.keys())
                .sort((a, b) => cmp.compare(a, b))
                .map(c => mongoose.Types.ObjectId(c)),
            order: map
        };
    }
};