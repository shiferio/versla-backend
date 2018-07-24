process.env.NODE_ENV = 'test';

const config = require('../config');
const mongoose = require('mongoose');
const MeasurementUnit = require('../models/measurementunit');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');

const url = `http://localhost:${config.port}`;

chai.use(chaiHttp);
const should = chai.should();

describe('Measurement units', function () {
    let token = '';

    before(async function (done) {
        // Create test user
        const res = await chai.request(url)
            .post('/api/accounts/signup')
            .send({
                phone: 'test_phone',
                password: '123456'
            });
        token = res.body.data.token;

        // Clean up database
        await mongoose.connect(config.database);
        await MeasurementUnit.remove({}).exec();

        done();
    });

    describe('Add new unit', function () {
        let unitId = '';

        const unitInfo = {
            name: 'Kg'
        };

        it('It should add new unit', function (done) {
            chai.request(url)
                .post('/api/measurementunits/add')
                .set('Authorization', token)
                .send(unitInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);

                    res.body.data.should.not.be.eql(null);
                    res.body.data.should.have.property('unit');
                    res.body.data.unit.should.have.property('_id');
                    res.body.data.unit.should.have.property('name');
                    res.body.data.unit.name.should.be.eql(unitInfo.name);

                    unitId = res.body.data.unit._id;

                    done();
                });
        });

        it('It should get unit by ID', function (done) {
            chai.request(url)
                .get(`/api/measurementunits/get/${unitId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);

                    res.body.data.should.not.be.eql(null);
                    res.body.data.should.have.property('unit');
                    res.body.data.unit.should.have.property('_id');
                    res.body.data.unit.should.have.property('name');
                    res.body.data.unit._id.should.be.eql(unitId);
                    res.body.data.unit.name.should.be.eql(unitInfo.name);

                    done();
                })
        });

        after(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await MeasurementUnit.remove({
                _id: unitId
            }).exec();

            done();
        })
    });

    describe('Add new unit with name exists', function () {
        let unitId2 = '';

        const unitInfo = {
            name: 'Kg'
        };

        before(function (done) {
            // Add new unit
            chai.request(url)
                .post('/api/measurementunits/add')
                .set('Authorization', token)
                .send(unitInfo)
                .end((err, res) => {
                    unitId2 = res.body.data.unit._id;
                    done();
                });
        });

        it('It should not add new unit', function (done) {
            chai.request(url)
                .post('/api/measurementunits/add')
                .set('Authorization', token)
                .send(unitInfo)
                .end((err, res) => {
                    res.should.not.have.status(200);
                    res.body.meta.success.should.be.eql(false);

                    should.exist(err);

                    done();
                });
        });

        after(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await MeasurementUnit.remove({
                _id: unitId2
            }).exec();

            done();
        })
    });

    describe('Get all units', function () {
        const unitNames = ['one', 'two'];
        const unitIds = [];

        before(async function (done) {
            // Create two units
            let res = await chai.request(url)
                .post('/api/measurementunits/add')
                .set('Authorization', token)
                .send({name: unitNames[0]});
            unitIds.push(res.body.data.unit._id);

            res = await chai.request(url)
                .post('/api/measurementunits/add')
                .set('Authorization', token)
                .send({name: unitNames[1]});
            unitIds.push(res.body.data.unit._id);

            done();
        });

        it('It should return all units', function (done) {
            chai.request(url)
                .get('/api/measurementunits/get')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);

                    res.body.data.should.not.be.eql(null);
                    res.body.data.should.have.property('units');
                    res.body.data.units.length.should.be.eql(unitIds.length);

                    done();
                })
        });

        after(async function (done) {
            // Clean up database
            await mongoose.connect(config.database);
            await MeasurementUnit.remove({
                _id: {'$in': unitIds}
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
