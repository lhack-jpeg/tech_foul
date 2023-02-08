// This file contains the entity scheme for the teams table in the mySQL database using tpyeORM
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Team',
    tableName: 'teams',
    columns: {
        id: {
            primary: true,
            type: 'bigint',
        },
        name: {
            type: 'varchar',
        },
        logo_url: {
            type: 'text',
        },
        tag: {
            type: 'varchar',
        },
    },
    relations: {
        matches: {
            type: 'one-to-many',
            target: 'Match',
            inverseSide: 'match',
        },
    },
});
