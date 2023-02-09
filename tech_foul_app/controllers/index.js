const conn = require('../services/mysqlDB');
const AppError = require('../utilities/expressError');
const moment = require('moment');

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

      const currentDate = new Date();
      const currentDateString = currentDate.toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Convert the `epoch_time` to the start time of the match in `hh:mm:ss` format using moment
      results.forEach((result) => {
        const startTime = new Date(result.epoch_time * 1000);
        const currentTime = new Date();
        const timeUntilStart = startTime - currentTime;

        const hoursUntilStart = Math.floor(timeUntilStart / 1000 / 60 / 60);
        const minutesUntilStart = Math.floor((timeUntilStart / 1000 / 60) % 60);

        if (timeUntilStart <= 0) {
          result.timeUntilStart = 'Game Finished';
        } else {
          result.timeUntilStart = `${hoursUntilStart} hours and ${minutesUntilStart} minutes`;
        }
      });

      res.render('pages/homepage', { results, currentDate: currentDateString });
      console.log(results);
    }
  );
};
