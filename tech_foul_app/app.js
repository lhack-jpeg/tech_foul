const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const port = 4000;

// Set config for app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('The app is working');
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
