import mongoose from 'mongoose';

// Draft Pick Schema
const draftPickSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true
  },
  pickNumber: {
    type: Number,
    required: true
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Draft Team Schema
const draftTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true,
    trim: true
  },
  picks: [draftPickSchema]
});

// Draft Settings Schema
const draftSettingsSchema = new mongoose.Schema({
  rounds: {
    type: Number,
    required: true,
    default: 13
  },
  teams: {
    type: Number,
    required: true,
    default: 12
  },
  timePerPick: {
    type: Number,
    required: true,
    default: 90 // seconds
  },
  scoringFormat: {
    type: String,
    required: true,
    enum: ['standard', 'points', 'roto', 'h2h', 'custom'],
    default: 'standard'
  },
  serpentine: {
    type: Boolean,
    required: true,
    default: true
  }
});

// Current Pick Schema
const currentPickSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true,
    default: 1
  },
  pick: {
    type: Number,
    required: true,
    default: 1
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

// Draft Schema
const draftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teams: [draftTeamSchema],
  settings: {
    type: draftSettingsSchema,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'in-progress', 'completed'],
    default: 'scheduled'
  },
  currentPick: {
    type: currentPickSchema,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
draftSchema.index({ user: 1 });
draftSchema.index({ status: 1 });
draftSchema.index({ createdAt: -1 });

const Draft = mongoose.model('Draft', draftSchema);

export default Draft;