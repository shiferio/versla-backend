const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

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

const userRoutes = require('./routes/account');
const storeRoutes = require('./routes/store');
const usersRoutes = require('./routes/users');
const goodsRoutes = require('./routes/goods');
const commentsRoutes = require('./routes/comment');

app.use('/api/accounts', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/comments', commentsRoutes);

app.use(express.static('public'));

app.listen(config.port, (err) => {
    console.log('App runned on ' + config.port);
});