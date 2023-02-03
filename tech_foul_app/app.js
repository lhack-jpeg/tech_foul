const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const router = require('./routes');
const AppError = require('./utilities/expressError');
const errorHandler = require('./utilities/errorHandler');

// Set config for app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.get('/', (req, res) => {
    res.send('The app is working');
});

app.all('*', (req, res, next) => {
    next(new AppError(`The URL ${req.originalUrl} does not exist`, 404));
});

app.use(errorHandler);

module.exports = app;
