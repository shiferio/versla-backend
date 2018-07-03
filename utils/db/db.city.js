const City = require('../../models/city');
const mongoose = require('mongoose');

module.exports = {
    /**
     * Add city
     * @param data Data of new City
     * @returns {Promise<*>}
     */
    addCity: async (data) => {
        let city = new City();

        city.user = data.name;
        city.location = data.location;

        city.save();

        return {
            meta: {
                code: 200,
                success: true,
                message: "City successfully added"
            },
            data: {
                city: city
            }
        };
    },

    /**
     * Get cities
     * @returns {Object}
     */
    getCities: async () => {
        let cities = await City.find().exec();
        if (cities) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get cities"
                },
                data: {
                    cities: cities
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No cities'
                },
                data: null
            };
        }
    },
    /**
     * Get city by id
     * id city
     * @returns {Object}
     */
    getCityById: async (id) => {
        let city = await City.findOne().where("_id").in(id).exec();
        if (city) {
            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get city"
                },
                data: {
                    city: city
                }
            };
        } else {
            return {
                meta: {
                    success: false,
                    code: 200,
                    message: 'No cities'
                },
                data: null
            };
        }
    }
};