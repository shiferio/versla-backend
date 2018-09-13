process.env.NODE_ENV = 'test';

const config = require('../config');
const mongoose = require('mongoose');
const JointPurchase = require('../models/jointpurchase');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');

const url = `http://localhost:${config.port}`;

chai.use(chaiHttp);
const should = chai.should();

const DEFAULT_PURCHASE_INFO = {
    "name": "Test purchase",
    "picture": "http://via.placeholder.com/350x150",
    "description": "Some description",
    "category_id": "5b50669194263e1bb3ae430a",
    "address": "Kirov City",
    "city_id": "5b50669194263e1bb3ae430a",
    "volume": 5,
    "min_volume": 1,
    "price_per_unit": 50,
    "measurement_unit_id": "5b50669194263e1bb3ae430a",
    "date": Date.UTC(2018, 1, 1),
    "state": 0,
    "payment_type": 0,
    "is_public": true
};

async function createPurchase(token, overwritten = {}) {
    const purchaseInfo = Object.assign({}, DEFAULT_PURCHASE_INFO);
    Object.assign(purchaseInfo, overwritten);

    const res = await chai.request(url)
        .post('/api/jointpurchases/add')
        .set('Authorization', token)
        .send(purchaseInfo);
    return res.body.data.purchase._id;
}

async function createUser(overwritten = {}) {
    const userInfo = {
        login: 'test',
        phone: 'test_phone',
        email: 'test@email.test',
        password: '123456'
    };
    Object.assign(userInfo, overwritten);

    const res = await chai.request(url)
        .post('/api/accounts/signup')
        .send(userInfo);
    return res.body.data.token;
}

describe('Joint purchases', function () {
    let creatorToken = '';

    this.timeout(5000);

    before(async function (done) {
        // Clean up database
        await mongoose.connect(config.database);
        await User.remove({
            phone: {
                '$in': ['test_phone', 'another_phone']
            }
        }).exec();

        // Create test user
        creatorToken = await createUser();
        done();
    });

    describe('Add new purchase', function () {
        let purchaseId = '';

        it('It should add new purchase', function (done) {
            const purchaseInfo = Object.assign({}, DEFAULT_PURCHASE_INFO);
            chai.request(url)
                .post('/api/jointpurchases/add')
                .set('Authorization', creatorToken)
                .send(purchaseInfo)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.body.meta.success.should.equal(true);

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('purchase');

                    purchaseId = res.body.data.purchase._id;

                    done();
                });
        });

        it('It should add record into history when adding purchase', function (done) {
            const purchaseInfo = Object.assign({}, DEFAULT_PURCHASE_INFO);
            chai.request(url)
                .post('/api/jointpurchases/add')
                .set('Authorization', creatorToken)
                .send(purchaseInfo)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.body.meta.success.should.equal(true);

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('purchase');

                    purchaseId = res.body.data.purchase._id;

                    res.body.data.purchase.should.have.property('history');

                    const history = res.body.data.purchase.history;
                    history.should.have.lengthOf(1);
                    history[0].should.have.property('parameter');
                    history[0].parameter.should.equal('state');
                    history[0].should.have.property('value');
                    history[0].value.should.equal(0);

                    done();
                });
        });

        afterEach(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await JointPurchase.remove({
                _id: purchaseId
            }).exec();

            done();
        })
    });

    describe('Get purchase by ID', function () {
        let purchaseId = '';

        before(async function (done) {
            // Create new purchase
            purchaseId = await createPurchase(creatorToken, {
                name: 'Some long name'
            });

            done();
        });

        it('It should get purchase by ID', function (done) {
            chai.request(url)
                .get(`/api/jointpurchases/get/${purchaseId}`)
                .set('Authorization', creatorToken)
                .end((err, res) => {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.body.meta.success.should.equal(true);

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('purchase');

                    const purchase = res.body.data.purchase;
                    purchase.should.have.property('_id');
                    purchase._id.should.equal(purchaseId);
                    purchase.name.should.equal('Some long name');

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

        beforeEach(async function (done) {
            // Create new purchase
            purchaseId = await createPurchase(creatorToken);

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
                        should.not.exist(err);

                        res.should.have.status(200);
                        res.body.meta.success.should.equal(true);

                        res.body.should.have.property('data');
                        res.body.data.should.have.property('purchase');
                        res.body.data.purchase.name.should.equal('New name');

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
                        should.not.exist(err);

                        res.should.have.status(200);
                        res.body.meta.success.should.equal(true);

                        res.body.should.have.property('data');
                        res.body.data.should.have.property('purchase');
                        res.body.data.purchase.should.have.property('history');

                        const history = res.body.data.purchase.history;
                        history.should.have.lengthOf(2); // first item - purchase creation
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

        afterEach(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await JointPurchase.remove({
                _id: purchaseId
            }).exec();

            done();
        })
    });

    // TODO: Rewrite test cases according to the actual API
    /*describe('Black list manipulations', function () {
        let anotherToken = '';
        let userId = '';
        let purchaseId = '';

        beforeEach(async function (done) {
            // Create another test user
            anotherToken = await createUser({
                login: 'another',
                phone: 'another_phone',
                email: 'another@email.another',
                password: '123456'
            });

            const res = await chai.request(url)
                .get('/api/accounts/profile')
                .set('Authorization', anotherToken);
            userId = res.body.data.user._id;

            // Create new purchase
            purchaseId = await createPurchase(creatorToken);

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

        describe('Adding user to black list twice', function () {
            beforeEach(async function (done) {
                // Add user to black list
                await chai.request(url)
                    .put('/api/jointpurchases/black_list')
                    .set('Authorization', creatorToken)
                    .send({
                        id: purchaseId,
                        user_id: userId
                    });
                done();
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
        });

        describe('Removing user from black list', function () {
            beforeEach(async function (done) {
                // Add user to black list
                await chai.request(url)
                    .put('/api/jointpurchases/black_list')
                    .set('Authorization', creatorToken)
                    .send({
                        id: purchaseId,
                        user_id: userId
                    });
                done();
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
        });

        afterEach(async function (done) {
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
    });*/

    describe('Purchase participants', function () {
        describe('Join to purchase', function () {
            let purchaseId = '';

            before(async function (done) {
                // Create new purchase
                purchaseId = await createPurchase(creatorToken, {
                    volume: 10
                });

                done();
            });

            it('It should join to purchase', function (done) {
                chai.request(url)
                    .put('/api/jointpurchases/participants')
                    .set('Authorization', creatorToken)
                    .send({
                        id: purchaseId,
                        volume: 1
                    })
                    .end((err, res) => {
                        should.not.exist(err);

                        res.should.have.status(200);
                        res.body.meta.success.should.equal(true);

                        res.body.data.should.have.property('purchase');

                        const purchase = res.body.data.purchase;
                        purchase.remaining_volume.should.equal(9);
                        purchase.participants.should.have.lengthOf(1);

                        done();
                    })
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

        describe('Joining to purchase twice', function () {
            let purchaseId = '';

            before(async function (done) {
                // Create new purchase
                purchaseId = await createPurchase(creatorToken, {
                    volume: 10
                });
                // Join to it
                await chai.request(url)
                    .put('/api/jointpurchases/participants')
                    .set('Authorization', creatorToken)
                    .send({
                        id: purchaseId,
                        volume: 1
                    });

                done();
            });

            it('It should not join to purchase twice', function (done) {
                chai.request(url)
                    .put('/api/jointpurchases/participants')
                    .set('Authorization', creatorToken)
                    .send({
                        id: purchaseId,
                        volume: 1
                    })
                    .end((err, res) => {
                        should.exist(err);

                        done();
                    })
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

        describe('Volume control', function () {
            let anotherToken = '';
            let userId = '';
            let purchaseId = '';

            beforeEach(async function (done) {
                // Create new purchase
                purchaseId = await createPurchase(creatorToken, {
                    volume: 10,
                    min_volume: 3
                });

                // Create another test user
                anotherToken = await createUser({
                    login: 'another',
                    phone: 'another_phone',
                    email: 'another@email.another',
                    password: '123456'
                });

                const res = await chai.request(url)
                    .get('/api/accounts/profile')
                    .set('Authorization', anotherToken);
                userId = res.body.data.user._id;

                // Join to purchase
                await chai.request(url)
                    .put('/api/jointpurchases/participants')
                    .set('Authorization', anotherToken)
                    .send({
                        id: purchaseId,
                        volume: 3
                    });

                done();
            });

            it('It should not join when volume is lesser than minimum', function (done) {
                chai.request(url)
                    .put('/api/jointpurchases/participants')
                    .set('Authorization', creatorToken)
                    .send({
                        id: purchaseId,
                        volume: 1
                    })
                    .end((err, res) => {
                        should.exist(err);

                        done();
                    })
            });

            it('It should not join when volume is more than available', function (done) {
                chai.request(url)
                    .put('/api/jointpurchases/participants')
                    .set('Authorization', creatorToken)
                    .send({
                        id: purchaseId,
                        volume: 8
                    })
                    .end((err, res) => {
                        should.exist(err);

                        done();
                    })
            });

            afterEach(async function (done) {
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

        // TODO: Rewrite test cases according to the actual API
        /*describe('Access control', function () {
            let purchaseId = '';

            before(async function (done) {
                // Create new purchase
                purchaseId = await createPurchase(creatorToken, {
                    volume: 10
                });

                done();
            });

            describe('Black list control', function () {
                let anotherToken = '';
                let userId = '';

                before(async function (done) {
                    // Create another test user
                    anotherToken = await createUser({
                        login: 'another',
                        phone: 'another_phone',
                        email: 'another@email.another',
                        password: '123456'
                    });

                    const res = await chai.request(url)
                        .get('/api/accounts/profile')
                        .set('Authorization', anotherToken);
                    userId = res.body.data.user._id;

                    // Add user to black list
                    await chai.request(url)
                        .put('/api/jointpurchases/black_list')
                        .set('Authorization', creatorToken)
                        .send({
                            id: purchaseId,
                            user_id: userId
                        });

                    done();
                });

                it('It should not add banned user', function (done) {
                    chai.request(url)
                        .put('/api/jointpurchases/participants')
                        .set('Authorization', anotherToken)
                        .send({
                            id: purchaseId,
                            volume: 1
                        })
                        .end((err, res) => {
                            should.exist(err);

                            done();
                        })
                });

                after(async function (done) {
                    // Remove user from black list
                    await chai.request(url)
                        .delete('/api/jointpurchases/black_list')
                        .set('Authorization', creatorToken)
                        .send({
                            id: purchaseId,
                            user_id: userId
                        });

                    // Clean up database
                    await mongoose.connect(config.database);
                    await User.remove({
                        _id: userId
                    }).exec();

                    done();
                })
            });

            after(async function (done) {
                // Clean up database
                await mongoose.connect(config.database);
                await JointPurchase.remove({
                    _id: purchaseId
                }).exec();

                done();
            })
        })*/
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
