require('../node_modules/mysql2/');

const request = require('supertest');
const express = require('express');
const router = require('../routes/index');

const app = new express();

app.use('/', router);

describe('Good Home route', function () {
    test('responds to /', () => {
        request(app)
            .get('/')
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(res.body.length).toBeGreaterThan(0);
                done();
            });
    });
});
