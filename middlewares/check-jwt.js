const passport = require('passport');

module.exports = function (req, res, next) {

    passport.authenticate('jwt', function (err, data, jwt_err) {
        if (err) {
            res.status(403).json({
                meta: {
                    success: false,
                    code: 403,
                    message: 'No token provided'
                },
                data: null
            });
        } else if (jwt_err) {
            res.status(403).json({
                meta: {
                    success: false,
                    code: 403,
                    message: jwt_err.message
                },
                data: null
            });
        } else if (!data['meta'].success) {
            res.json({
                meta: {
                    success: false,
                    code: 200,
                    message: 'Failed to authenticate token'
                },
                data: null
            });
        } else {
            req.decoded = data['data'];
            next();
        }
    })(req, res, next);

};