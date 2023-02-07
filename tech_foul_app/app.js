const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const AppError = require('./utilities/expressError');
const errorHandler = require('./utilities/errorHandler');

const indexRouter = require('./routes/index');

// Set config for app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

mongoose.set('strictQuery', false);
const mongoDB = 'mongodb+srv://haross:Gloucester@cluster0.r6m5ves.mongodb.net/mongo_test?retryWrites=true&w=majority';
// Wait for database to connect, logging an error if there is a problem
main().catch(err => console.log(err));
async function main () {
  await mongoose.connect(mongoDB);
}

app.get('/', (req, res) => {
  res.send('The app is working');
});

app.all('*', (req, res, next) => {
  next(new AppError(`The URL ${req.originalUrl} does not exist`, 404));
});

app.use(errorHandler);

module.exports = app;
