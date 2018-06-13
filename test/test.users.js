process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    describe('/GET User by Login', () => {
        it('it should get user', (done) => {
            chai.request('http://api.versla.ru/api')
                .get('/users/find/login/Lol')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('user');
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });

    describe('/GET User by Id', () => {
        it('it should get users', (done) => {
            chai.request('http://api.versla.ru/api')
                .get('/users/find/id/5b20f24703031f2280737d67')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('user');
                    res.body.meta.success.should.be.eql(true);
                    done();
                });
        });
    });
});