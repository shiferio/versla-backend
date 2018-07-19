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

describe('Joint purchases', () => {
    let token = '';
    let purchaseId = '';

    before((done) => {
        // Create test user
        chai.request(url)
            .post('/api/accounts/signup')
            .send({
                phone: 'test_phone',
                password: '123456'
            })
            .end((err, res) => {
                token = res.body.data.token;
                done();
            })
    });

    describe('Add new purchase', function () {
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
                .set('Authorization', token)
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
    });

    describe('Update modifiable field', () => {
        it('It should update name', function (done) {
            const body = {
                id: purchaseId,
                value: 'New name'
            };

            chai.request(url)
                .put('/api/jointpurchases/update/name')
                .set('Authorization', token)
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('purchase');
                    res.body.data.should.not.be.eql(null);
                    res.body.meta.success.should.be.eql(true);
                    res.body.data.purchase.name.should.be.eql('New name');

                    done();
                })
        });
    });

    describe('Update unmodifiable field', () => {
        it('It should update name', function (done) {
            const body = {
                id: purchaseId,
                value: 'New name'
            };

            chai.request(url)
                .put('/api/jointpurchases/update/history')
                .set('Authorization', token)
                .send(body)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                })
        });
    });

    after(function (done) {
        // Clean up database
        mongoose.connect(config.database, async () => {
            await JointPurchase.remove({
                _id: purchaseId
            }).exec();

            await User.remove({
                phone: 'test_phone'
            }).exec();

            done();
        })
    })
});
