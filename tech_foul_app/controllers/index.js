const moment = require('moment');
const Matches = require('../models/match');
const sqlMatch = require('../models/sqlMatches');
const Team = require('../models/teams');
const TeamRating = require('../models/teamRatings');
const { log } = require('console');
const sequelize = require('../services/mysqlDB');

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
	});
	results.forEach((result) => {
		result.startTime = moment(result.epoch_time * 1000).format('HH:mm:ss');

		// Convert the `epoch_time` to the start time of the match in `hh:mm:ss` format using moment

		const startTime = new Date(result.epoch_time * 1000);
		const currentTime = new Date();
		const timeUntilStart = startTime - currentTime;
		const hoursUntilStart = Math.floor(timeUntilStart / 1000 / 60 / 60);
		const minutesUntilStart = Math.floor((timeUntilStart / 1000 / 60) % 60);

		// if (timeUntilStart <= 0) {
		//   result.timeUntilStart = 'Game Finished';
		// } else {
		result.timeUntilStart = `${hoursUntilStart} hours and ${minutesUntilStart} minutes`;
		// }
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
	const teams = req.body;
	const teamOne = teams.teamOne;
	const teamTwo = teams.teamTwo;
	const eloRatings = {};
	eloRatings.teamOne = [];
	eloRatings.teamTwo = [];
	const teamOneElo = await TeamRating.findAll({
		attributes: {
			include: ['rating', [sequelize.fn('DATE_FORMAT', sequelize.col('inserted_at'), '%Y-%m-%d'), 'inserted_at']],
		},
		where: {
			team_id: teamOne,
		},
		order: [['inserted_at', 'ASC']],
	});
	const teamTwoElo = await TeamRating.findAll({
		attributes: {
			include: ['rating', [sequelize.fn('DATE_FORMAT', sequelize.col('inserted_at'), '%Y-%m-%d'), 'inserted_at']],
		},
		where: {
			team_id: teamTwo,
		},
		order: [['inserted_at', 'ASC']],
	});
	if (teamOneElo.length > 0) {
		eloRatings.teamOne = teamOneElo;
	}
	if (teamTwoElo.length > 0) {
		eloRatings.teamTwo = teamTwoElo;
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
