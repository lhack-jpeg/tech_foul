const conn = require('../services/mysqlDB');
const AppError = require('../utilities/expressError');
const moment = require('moment');
const Matches = require('../models/match');

exports.getAllMatches = (req, res, next) => {
  conn.query(
    'SELECT\
        matches.id,\
        team_one,\
        team_two,\
        match_format,\
        epoch_time,\
        tournament_name,\
        t1.logo_url as team_one_logo,\
        t2.logo_url as team_two_logo\
    FROM\
        matches\
    LEFT JOIN\
        `teams` t1 ON (t1.id = matches.team_one_id)\
    LEFT JOIN\
        `teams` t2 ON (t2.id = matches.team_two_id)',
    // To send a view you need to use res.render('route/to/view', {data to be sent through})
    function (error, results, fields) {
      if (error) return next(new AppError(error));

      // Convert the `epoch_time` to the start time of the match in `hh:mm:ss` format using moment
      results.forEach((result) => {
        result.startTime = moment(result.epoch_time * 1000).format('HH:mm:ss');
      });

      res.render('pages/homepage', { results });
      res.render('pages/match_detail', { results });
      console.log(results);
    }
  );
};

// Display detail of a match that has been clicked on
exports.match_detail = async (req, res) => {
  const { match_id } = req.params;
  console.log(`match_id is ${match_id}`);
  const results = await Matches.findOne({ match_id: match_id });
  const team_one = results.team_one;
  const team_two = results.team_two;
  console.log(results.team_one, results.team_two);
  res.render('pages/match_detail', { team_one, team_two });
};

// exports.match_detail = async (req, res, next) => {
//  const { match_id } = req.params;
//  console.log(`match_id is ${match_id}`);
//  await Matches.findOne({ match_id: match_id })
//    .exec(function (err, results) {
//      if (err) {
//        return next(err);
//      }
//      const team_one = results.team_one;
//      const team_two = results.team_two;
//      console.log(results.team_one, results.team_two);
// Successful, so render.
//      res.render('pages/match_detail', { team_one, team_two });
//    });
// };
