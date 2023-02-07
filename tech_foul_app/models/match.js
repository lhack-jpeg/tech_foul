const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  team_id: { type: String, required: true },
  team_name: { type: String, required: true },
  avg_gold_min: { type: Number, required: true },
  avg_xp_min: { type: Number, required: true },
  previous_performance: { type: String, required: true },
  previous_xp_advantage: { type: Number, required: true },
  previous_gold_advantage: { type: Number, required: true }
});

const MatchSchema = new Schema({
  match_id: { type: String, required: true },
  teams: [TeamSchema]
});

// Export model
module.exports = mongoose.model('Match', MatchSchema);
