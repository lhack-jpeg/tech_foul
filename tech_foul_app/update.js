const userArgs = process.argv.slice(2);

const Match = require('./models/match');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

mongoose
  .connect(mongoDB)
  .then(function () {
    console.log('Database connected!');

    const matchone = new Match({
      match_id: '12345',
      teams: [{
        team_id: 'teamone123',
        team_name: 'Team One',
        avg_gold_min: '1',
        avg_xp_min: '2',
        previous_performance: 'Poor',
        previous_xp_advantage: '3',
        previous_gold_advantage: '4'
      }, {
        team_id: 'teamtwo456',
        team_name: 'Team Two',
        avg_gold_min: '5',
        avg_xp_min: '6',
        previous_performance: 'Excellent',
        previous_xp_advantage: '7',
        previous_gold_advantage: '8'
      }]
    });
    matchone.save(function (error, document) {
      if (error) console.error(error);
      console.log(document);
    });
  })
;