const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
chai.use(chaiHttp);
const sequelize = require('../services/mysqlDB');

after(function (done) {
    sequelize.close();
    done();
});

describe('/GET home route', () => {
    it('it should gat all matches', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});
