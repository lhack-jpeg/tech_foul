const moment = require('moment')
const Matches = require('../models/match')
const sqlMatch = require('../models/sqlMatches')
const Team = require('../models/teams')
const { log } = require('console')

exports.getAllMatches = async (req, res, next) => {
  const results = await sqlMatch.findAll({
    include: [
      {
        model: Team,
        as: 'team_one_info'
      },
      {
        model: Team,
        as: 'team_two_info'
      }
    ]
  })
  results.forEach((result) => {
    result.startTime = moment(result.epoch_time * 1000).format('HH:mm:ss')
  })
  log(JSON.stringify(results))
  res.render('pages/homepage', { results })
}

// Display detail of a match that has been clicked on
exports.match_detail = async (req, res) => {
  const { match_id } = req.params
  console.log(`match_id is ${match_id}`)
  const results = await Matches.findOne({ match_id })
  const team_one = results.team_one
  const team_two = results.team_two
  console.log(results.team_one, results.team_two)
  res.render('pages/match_detail', { team_one, team_two })
}

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
