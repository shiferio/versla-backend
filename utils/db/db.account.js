const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const sendmail = require('../mail/send');
const mongoose = require('mongoose');
const pre = require('preconditions').singleton();

module.exports = {
    /**
     * SignUp user
     * @param data New user's data
     * @param req Request
     * @returns {String}
     */
    signUp: async (data, req) => {
        const {login, password, email, phone, city} = data;
        pre
            .shouldBeString(login, 'MISSED LOGIN')
            .checkArgument(login.length > 0, 'EMPTY LOGIN')
            .shouldBeString(password, 'MISSED PASSWORD')
            .checkArgument(password.length > 0, 'EMPTY PASSWORD')
            .shouldBeString(email, 'MISSED EMAIL')
            .checkArgument(email.length > 0, 'EMPTY EMAIL')
            .shouldBeString(phone, 'MISSED PHONE')
            .checkArgument(phone.length > 0, 'EMPTY PHONE')
            .shouldBeString(city, 'MISSED CITY')
            .checkArgument(city.length === 24, 'INVALID CITY');

        const existingPhoneUser = await User.findOne({phone: phone}).exec();
        const existingEmailUser = await User.findOne({email: email}).exec();
        pre
            .checkArgument(!existingEmailUser, 'EMAIL ALREADY EXISTS')
            .checkArgument(!existingPhoneUser, 'PHONE ALREADY EXISTS');

        const user = new User({
            login, password, email, phone,
            city: mongoose.Types.ObjectId(city),
            ip: (req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress).split(",")[0]
        });
        user.picture = user.gravatar();

        await user.save();

        return jwt.sign({
            user: user
        }, config.secret, {
            expiresIn: '360d'
        });
    },

    /**
     * Login user
     * @param data User data for login
     * @returns {String}
     */
    login: async data => {
        const {phone, password} = data;
        pre
            .shouldBeString(phone, 'MISSED PHONE')
            .checkArgument(phone.length > 0, 'EMPTY PHONE')
            .shouldBeString(password, 'MISSED PASSWORD')
            .checkArgument(password.length > 0, 'EMPTY PASSWORD');

        const user = await User.findOne({phone: phone}).exec();

        pre
            .checkArgument(user, 'NO SUCH USER')
            .checkArgument(user.comparePassword(password), 'PASSWORD MISMATCH');

        return jwt.sign({
                user: user
            }, config.secret, {
                expiresIn: '7d'
            });
    },

    /**
     * Update user profile
     * @param userInfo User info
     * @param userId id of updated user
     * @returns {Object}
     */
    updateProfile: async (userInfo, userId) => {
        let user = await User.findOne().where("_id").in(userId).exec();
        if (user) {
            if (userInfo.first_name) user.first_name = userInfo.first_name;
            if (userInfo.last_name) user.last_name = userInfo.last_name;
            if (userInfo.email) user.email = userInfo.email;
            if (userInfo.password) user.password = userInfo.password;
            if (userInfo.phone) user.phone = userInfo.phone;
            if (userInfo.city) user.city = mongoose.Types.ObjectId(userInfo.city);

            user.save();

            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully updated your profile"
                },
                data: user
            };
        } else {
            return {
                meta: {
                    code: 404,
                    success: false,
                    message: "User not found"
                },
                data: null
            };
        }
    },

    /**
     * Reset user password
     * @param email User email
     * @returns {Object}
     */
    resetPassword: async (email) => {
        let user = await User.findOne().where("email").in(email).exec();
        if (user) {
            let newPassword = Math.random().toString(36).slice(-8);
            console.log(newPassword);
            user.password = newPassword;

            user.save();

            sendmail.sendNoReplyMessage('Пароль успешно сброшен', 'Ваш новый пароль: ' + newPassword + '. Если это были не Вы, срочно обновите регистрационные данные!', email);
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Password successfully reseted"
                },
                data: null
            };
        } else {
            return {
                meta: {
                    code: 404,
                    success: false,
                    message: "User not found"
                },
                data: null
            };
        }
    },
    /**
     * Update user cart
     * @param cart Cart array
     * @param userId userId
     * @returns {Promise<*>}
     */
    updateCart: async (cart, userId) => {
        let user = await User.findOne().where("_id").in(userId).exec();
        if (user) {
            if (cart) user.cart = cart;

            user.save();

            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully updated your cart"
                },
                data: user
            };
        } else {
            return {
                meta: {
                    code: 404,
                    success: false,
                    message: "User not found"
                },
                data: null
            };
        }
    },
    /**
     * Update user orders
     * @param orders Orders array
     * @param userId userId
     * @returns {Promise<*>}
     */
    updateOrders: async (orders, userId) => {
        let user = await User.findOne().where("_id").in(userId).exec();
        if (user) {
            if (orders) user.orders = orders;

            user.save();

            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully updated your orders"
                },
                data: user
            };
        } else {
            return {
                meta: {
                    code: 404,
                    success: false,
                    message: "User not found"
                },
                data: null
            };
        }
    }
};