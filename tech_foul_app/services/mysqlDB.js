require('dotenv').config();
const { DataSource } = require('typeorm');

// const conn = mysql.createConnection({
//     host: process.env.MYSQL_DB_HOST,
//     port: '3306',
//     user: process.env.MYSQL_DB_USER,
//     password: process.env.MYSQL_DB_PASS,
//     database: process.env.MYSQL_DB,
// });

// conn.connect(function (err) {
//     if (err) {
//         return console.error(`error: ${err.message}`);
//     }
//     console.log('Connected to server');
// });

// module.exports = conn;

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_DB_HOST,
    port: '3306',
    username: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASS,
    database: process.env.MYSQL_DB,
    entities: [require('../models/matches')],
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error(`Error during initalisation process: ${err}`);
    });

module.exports = AppDataSource;
