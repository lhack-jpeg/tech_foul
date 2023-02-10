const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const AppError = require('./utilities/expressError');
const errorHandler = require('./utilities/errorHandler');
const favicon = require('serve-favicon');
const indexRouter = require('./routes/index');

// Set config for app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use('/', indexRouter);

mongoose.set('strictQuery', false);

// Wait for database to connect, logging an error if there is a problem
const mongoDBURL = process.env.MONGODB_URL;
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

app.get('/', (req, res) => {
  res.send('The app is working');
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  console.log({ err });
  res.status(status).render('pages/error', { err });
});
app.get('*', (req, res, next) => {
  next(new AppError(`The URL ${req.originalUrl} does not exist`, 404));
});

app.use(errorHandler);

module.exports = app;
