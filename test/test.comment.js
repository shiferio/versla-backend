process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('Comment', () => {
    describe('/POST Comment', () => {
        it('it should create comment', (done) => {
            let commentInfo = {
                "title": "Amazing good",
                "type": 1,
                "text": "The breakthrough revolutionary product",
                "good_id": "5b27bce94de6a514b4cf1462"
            };
            chai.request('http://api.versla.ru/api')
                .post('/comments/add')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU2VsbGVyIjp0cnVlLCJfaWQiOiI1YjIwZmEzNTAzMDMxZjIyODA3MzdkNzYiLCJjcmVhdGVkIjoiMjAxOC0wNi0xM1QxMTowNDoyMS40OTNaIiwibG9naW4iOiJkZW5pcyIsInBhc3N3b3JkIjoiJDJhJDEwJFZ4ZWd1MHh3ZllCWEVpSEZtUHpNU09GdkV0M2pZbjJkSC9zT0JqYmVCM1Zwck5yOGRHT3YuIiwiZW1haWwiOiJ0cmV2b3JAY2MuYyIsInBpY3R1cmUiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvM2UxYzg5MTcyODBiMzQxYTFlZDA3NTU0N2I5ZWQyNDA_czIwMCZkPXJldHJvIiwiX192IjowfSwiaWF0IjoxNTI4ODg4MTU2LCJleHAiOjE1Mjk0OTI5NTZ9.YTzlUZ177CtmgvqiiFntjz7I_GAVkL-pFLYI2y7_WGA')
                .send(commentInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('comment');
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });

    describe('/GET Comments for Good', () => {
        it('it get comments for good', (done) => {
            chai.request('http://api.versla.ru/api')
                .get('/comments/good/5b27bce94de6a514b4cf1462')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);
                    res.body.data.should.have.property('comments');
                    done();
                });
        });
    });
    describe('/GET Comments for Comment', () => {
        it('it should get comments for comment', (done) => {
            chai.request('http://api.versla.ru/api')
                .get('/comments/comment/5b2b9c252b0ea00b39fb6347')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.meta.success.should.be.eql(true);
                    res.body.data.should.have.property('comments');
                    done();
                });
        });
    });
});