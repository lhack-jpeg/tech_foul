const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
chai.use(chaiHttp);
const sequelize = require('../services/mysqlDB');
const sqlMatch = require('../models/sqlMatches');
const mongoose = require('mongoose');

after(function (done) {
  sequelize.close();
  mongoose.connection.close();
  done();
});

/*
 * Test the home route
 */

describe('/GET home route', () => {
  it('it should gat all matches', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

/*
 * Test the post route
 */

describe('/POST api route', () => {
  it('It should return the ratings of two teams', (done) => {
    let teams = {
      teamOne: 41,
      teamTwo: 4,
    };
  });
});
