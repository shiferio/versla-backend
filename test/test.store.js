process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Store', () => {
    describe('/POST Store', () => {
        it('it should create store', (done) => {
            let storeInfo = {
                "name": "unitteststore name",
                "link": "unitteststore"
            };
            chai.request('http://api.versla.ru/api')
                .post('/stores/add')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjp0cnVlLCJfaWQiOiI1YjIwZmEzNTAzMDMxZjIyODA3MzdkNzYiLCJjcmVhdGVkIjoiMjAxOC0wNi0xM1QxMTowNDoyMS40OTNaIiwibG9naW4iOiJkZW5pcyIsInBhc3N3b3JkIjoiJDJhJDEwJFZ4ZWd1MHh3ZllCWEVpSEZtUHpNU09GdkV0M2pZbjJkSC9zT0JqYmVCM1Zwck5yOGRHT3YuIiwiZW1haWwiOiJ0cmV2b3JAY2MuYyIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvM2UxYzg5MTcyODBiMzQxYTFlZDA3NTU0N2I5ZWQyNDA_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg4MTU2LCJleHAiOjE1Mjk0OTI5NTZ9.YTzlUZ177CtmgvqiiFntjz7I_GAVkL-pFLYI2y7_WGA')
                .send(storeInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('store');
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });

    describe('/PUT Location', () => {
        it('it should update store locations', (done) => {
            let storeInfo = {
                link: "unitteststore",
                location: {
                    lat: 0,
                    lng: 0
                }
            };
            chai.request('http://api.versla.ru/api')
                .put('/stores/update/location')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjp0cnVlLCJfaWQiOiI1YjIwZmEzNTAzMDMxZjIyODA3MzdkNzYiLCJjcmVhdGVkIjoiMjAxOC0wNi0xM1QxMTowNDoyMS40OTNaIiwibG9naW4iOiJkZW5pcyIsInBhc3N3b3JkIjoiJDJhJDEwJFZ4ZWd1MHh3ZllCWEVpSEZtUHpNU09GdkV0M2pZbjJkSC9zT0JqYmVCM1Zwck5yOGRHT3YuIiwiZW1haWwiOiJ0cmV2b3JAY2MuYyIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvM2UxYzg5MTcyODBiMzQxYTFlZDA3NTU0N2I5ZWQyNDA_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg4MTU2LCJleHAiOjE1Mjk0OTI5NTZ9.YTzlUZ177CtmgvqiiFntjz7I_GAVkL-pFLYI2y7_WGA')
                .send(storeInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('store');
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });

    describe('/DELETE Store', () => {
        it('it should delete store', (done) => {
            let storeInfo = {
                "link": "unitteststore"
            };
            chai.request('http://api.versla.ru/api')
                .delete('/stores/delete')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjp0cnVlLCJfaWQiOiI1YjIwZmEzNTAzMDMxZjIyODA3MzdkNzYiLCJjcmVhdGVkIjoiMjAxOC0wNi0xM1QxMTowNDoyMS40OTNaIiwibG9naW4iOiJkZW5pcyIsInBhc3N3b3JkIjoiJDJhJDEwJFZ4ZWd1MHh3ZllCWEVpSEZtUHpNU09GdkV0M2pZbjJkSC9zT0JqYmVCM1Zwck5yOGRHT3YuIiwiZW1haWwiOiJ0cmV2b3JAY2MuYyIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvM2UxYzg5MTcyODBiMzQxYTFlZDA3NTU0N2I5ZWQyNDA_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg4MTU2LCJleHAiOjE1Mjk0OTI5NTZ9.YTzlUZ177CtmgvqiiFntjz7I_GAVkL-pFLYI2y7_WGA')
                .send(storeInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });
});