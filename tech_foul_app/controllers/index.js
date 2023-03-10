const moment = require('moment');
const Matches = require('../models/match');
const sqlMatch = require('../models/sqlMatches');
const Team = require('../models/teams');
const TeamRating = require('../models/teamRatings');
const { log } = require('console');
const sequelize = require('../services/mysqlDB');
const fetch = require('node-fetch');

const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
const todayDate = new Date().toLocaleDateString('en-AU', dateOptions);

// Renders the current date in a longer format
exports.getAllMatches = async (req, res, next) => {
  const results = await sqlMatch.findAll({
    include: [
      {
        model: Team,
        as: 'team_one_info',
      },
      {
        model: Team,
        as: 'team_two_info',
      },
    ],
    order: ['match_time'],
  });
  results.forEach((result) => {
    result.startTime = moment(result.epoch_time * 1000).format('HH:mm:ss');

    // Convert the `epoch_time` to the start time of the match in `hh:mm:ss` format using moment

    const startTime = new Date(result.epoch_time * 1000);
    const currentTime = new Date();
    const timeUntilStart = startTime - currentTime;
    const hoursUntilStart = Math.floor(timeUntilStart / 1000 / 60 / 60);
    const minutesUntilStart = Math.floor((timeUntilStart / 1000 / 60) % 60);

    if (timeUntilStart < 0 && timeUntilStart > -3600) {
      result.timeUntilStart = 'Live';
    } else if (timeUntilStart < -3600) {
      result.timeUntilStart = 'Game Finished';
    } else {
      result.timeUntilStart = `${hoursUntilStart} hours and ${minutesUntilStart} minutes`;
    }
  });

  // Renders the current date in a longer format
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  res.render('pages/homepage', { results, currentDate: currentDateString });
};

exports.getTeamData = async (req, res) => {
  const team = req.body;
  const teamId = team.team;
  const eloRatings = {};
  eloRatings.type = '';
  eloRatings.team = [];
  const teamOneElo = await TeamRating.findAll({
    attributes: {
      include: [
        'rating',
        [
          sequelize.fn('DATE_FORMAT', sequelize.col('inserted_at'), '%Y-%m-%d'),
          'inserted_at',
        ],
      ],
    },
    where: {
      team_id: teamId,
    },
    order: [['inserted_at', 'ASC']],
  });
  if (teamOneElo.length > 0) {
    eloRatings.team = teamOneElo;
    eloRatings.type = 'line';
  } else {
    const response = await fetch(
      `https://api.opendota.com/api/teams/${teamId}`,
      {
        method: 'GET',
        headers: {
          api_key: process.env.API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    const teamData = await response.json();
    eloRatings.team = [{ rating: teamData.rating, inserted_at: todayDate }];
    eloRatings.type = 'bar';
  }
  res.status(200).send(eloRatings);
};

// Display detail of a match that has been clicked on
exports.match_detail = async (req, res) => {
  const { match_id } = req.params;
  console.log(`match_id is ${match_id}`);
  const results = await Matches.findOne({ match_id });
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  try {
    const team_one = results.team_one;
    const team_two = results.team_two;
    res.render('pages/match_detail', {
      epoch: results.epoch_time,
      team_one,
      team_two,
      currentDate: currentDateString,
    });
  } catch (err) {
    res.status(404).render('pages/error', { err });
  }
};
