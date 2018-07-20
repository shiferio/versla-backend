process.env.NODE_ENV = 'test';

const config = require('../config');
const mongoose = require('mongoose');
const JointPurchase = require('../models/jointpurchase');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');

const url = `http://localhost:${config.port}`;

chai.use(chaiHttp);
chai.should();

describe('Joint purchases', function () {
    let creatorToken = '';

    before(function (done) {
        // Create test user
        chai.request(url)
            .post('/api/accounts/signup')
            .send({
                login: 'test',
                phone: 'test_phone',
                email: 'test@email.test',
                password: '123456'
            })
            .end((err, res) => {
                creatorToken = res.body.data.token;
                done();
            })
    });

    describe('Add new purchase', function () {
        let purchaseId = '';

        it('It should add new purchase', function (done) {
            const purchaseInfo = {
                "name": "Name",
                "picture": "http://via.placeholder.com/350x150",
                "category_id": "5b50669194263e1bb3ae430a",
                "address": "Kirov City",
                "volume": 5,
                "price_per_unit": 50,
                "measurement_unit_id": "5b50669194263e1bb3ae430a",
                "date": Date.UTC(2018, 1, 1),
                "state": 0,
                "payment_type": 0
            };
            chai.request(url)
                .post('/api/jointpurchases/add')
                .set('Authorization', creatorToken)
                .send(purchaseInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('purchase');
                    res.body.data.should.not.be.eql(null);
                    res.body.meta.success.should.be.eql(true);

                    purchaseId = res.body.data.purchase._id;

                    done();
                });
        });

        it('It should get purchase by ID', function (done) {
            chai.request(url)
                .get(`/api/jointpurchases/get/${purchaseId}`)
                .set('Authorization', creatorToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('purchase');

                    const purchase = res.body.data.purchase;
                    purchase.should.have.property('_id');
                    purchase._id.should.equal(purchaseId);

                    done();
                });
        });

        after(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await JointPurchase.remove({
                _id: purchaseId
            }).exec();

            done();
        })
    });

    describe('Update fields', function () {
        let purchaseId = '';

        before(async function (done) {
            // Create new purchase
            const purchaseInfo = {
                "name": "Test purchase",
                "picture": "http://via.placeholder.com/350x150",
                "category_id": "5b50669194263e1bb3ae430a",
                "address": "Kirov City",
                "volume": 5,
                "price_per_unit": 50,
                "measurement_unit_id": "5b50669194263e1bb3ae430a",
                "date": Date.UTC(2018, 1, 1),
                "state": 0,
                "payment_type": 0
            };
            const res = await chai.request(url)
                .post('/api/jointpurchases/add')
                .set('Authorization', creatorToken)
                .send(purchaseInfo);
            purchaseId = res.body.data.purchase._id;

            done();
        });

        describe('Update modifiable field', () => {
            it('It should update name', function (done) {
                const body = {
                    id: purchaseId,
                    value: 'New name'
                };

                chai.request(url)
                    .put('/api/jointpurchases/update/name')
                    .set('Authorization', creatorToken)
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.meta.success.should.be.eql(true);

                        res.body.should.have.property('data');
                        res.body.data.should.have.property('purchase');
                        res.body.data.purchase.name.should.be.eql('New name');

                        done();
                    })
            });

            it('It should add record into history during update', function (done) {
                const body = {
                    id: purchaseId,
                    value: 'Test name'
                };

                chai.request(url)
                    .put('/api/jointpurchases/update/name')
                    .set('Authorization', creatorToken)
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.meta.success.should.be.eql(true);

                        res.body.should.have.property('data');
                        res.body.data.should.have.property('purchase');
                        res.body.data.purchase.should.have.property('history');

                        const history = res.body.data.purchase.history;
                        history.should.have.lengthOf(2); // we update field in the 'it' section above
                        history[1].should.have.property('parameter');
                        history[1].parameter.should.equal('name');
                        history[1].should.have.property('value');
                        history[1].value.should.equal('Test name');

                        done();
                    })
            })
        });

        describe('Update unmodifiable field', () => {
            it('It should not update name', function (done) {
                const body = {
                    id: purchaseId,
                    value: 'New name'
                };

                chai.request(url)
                    .put('/api/jointpurchases/update/history')
                    .set('Authorization', creatorToken)
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(404);

                        done();
                    })
            });
        });

        after(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await JointPurchase.remove({
                _id: purchaseId
            }).exec();

            done();
        })
    });

    describe('Black list manipulations', function () {
        let anotherToken = '';
        let userId = '';
        let purchaseId = '';

        before(async function (done) {
            // Create another test user
            let res = await chai.request(url)
                .post('/api/accounts/signup')
                .send({
                    login: 'another',
                    phone: 'another_phone',
                    email: 'another@email.another',
                    password: '123456'
                });
            anotherToken = res.body.data.token;

            res = await chai.request(url)
                .get('/api/accounts/profile')
                .set('Authorization', anotherToken);
            userId = res.body.data.user._id;

            // Create new purchase
            const purchaseInfo = {
                "name": "Test purchase",
                "picture": "http://via.placeholder.com/350x150",
                "category_id": "5b50669194263e1bb3ae430a",
                "address": "Kirov City",
                "volume": 5,
                "price_per_unit": 50,
                "measurement_unit_id": "5b50669194263e1bb3ae430a",
                "date": Date.UTC(2018, 1, 1),
                "state": 0,
                "payment_type": 0
            };
            res = await chai.request(url)
                .post('/api/jointpurchases/add')
                .set('Authorization', creatorToken)
                .send(purchaseInfo);
            purchaseId = res.body.data.purchase._id;

            done();
        });

        it('It should add user to black list', function (done) {
            const data = {
                id: purchaseId,
                user_id: userId
            };

            chai.request(url)
                .put('/api/jointpurchases/black_list')
                .set('Authorization', creatorToken)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('purchase');

                    const list = res.body.data.purchase.black_list;
                    list.length.should.be.eql(1);
                    list[0].should.be.eql(userId);

                    done();
                })
        });

        it('It should not add user to black list twice', function (done) {
            const data = {
                id: purchaseId,
                user_id: userId
            };

            chai.request(url)
                .put('/api/jointpurchases/black_list')
                .set('Authorization', creatorToken)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);

                    res.body.data.should.not.be.eql(null);
                    res.body.data.should.have.property('purchase');

                    const list = res.body.data.purchase.black_list;
                    list.length.should.be.eql(1);
                    list[0].should.be.eql(userId);

                    done();
                })
        });

        it('It should remove user from black list', function (done) {
            const data = {
                id: purchaseId,
                user_id: userId
            };

            chai.request(url)
                .delete('/api/jointpurchases/black_list')
                .set('Authorization', creatorToken)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);

                    res.body.data.should.not.be.eql(null);
                    res.body.data.should.have.property('purchase');

                    const list = res.body.data.purchase.black_list;
                    list.length.should.be.eql(0);

                    done();
                })
        });

        after(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await User.remove({
                _id: userId
            }).exec();
            await JointPurchase.remove({
                _id: purchaseId
            }).exec();

            done();
        })
    });

    after(async function (done) {
        // Clean up database
        await mongoose.connect(config.database);
        await User.remove({
            phone: 'test_phone'
        }).exec();

        done();
    })
});
