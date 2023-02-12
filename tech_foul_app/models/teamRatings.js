const { DataTypes, Deferrable } = require('sequelize');
const sequelize = require('../services/mysqlDB');
const teams = require('./teams');

const TeamRating = sequelize.define(
  'teamRating',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    team_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'teams',
        key: 'id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    rating: {
      type: DataTypes.FLOAT
    },
    wins: {
      type: DataTypes.INTEGER
    },
    losses: {
      type: DataTypes.INTEGER
    },
    last_match_time: {
      type: DataTypes.BIGINT
    },
    inserted_at: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: 'team_ratings',
    timestamps: false
  }
);

TeamRating.belongsTo(teams, {
  foreignKey: 'team_id',
  as: 'team_rating',
  targetKey: 'id'
});

module.exports = TeamRating;
