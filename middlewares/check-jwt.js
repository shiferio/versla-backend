const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res, next) {
    let token = req.headers["authorization"];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                res.json({
                    meta: {
                        success: false,
                        code: 200,
                        message: 'Failed to authenticate token'
                    },
                    data: null
                })
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        res.status(403).json({
            meta: {
                success: false,
                code: 403,
                message: 'No token provided'
            },
            data: null
        })
    }
};