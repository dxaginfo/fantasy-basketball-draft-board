import mongoose from 'mongoose';

// Player Stats Schema
const playerStatsSchema = new mongoose.Schema({
  points: {
    type: Number,
    required: true,
    default: 0
  },
  rebounds: {
    type: Number,
    required: true,
    default: 0
  },
  assists: {
    type: Number,
    required: true,
    default: 0
  },
  steals: {
    type: Number,
    required: true,
    default: 0
  },
  blocks: {
    type: Number,
    required: true,
    default: 0
  },
  threePointers: {
    type: Number,
    required: true,
    default: 0
  },
  fieldGoalPercentage: {
    type: Number,
    required: true,
    default: 0
  },
  freeThrowPercentage: {
    type: Number,
    required: true,
    default: 0
  },
  turnovers: {
    type: Number,
    required: true,
    default: 0
  },
  minutes: {
    type: Number,
    required: true,
    default: 0
  },
  games: {
    type: Number,
    required: true,
    default: 0
  }
});

// Player Schema
const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  team: {
    type: String,
    required: true,
    trim: true
  },
  positions: {
    type: [String],
    required: true,
    enum: ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL']
  },
  stats: {
    type: playerStatsSchema,
    required: true
  },
  projectedRank: {
    type: Number,
    required: true
  },
  adp: {
    type: Number,
    required: true,
    default: 999
  },
  tier: {
    type: Number,
    required: true,
    default: 10
  },
  injuryStatus: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for common queries
playerSchema.index({ name: 1 });
playerSchema.index({ team: 1 });
playerSchema.index({ positions: 1 });
playerSchema.index({ projectedRank: 1 });
playerSchema.index({ adp: 1 });

const Player = mongoose.model('Player', playerSchema);

export default Player;