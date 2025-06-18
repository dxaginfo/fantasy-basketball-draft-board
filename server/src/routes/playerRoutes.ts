import express from 'express';
import asyncHandler from 'express-async-handler';
import { body, param, validationResult } from 'express-validator';
import Player from '../models/playerModel';
import { AppError } from '../middleware/errorMiddleware';

const router = express.Router();

// @desc    Get all players
// @route   GET /api/players
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const players = await Player.find({});
  res.json(players);
}));

// @desc    Get player by ID
// @route   GET /api/players/:id
// @access  Public
router.get('/:id', 
  param('id').isMongoId().withMessage('Invalid player ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const player = await Player.findById(req.params.id);
    if (!player) {
      throw new AppError('Player not found', 404);
    }
    res.json(player);
  })
);

// @desc    Create player
// @route   POST /api/players
// @access  Private/Admin
router.post('/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('team').notEmpty().withMessage('Team is required'),
    body('positions').isArray().withMessage('Positions must be an array'),
    body('positions.*').isIn(['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL']).withMessage('Invalid position'),
    body('projectedRank').isNumeric().withMessage('Projected rank must be a number'),
    body('stats').isObject().withMessage('Stats must be an object'),
    body('stats.points').isNumeric().withMessage('Points must be a number'),
    body('stats.rebounds').isNumeric().withMessage('Rebounds must be a number'),
    body('stats.assists').isNumeric().withMessage('Assists must be a number'),
    body('stats.steals').isNumeric().withMessage('Steals must be a number'),
    body('stats.blocks').isNumeric().withMessage('Blocks must be a number'),
    body('stats.threePointers').isNumeric().withMessage('Three pointers must be a number'),
    body('stats.fieldGoalPercentage').isNumeric().withMessage('Field goal percentage must be a number'),
    body('stats.freeThrowPercentage').isNumeric().withMessage('Free throw percentage must be a number'),
    body('stats.turnovers').isNumeric().withMessage('Turnovers must be a number'),
    body('stats.minutes').isNumeric().withMessage('Minutes must be a number'),
    body('stats.games').isNumeric().withMessage('Games must be a number')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const player = new Player({
      name: req.body.name,
      team: req.body.team,
      positions: req.body.positions,
      stats: req.body.stats,
      projectedRank: req.body.projectedRank,
      adp: req.body.adp || req.body.projectedRank,
      tier: req.body.tier || Math.ceil(req.body.projectedRank / 20),
      injuryStatus: req.body.injuryStatus || '',
      notes: req.body.notes || ''
    });

    const createdPlayer = await player.save();
    res.status(201).json(createdPlayer);
  })
);

// @desc    Update player
// @route   PUT /api/players/:id
// @access  Private/Admin
router.put('/:id',
  param('id').isMongoId().withMessage('Invalid player ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const player = await Player.findById(req.params.id);
    if (!player) {
      throw new AppError('Player not found', 404);
    }

    // Update fields
    player.name = req.body.name || player.name;
    player.team = req.body.team || player.team;
    player.positions = req.body.positions || player.positions;
    player.stats = req.body.stats || player.stats;
    player.projectedRank = req.body.projectedRank || player.projectedRank;
    player.adp = req.body.adp || player.adp;
    player.tier = req.body.tier || player.tier;
    player.injuryStatus = req.body.injuryStatus !== undefined ? req.body.injuryStatus : player.injuryStatus;
    player.notes = req.body.notes || player.notes;
    player.lastUpdated = new Date();

    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  })
);

// @desc    Delete player
// @route   DELETE /api/players/:id
// @access  Private/Admin
router.delete('/:id',
  param('id').isMongoId().withMessage('Invalid player ID'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const player = await Player.findById(req.params.id);
    if (!player) {
      throw new AppError('Player not found', 404);
    }

    await player.deleteOne();
    res.json({ message: 'Player removed' });
  })
);

// @desc    Search players
// @route   GET /api/players/search/:query
// @access  Public
router.get('/search/:query', 
  asyncHandler(async (req, res) => {
    const query = req.params.query;
    const regex = new RegExp(query, 'i');

    const players = await Player.find({
      $or: [
        { name: regex },
        { team: regex }
      ]
    }).limit(20);

    res.json(players);
  })
);

export default router;