const conn = require('../services/mysqlDB');
const AppError = require('../utilities/expressError');

exports.getAllMatches = (req, res, next) => {
    conn.query(
        'SELECT \
            matches.id,\
            team_one,\
            team_two,\
            match_format,\
            epoch_time,\
            tournament_name,\
            t1.logo_url as team_one_logo,\
            t2.logo_url as team_two_logo\
        FROM matches\
        LEFT JOIN `teams` t1 ON (t1.id = matches.team_one_id)\
        LEFT JOIN `teams` t2 ON(t2.id = matches.team_two_id)',
        (err, data, fields) => {
            if (err) return next(new AppError(err));
            res.status(200).json({
                status: 'success',
                data: data,
            });
        }
    );
};
