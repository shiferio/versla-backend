const MeasurementUnit = require('../../models/measurementunit');
const CodeError = require('../code-error');

module.exports = {
    addUnit: async (name, userId) => {
        const unit = new MeasurementUnit({
            name: name,
            user: userId
        });

        try {
            await unit.save();

            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Measurement unit successfully added"
                },
                data: {
                    unit: unit
                }
            }
        } catch (err) {
            const code = err.statusCode || 500;
            const message = err.message || "Error during measurement unit adding";
            return {
                meta: {
                    code: code,
                    success: false,
                    message: message
                },
                data: null
            };
        }
    },

    getUnitById: async (unitId) => {
        try {
            const unit = await MeasurementUnit
                .findOne({_id: unitId})
                .exec();

            if (unit) {
                return {
                    meta: {
                        code: 200,
                        success: true,
                        message: "Successfully get measurement unit"
                    },
                    data: {
                        unit: unit
                    }
                };
            } else {
                throw new CodeError("No purchase with such ID", 404);
            }
        } catch (err) {
            const code = err.statusCode || 500;
            const message = err.message || "Error during measurement unit search";
            return {
                meta: {
                    code: code,
                    success: false,
                    message: message
                },
                data: null
            };
        }
    },

    getAllUnits: async () => {
        try {
            let units = await MeasurementUnit
                .find({})
                .exec();

            units = units || [];

            return {
                meta: {
                    code: 200,
                    success: true,
                    message: "Successfully get measurement units"
                },
                data: {
                    units: units
                }
            };
        } catch (err) {
            const code = err.statusCode || 500;
            const message = err.message || "Error during measurement unit fetching";
            return {
                meta: {
                    code: code,
                    success: false,
                    message: message
                },
                data: null
            };
        }
    }
};
