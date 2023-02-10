const { DataTypes, Deferrable } = require('sequelize')
const sequelize = require('../services/mysqlDB')

const Team = sequelize.define(
  'Team',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    logo_url: {
      type: DataTypes.TEXT
    },
    tag: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'teams',
    timestamps: false
  }
)

module.exports = Team
