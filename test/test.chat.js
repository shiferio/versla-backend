process.env.NODE_ENV = 'test';

const config = require('../config');
const mongoose = require('mongoose');
const Chat = require('../models/chat');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');

const url = `http://localhost:${config.port}`;

chai.use(chaiHttp);
const should = chai.should();

async function createUser(overwritten = {}) {
    const userInfo = {
        login: 'test',
        phone: 'test_phone',
        email: 'test@email.test',
        password: '123456'
    };
    Object.assign(userInfo, overwritten);

    let res = await chai.request(url)
        .post('/api/accounts/signup')
        .send(userInfo);
    const token = res.body.data.token;

    res = await chai.request(url)
        .get('/api/accounts/profile')
        .set('Authorization', token);
    const userId = res.body.data.user._id;

    return {token, userId};
}

describe('Chats', function () {
    this.timeout(10000);

    let creatorToken = '';
    let creatorId = '';

    let anotherToken = '';
    let anotherId = '';

    before(async function (done) {
        // Create two users
        const creator = await createUser();
        creatorToken = creator.token;
        creatorId = creator.userId;

        const another = await createUser({
            login: 'another',
            phone: 'another_phone',
            email: 'another@email.another',
            password: '123456'
        });
        anotherToken = another.token;
        anotherId = another.userId;

        done();
    });

    describe('Chat creating', function () {
        it('It should create new chat', function (done) {
            chai.request(url)
                .post('/api/chats/new')
                .set('Authorization', creatorToken)
                .send({
                    user_id: anotherId
                })
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.body.meta.success.should.equal(true);

                    const chat = res.body.data.chat;
                    should.exist(chat);
                    chat.participants.should.have.lengthOf(2);

                    done();
                })
        });

        after(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await Chat.remove({}).exec();

            done();
        });
    });

    describe('Fetching all chats with user', function () {
        let chatId = '';

        before(async function (done) {
            // Create chat
            const res = await chai.request(url)
                .post('/api/chats/new')
                .set('Authorization', creatorToken)
                .send({
                    user_id: anotherId
                });
            chatId = res.body.data.chat._id;

            done();
        });

        it('It should fetch all chats with user', function (done) {
            chai.request(url)
                .get('/api/chats/all')
                .set('Authorization', creatorToken)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.body.meta.success.should.equal(true);

                    const chats = res.body.data.chats;
                    should.exist(chats);
                    chats.should.have.lengthOf(1);

                    done();
                })
        });

        after(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await Chat.remove({
                _id: chatId
            }).exec();

            done();
        })
    });

    after(async function (done) {
        // Clean up database
        await mongoose.connect(config.database);
        await User.remove({}).exec();

        done();
    })
});
