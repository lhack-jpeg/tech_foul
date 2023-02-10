require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_DB_USER,
  process.env.MYSQL_DB_PASS,
  {
    host: process.env.MYSQL_DB_HOST,
    dialect: 'mysql'
  }
)

module.exports = sequelize
