const Match = require('../models/match');

// Display detail of a match that has been clicked on
exports.match_detail = (req, res, next) => {
  Match.findById(req.params.id)
    .exec((error, results) => {
      if (error) {
        return next(error);
      }
      if (results == null) {
        // No results.
        const err = new Error('Match not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      results.render('pages/match_detail', {
        title: 'Match Detail'
        team_one: results.first_team,
        team_two: results.second_team,
      });
    });
  );
};
// Change team_id in database to 'team_id_1' and 'team_id_2' etc. for all entries
// Or, add further nested detail => match_id-first_team(team_one's details); second_team(team_two's details)