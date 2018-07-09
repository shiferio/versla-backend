const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const dbAccount = require('../utils/db/db.account');
const dbUser = require('../utils/db/db.users');
const config = require('../config');

const getToken = (req) => req.headers["authorization"];

module.exports = {

    localStrategy: () => {
        passport.use(new LocalStrategy({
                usernameField: 'phone',
                passwordField: 'password'
            },
            async (username, password, done) => {
                const data = await dbAccount.login({
                    phone: username,
                    password: password
                });
                return done(null, data);
            })
        );
    },

    jwtStrategy: () => {
        const options = {};
        options.jwtFromRequest = getToken;
        options.secretOrKey = config.secret;

        passport.use(new JwtStrategy(options, async (decoded, done) => {
            const userData = await dbUser
                .findUserById(decoded.user._id);
            return done(null, userData);
        }));
    }

};
