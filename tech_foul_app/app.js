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
  res.render('pages/homepage');
});

// Trying to pull data from db and display it
/* app.get('/', function (req, res) {
  db.query('SELECT * FROM /', function (err, result) {
    if (err) throw err;

    /// res.render() function
    res.render('pages/homepage', { data: result });
  });
}); */

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
