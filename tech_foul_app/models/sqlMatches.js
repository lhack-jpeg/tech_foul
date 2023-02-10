// This file contains the entity model for the matches table in mySQL using them TypeORM module.
const { DataTypes, Deferrable } = require('sequelize')
const sequelize = require('../services/mysqlDB')
const teams = require('./teams')

const SqlMatch = sequelize.define(
  'match',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    team_one: {
      type: DataTypes.STRING
    },
    team_two: {
      type: DataTypes.STRING
    },
    match_format: {
      type: DataTypes.STRING
    },
    match_time: {
      type: DataTypes.DATE
    },
    epoch_time: {
      type: DataTypes.BIGINT
    },
    team_one_id: {
      type: DataTypes.BIGINT,
      references: {
        model: teams,
        key: 'id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    team_two_id: {
      type: DataTypes.BIGINT,
      references: {
        model: teams,
        key: 'id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    }
  },
  {
    tableName: 'matches',
    timestamps: false
  }
)

SqlMatch.belongsTo(teams, {
  foreignKey: 'team_one_id',
  as: 'team_one_info',
  targetKey: 'id'
})
SqlMatch.belongsTo(teams, {
  foreignKey: 'team_two_id',
  as: 'team_two_info',
  targetKey: 'id'
})

module.exports = SqlMatch
