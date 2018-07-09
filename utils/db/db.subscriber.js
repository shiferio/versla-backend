const Subscriber = require('../../models/subscriber');
const mongoose = require('mongoose');

module.exports = {
    subscribe: async (data) => {
        let subscriber = new Subscriber();

        subscriber.email = data.email;

        subscriber.save();

        return {
            meta: {
                code: 200,
                success: true,
                message: "Subscriber successfully added"
            },
            data: {
                subscriber: subscriber
            }
        };
    },
    getSubscribers: async () => {
        let subscribers = await Subscriber.find().exec();
        if (subscribers) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get categories"
                },
                data: {
                    subscribers: subscribers
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No subscribers'
                },
                data: null
            };
        }
    },
    unsubscribe: async (data) => {
        let subscriber = await Subscriber.findOne().where("email").in(data.email).exec();
        if (subscriber) {
            await Subscriber.find({ email: data.email }).remove().exec();
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully removed subscriber"
                },
                data: {
                    subscriber: subscriber
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No subscribers'
                },
                data: null
            };
        }
    }
};