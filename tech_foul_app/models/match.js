const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  avg_match_time: { type: Number, required: true },
  avg_score: { type: Number, required: true },
  first_blood_pct: { type: Number, required: true },
  prev_form: { type: String, required: true }
});

const MatchSchema = new Schema({
  match_id: String,
  team_one_stats: [TeamSchema],
  team_two_stats: [TeamSchema]
});

module.exports = mongoose.model('Match', MatchSchema);
