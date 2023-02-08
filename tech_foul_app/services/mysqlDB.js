require('dotenv').config();
const { Sequelize } = require('sequelize');

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

const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_DB_USER,
    process.env.MYSQL_DB_PASS,
    {
        host: process.env.MYSQL_DB_HOST,
        dialect: 'mysql',
    }
);

module.exports = sequelize;
