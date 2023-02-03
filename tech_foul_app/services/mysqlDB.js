const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
    host: process.env.MYSQL_DB_HOST,
    port: '3306',
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASS,
    database: process.env.MYSQL_DB,
});

conn.connect(function (err) {
    if (err) {
        return console.error(`error: ${err.message}`);
    }
    console.log('Connected to server');
});

module.exports = conn;
