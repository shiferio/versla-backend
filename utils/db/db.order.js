const Order = require('../../models/order');
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
    }
};