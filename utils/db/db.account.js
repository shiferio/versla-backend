const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
    /**
     * SignUp user
     * @param newUser Brand new user data
     * @returns {Object}
     */
    signUp: async newUser => {
        let user = new User();
        user.login = newUser.login;
        user.password = newUser.password;
        user.email = newUser.email;
        user.phone = newUser.phone;
        user.picture = user.gravatar();

        let existingUser = await User.findOne().where("email").in(newUser.email).exec();
        if (existingUser) {
            return {
                meta: {
                    success: false,
                    code: 503,
                    message: 'Account with that email is already exists'
                },
                data: null
            };
        } else {
            user.save();
            let token = jwt.sign({
                user: user
            }, config.secret, {
                expiresIn: '360d'
            });

            return {
                meta: {
                    success: true,
                    code: 200,
                    message: 'You are successfully registered'
                },
                data: {
                    token: token
                }
            };
        }
    },
    /**
     * Login user
     * @param userData User data for login
     * @returns {Object}
     */
    login: async userData => {
        let user = await User.findOne().where("email").in(userData.email).exec();

        if (!user) {
            return {
                meta: {
                    success: false,
                    code: 503,
                    message: 'Authentification failed. User not found'
                },
                data: null
            };
        } else if (user) {
            let validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                return {
                    meta: {
                        success: false,
                        code: 503,
                        message: 'Authentification failed. Wrong password.'
                    },
                    data: null
                };
            } else {
                let token = jwt.sign({
                    user: user
                }, config.secret, {
                    expiresIn: '7d'
                });
                return {
                    meta: {
                        success: true,
                        code: 200,
                        message: 'You are successfully logined'
                    },
                    data: {
                        token: token
                    }
                };
            }
        }
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
    }
};