const Store = require('../../models/store');
const User = require('../../models/user');

module.exports = {

    /**
     * List Store with params
     * @param pageNumber
     * @param pageSize
     * @returns {Object}
     */
    listStoresByPages: async (pageNumber, pageSize) => {
        let stores = await Store.find({}).skip(+pageNumber > 0 ? ((+pageNumber - 1) * +pageSize) : 0).limit(+pageSize).exec();
        if (stores) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get stores"
                },
                data: {
                    stores: stores
                }
            };
        } else {
            return {
                meta: {
                    code: 200,
                    success: false,
                    message: "No stores founded"
                },
                data: {
                    stores: []
                }
            };
        }

    },
    /**
     * Find user by id
     * @param id
     * @returns {Object}
     */
    findStoreByName: async (link) => {
        let store = await Store.findOne().where("link").in(link).exec();
        if (store) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get store"
                },
                data: {
                    store: store
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No stores with such name'
                },
                data: null
            };
        }
    },

    /**
     * Find user by id
     * @param id
     * @returns {Object}
     */
    findStoreById: async (id) => {
        let store = await Store.findOne().where("_id").in(id).exec();
        if (store) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get store"
                },
                data: {
                    store: store
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No stores with such name'
                },
                data: null
            };
        }
    },

    /**
     * Add store
     * @param storeData Data of new Store
     * @param userId Creator id
     * @returns {Promise<*>}
     */
    addStore: async (storeData, userId) => {
        let user = await User.findOne().where("_id").in(userId).exec();
        if (user.isSeller) {
            let store = new Store();

            store.creator_id = userId;
            store.contact_faces = [userId];
            if (storeData.name) store.name = storeData.name;
            if (storeData.link) store.link = storeData.link;

            store.save();
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Store successfully added"
                },
                data: {
                    store: store
                }
            };
        } else {
            return {
                meta: {
                    code: 403,
                        success: false,
                        message: "User isn't seller"
                },
                data: null
            }
        }
    },

    /**
     * Delete item
     * @param userItem
     * @returns {Response<Object>}
     */
    deleteItem: async userItem => {
        let item = await Item.remove({_id: userItem._id}).exec();

        if (!item.n) {
            return {
                meta: {
                    "success": false,
                    "code": 404,
                    "message": "Item not found"
                },
                data: null
            }
        }

        return {
            meta: {
                "success": true,
                "code": 200,
                "message": "Item successfully removed"
            },
            data: userItem
        };
    }
};