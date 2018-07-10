const Error = require('../../models/error');
const Feature = require('../../models/feature');
const mongoose = require('mongoose');

module.exports = {
    addError: async (errorData) => {
        let userError = new Error();

        if (errorData.text) userError.text = errorData.text;
        if (errorData.email) userError.email = errorData.email;

        await userError.save();

        return {
            meta: {
                code: 200,
                success: true,
                message: "Error successfully added"
            },
            data: {
                error: userError
            }
        };
    },
    addFeature: async (featureData) => {
        let feature = new Feature();

        if (featureData.text) feature.text = featureData.text;
        if (featureData.email) feature.email = featureData.email;

        await feature.save();

        return {
            meta: {
                code: 200,
                success: true,
                message: "Feature successfully added"
            },
            data: {
                feature: feature
            }
        };
    },
};