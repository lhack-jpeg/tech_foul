const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  wins: { type: Number, required: true },
  losses: { type: Number, required: true },
  avg_match_time: { type: Number, required: true },
  avg_score: { type: Number, required: true },
  first_blood_pct: { type: Number, required: true },
  prev_form: { type: String, required: true },
  elo_win_pct: { type: Number, required: true }
});

const MatchSchema = new Schema({
  match_id: { type: String, required: true },
  team_one: [TeamSchema],
  team_two: [TeamSchema]
});

// Syntax is model name, schema name, collection name
module.exports = mongoose.model('Matches', MatchSchema, 'matches');
