// This file contains the entity model for the TypeORM module.
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Match',
    tableName: 'matches',
    columns: {
        id: {
            primary: true,
            type: 'varchar',
        },
        team_one: {
            type: 'varchar',
        },
        team_two: {
            type: 'varchar',
        },
        match_format: {
            type: 'varchar',
        },
        epoch_time: {
            type: 'bigint',
        },
        match_time: {
            type: 'datetime',
        },
        tournament_name: {
            type: 'varchar',
        },
        team_one_id: {
            type: 'bigint',
        },
        team_two_id: {
            type: 'bigint',
        },
    },
});
