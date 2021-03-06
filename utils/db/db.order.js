const Order = require('../../models/order');
const Store = require('../../models/store');
const mongoose = require('mongoose');
module.exports = {
    /**
     * Add comment
     * @param orderData Data of new Order
     * @param userId Creator id
     * @returns {Promise<*>}
     */
    addOrder: async (orderData, userId) => {
        let order = new Order();

        order.user = mongoose.Types.ObjectId(userId);
        order.store = mongoose.Types.ObjectId(orderData.store_id);
        order.good = mongoose.Types.ObjectId(orderData.good_id);

        if (orderData.quantity) order.quantity = orderData.quantity;
        if (orderData.values) order.values = orderData.values;
        if (orderData.price) order.price = orderData.price;

        order.save();

        return {
            meta: {
                code: 200,
                success: true,
                message: "Order successfully added"
            },
            data: {
                order: order
            }
        };
    },

    /**
     * Add orders
     * @param orderArray Data of new Order
     * @param userId Creator id
     * @returns {Promise<*>}
     */
    addOrders: async (orderArray, userId) => {
        await orderArray.forEach(async (orderData) => {
            let order = new Order();

            order.user = mongoose.Types.ObjectId(userId);
            order.store = mongoose.Types.ObjectId(orderData.store_id);
            order.good = mongoose.Types.ObjectId(orderData.good_id);

            if (orderData.quantity) order.quantity = orderData.quantity;
            if (orderData.values) order.values = orderData.values;
            if (orderData.price) order.price = orderData.price;

            await order.save();
        });

        return {
            meta: {
                code: 200,
                success: true,
                message: "Orders successfully added"
            },
            data: null
        };
    },

    /**
     * Get orders by user_id
     * @param user_id
     * @returns {Object}
     */
    getOrderByUserId: async (user_id) => {
        let orders = await Order.find().where("user").in(user_id).populate('store').populate('good').exec();
        if (orders) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get orders"
                },
                data: {
                    orders: orders
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No orders with such user id'
                },
                data: null
            };
        }
    },

    /**
     * Get orders by store_id
     * @param store_id
     * @returns {Object}
     */
    getOrdersByStoreId: async (store_id) => {
        let orders = await Order.find().where("store").in(store_id).populate('user').populate('good').exec();
        if (orders) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get orders"
                },
                data: {
                    orders: orders
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No orders with such user id'
                },
                data: null
            };
        }
    },

    updateStatusDelivered: async (orderId, userId) => {
        const order = await Order
            .findOne({
              _id: orderId
            })
            .exec();

        const storeId = order.store;
        const store = await Store
            .findOne({
              _id: storeId
            })
            .exec();
        const creatorId = store.creator_id;

        if (!creatorId.equals(userId)) {
            throw Error('NOT STORE CREATOR');
        }

        const updatedOrder = await Order
            .findOneAndUpdate({
                _id: orderId
            }, {
                status: 1
            }, {
                'new': true
            })
            .exec();

        return updatedOrder;
    },

    updateStatusObtained: async (orderId, userId) => {
        const order = await Order
            .findOne({
                _id: orderId
            })
            .exec();

        if (!order.user.equals(userId)) {
            throw Error('NOT ORDER OWNER');
        }

        const updatedOrder = await Order
            .findOneAndUpdate({
                _id: orderId
            }, {
                status: 2
            }, {
                'new': true
            })
            .exec();

        return updatedOrder;
    }
};