const User = require('../../models/user');

module.exports = {
    /**
     * Find User by login
     * @param login
     * @returns {Object}
     */
    findUserByLogin: async (login) => {
        let user = await User.findOne().where("login").in(login).exec();
        if (user) {
            return {
                meta: {
                    success: true,
                    code: 200,
                    message: 'User successfully founded'
                },
                data: {
                    user: user
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No users with such name'
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
    findUserById: async (id) => {
        let user = await User.findOne().where("_id").in(id).exec();
        console.log(user);
        if (user) {
            return {
                meta: {
                    success: true,
                    code: 200,
                    message: 'User successfully founded'
                },
                data: {
                    user: user
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No users with such name'
                },
                data: null
            };
        }
    }
};