const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const passport = require('passport');
const authStrategies = require('./authentication/strategies');

const config = require('./config');
const app = express();

mongoose.connect(config.database, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database")
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());

const userRoutes = require('./routes/account');
const storeRoutes = require('./routes/store');
const usersRoutes = require('./routes/users');
const goodsRoutes = require('./routes/goods');
const commentsRoutes = require('./routes/comment');
const ordersRoutes = require('./routes/orders');
const searchRoutes = require('./routes/search');
const categoryRoutes = require('./routes/caregories');

app.use('/api/accounts', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/search', searchRoutes);

app.use(express.static('public'));

authStrategies.localStrategy();
authStrategies.jwtStrategy();

app.listen(config.port, (err) => {
    console.log('App runned on ' + config.port);
});