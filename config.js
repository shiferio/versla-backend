const env = require('node-env-file');

const NODE_ENV = process.env.NODE_ENV || 'production';

if (NODE_ENV === 'production') {
    module.exports.database = process.env.MONGODB_URI || 'mongodb://versler:versla88@ds235251.mlab.com:35251/versla';
    module.exports.port = process.env.PORT || 3030;
} else {
    env('.env');
    module.exports.database = process.env.MONGODB_URI;
    module.exports.port = process.env.PORT;
}

module.exports.secret = "versla27052017";
