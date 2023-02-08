const AppDataSource = require('../services/mysqlDB');
const AppError = require('../utilities/expressError');
const moment = require('moment');
const Matches = require('../models/match');
const sqlMatch = require('../models/matches');
const Team = require('../models/teams');

exports.getAllMatches = async (req, res, next) => {
    const matches = await AppDataSource.getRepository(sqlMatch)
        .createQueryBuilder('match')
        .leftJoinAndSelect(
            Team.logo_url,
            'teams',
            'teams.id = match.team_one_id'
        )
        .getMany();
    console.log(matches);
    res.send(matches);
    // conn.query(
    //     'SELECT\
    //     matches.id,\
    //     team_one,\
    //     team_two,\
    //     match_format,\
    //     epoch_time,\
    //     tournament_name,\
    //     t1.logo_url as team_one_logo,\
    //     t2.logo_url as team_two_logo\
    // FROM\
    //     matches\
    // LEFT JOIN\
    //     `teams` t1 ON (t1.id = matches.team_one_id)\
    // LEFT JOIN\
    //     `teams` t2 ON (t2.id = matches.team_two_id)',
    //     // To send a view you need to use res.render('route/to/view', {data to be sent through})
    //     function (error, results, fields) {
    //         if (error) return next(new AppError(error));

    //         // Convert the `epoch_time` to the start time of the match in `hh:mm:ss` format using moment
    //         results.forEach((result) => {
    //             result.startTime = moment(result.epoch_time * 1000).format(
    //                 'HH:mm:ss'
    //             );
    //         });

    //         res.render('pages/homepage', { results });
    //         console.log(results);
    //     }
    // )
};

// Display detail of a match that has been clicked on
exports.match_detail = async (req, res) => {
    const { match_id } = req.params;
    console.log(`match_id is ${match_id}`);
    const results = await Matches.findOne({ match_id: match_id });
    const team_one = results.team_one_stats;
    const team_two = results.team_two_stats;
    console.log(results.team_one_stats, results.team_two_stats);
    res.render('pages/match_detail', { team_one, team_two });
};
