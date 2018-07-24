const env = require('node-env-file');

const NODE_ENV = process.env.NODE_ENV || 'production';

if (NODE_ENV === 'production') {
    module.exports.database = process.env.MONGODB_URI || 'mongodb://owner:pwd222@ds159110.mlab.com:59110/versla_db';
    module.exports.port = process.env.PORT || 3030;
} else {
    env('.env');
    module.exports.database = process.env.MONGODB_URI;
    module.exports.port = process.env.PORT;
}

module.exports.secret = "versla27052017";
