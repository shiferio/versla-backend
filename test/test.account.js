process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Account', () => {
    describe('/POST Login', () => {
        it('it should login user', (done) => {
            let user = {
                email: "e@e.e",
                password: "654321"
            };
            chai.request('http://api.versla.ru/api')
                .post('/accounts/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('token');
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });

    describe('/POST Signup', () => {
        it('it should register user', (done) => {
            let user = {
                email: "e@e.e",
                password: "654321"
            };
            chai.request('http://api.versla.ru/api')
                .post('/accounts/signup')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(503);
                    res.body.meta.success.should.be.eql(false);
                    done();
                });
        });
    });

    describe('/GET Profile', () => {
        it('it should register user', (done) => {
            chai.request('http://api.versla.ru/api')
                .get('/accounts/profile')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjpmYWxzZSwiX2lkIjoiNWIyMGYwOTMwMzAzMWYyMjgwNzM3ZDVlIiwiY3JlYXRlZCI6IjIwMTgtMDYtMTNUMTA6MjM6MTUuMTM5WiIsInBhc3N3b3JkIjoiJDJhJDEwJDdtSWl2MENiemdySGlOTUFoWlBmQ3VTSGtsVXh2dGY0RW5oVkNFMEJNamdlNk56RWxpUjE2IiwiZW1haWwiOiJlQGUuZSIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZGIxMjdiMmViN2JlMGE3ZTY3ZDRmZTRhYzhiMTMwMzM_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg1NjUzLCJleHAiOjE1Mjk0OTA0NTN9.Qr4soJB-tzgBgEKFKd3nq2cbC1i3NZgvutL0FuKVyCQ')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);
                    res.body.data.should.have.property('user');
                    done();
                });
        });
    });

    describe('/POST Profile', () => {
        it('it should update profile', (done) => {
            let user = {
                first_name: "Lesha",
                phone: "88888888444"
            };
            chai.request('http://api.versla.ru/api')
                .post('/accounts/profile')
                .send(user)
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjpmYWxzZSwiX2lkIjoiNWIyMGYwOTMwMzAzMWYyMjgwNzM3ZDVlIiwiY3JlYXRlZCI6IjIwMTgtMDYtMTNUMTA6MjM6MTUuMTM5WiIsInBhc3N3b3JkIjoiJDJhJDEwJDdtSWl2MENiemdySGlOTUFoWlBmQ3VTSGtsVXh2dGY0RW5oVkNFMEJNamdlNk56RWxpUjE2IiwiZW1haWwiOiJlQGUuZSIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZGIxMjdiMmViN2JlMGE3ZTY3ZDRmZTRhYzhiMTMwMzM_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg1NjUzLCJleHAiOjE1Mjk0OTA0NTN9.Qr4soJB-tzgBgEKFKd3nq2cbC1i3NZgvutL0FuKVyCQ')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);
                    res.body.data.should.have.property('email');
                    done();
                });
        });
    });

    describe('/GET Stores', () => {
        it('it should register user', (done) => {
            chai.request('http://api.versla.ru/api')
                .get('/accounts/stores')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjpmYWxzZSwiX2lkIjoiNWIyMGYwOTMwMzAzMWYyMjgwNzM3ZDVlIiwiY3JlYXRlZCI6IjIwMTgtMDYtMTNUMTA6MjM6MTUuMTM5WiIsInBhc3N3b3JkIjoiJDJhJDEwJDdtSWl2MENiemdySGlOTUFoWlBmQ3VTSGtsVXh2dGY0RW5oVkNFMEJNamdlNk56RWxpUjE2IiwiZW1haWwiOiJlQGUuZSIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZGIxMjdiMmViN2JlMGE3ZTY3ZDRmZTRhYzhiMTMwMzM_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg1NjUzLCJleHAiOjE1Mjk0OTA0NTN9.Qr4soJB-tzgBgEKFKd3nq2cbC1i3NZgvutL0FuKVyCQ')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);
                    res.body.data.should.have.property('stores');
                    done();
                });
        });
    });

    describe('/PUT Address', () => {
        it('it should update address', (done) => {
            let address = {
                "addr1": "Street 1",
                "addr2": "Street 2",
                "city": "Kirov",
                "country": "Russia",
                "postalCode": "610000"
            };
            chai.request('http://api.versla.ru/api')
                .put('/accounts/profile/address')
                .send(address)
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjpmYWxzZSwiX2lkIjoiNWIyMGYwOTMwMzAzMWYyMjgwNzM3ZDVlIiwiY3JlYXRlZCI6IjIwMTgtMDYtMTNUMTA6MjM6MTUuMTM5WiIsInBhc3N3b3JkIjoiJDJhJDEwJDdtSWl2MENiemdySGlOTUFoWlBmQ3VTSGtsVXh2dGY0RW5oVkNFMEJNamdlNk56RWxpUjE2IiwiZW1haWwiOiJlQGUuZSIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZGIxMjdiMmViN2JlMGE3ZTY3ZDRmZTRhYzhiMTMwMzM_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg1NjUzLCJleHAiOjE1Mjk0OTA0NTN9.Qr4soJB-tzgBgEKFKd3nq2cbC1i3NZgvutL0FuKVyCQ')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });

    describe('/PUT Security', () => {
        it('it should update address', (done) => {
            let security = {
                "password": "654321",
                "old_password": "654321",
                "confirmation_password": "654321"
            };
            chai.request('http://api.versla.ru/api')
                .put('/accounts/profile/security')
                .send(security)
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjpmYWxzZSwiX2lkIjoiNWIyMGYwOTMwMzAzMWYyMjgwNzM3ZDVlIiwiY3JlYXRlZCI6IjIwMTgtMDYtMTNUMTA6MjM6MTUuMTM5WiIsInBhc3N3b3JkIjoiJDJhJDEwJDdtSWl2MENiemdySGlOTUFoWlBmQ3VTSGtsVXh2dGY0RW5oVkNFMEJNamdlNk56RWxpUjE2IiwiZW1haWwiOiJlQGUuZSIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZGIxMjdiMmViN2JlMGE3ZTY3ZDRmZTRhYzhiMTMwMzM_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg1NjUzLCJleHAiOjE1Mjk0OTA0NTN9.Qr4soJB-tzgBgEKFKd3nq2cbC1i3NZgvutL0FuKVyCQ')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });

    describe('/PUT Avatar', () => {
        it('it should update address', (done) => {
            let picture = {
                "picture": "654321"
            };
            chai.request('http://api.versla.ru/api')
                .put('/accounts/profile/avatar')
                .send(picture)
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjpmYWxzZSwiX2lkIjoiNWIyMGYwOTMwMzAzMWYyMjgwNzM3ZDVlIiwiY3JlYXRlZCI6IjIwMTgtMDYtMTNUMTA6MjM6MTUuMTM5WiIsInBhc3N3b3JkIjoiJDJhJDEwJDdtSWl2MENiemdySGlOTUFoWlBmQ3VTSGtsVXh2dGY0RW5oVkNFMEJNamdlNk56RWxpUjE2IiwiZW1haWwiOiJlQGUuZSIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvZGIxMjdiMmViN2JlMGE3ZTY3ZDRmZTRhYzhiMTMwMzM_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg1NjUzLCJleHAiOjE1Mjk0OTA0NTN9.Qr4soJB-tzgBgEKFKd3nq2cbC1i3NZgvutL0FuKVyCQ')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });
});