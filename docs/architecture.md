# Fantasy Basketball Draft Assistant - Architecture

## System Architecture

```
┌─────────────────────────────────────────────┐
│                                             │
│                  Client                     │
│                                             │
│  ┌─────────────┐       ┌───────────────┐   │
│  │   React     │       │     Redux     │   │
│  │  Components │◄─────►│     Store     │   │
│  └─────────────┘       └───────────────┘   │
│         ▲                      ▲           │
│         │                      │           │
│         ▼                      ▼           │
│  ┌─────────────┐       ┌───────────────┐   │
│  │    API      │       │  Local Data   │   │
│  │  Services   │       │    Cache      │   │
│  └─────────────┘       └───────────────┘   │
│         ▲                                  │
└─────────┼──────────────────────────────────┘
          │
          │ HTTP/REST
          ▼
┌─────────────────────────────────────────────┐
│                                             │
│                 Server                      │
│                                             │
│  ┌─────────────┐       ┌───────────────┐   │
│  │   Express   │       │  Controllers  │   │
│  │   Routes    │◄─────►│  & Services   │   │
│  └─────────────┘       └───────────────┘   │
│                               ▲            │
│                               │            │
│                               ▼            │
│                      ┌───────────────┐     │
│                      │    MongoDB    │     │
│                      │     Models    │     │
│                      └───────────────┘     │
│                               ▲            │
└───────────────────────────────┼────────────┘
                                │
                                ▼
                      ┌───────────────┐
                      │   MongoDB     │
                      │   Database    │
                      └───────────────┘
```

## Component Architecture

### Frontend Components

```
App
├── Header
│   ├── Navigation
│   └── UserProfile
│
├── DraftBoard
│   ├── TeamColumns
│   │   └── DraftPick
│   ├── DraftControls
│   │   ├── Timer
│   │   └── DraftStatus
│   └── CurrentPickDisplay
│
├── PlayerList
│   ├── PlayerSearchFilters
│   ├── PlayerTable
│   │   └── PlayerRow
│   └── PlayerQueue
│       └── QueuedPlayer
│
├── TeamAnalysis
│   ├── TeamStats
│   │   ├── CategoryRadarChart
│   │   └── PositionDistribution
│   ├── TeamRoster
│   └── ProjectedStandings
│
└── MockDraftSimulator
    ├── SimSettings
    ├── AITeamConfig
    ├── SimResults
    └── StrategyAnalysis
```

### Data Flow

1. **Player Data Flow**:
   ```
   API Data → Redux Store → Component Props → Rendered UI
   ```

2. **Draft Selection Flow**:
   ```
   User Selection → Redux Action → Store Update → UI Update → API Update
   ```

3. **Team Analysis Flow**:
   ```
   Team Data → Analysis Algorithms → Visualization Components → UI Rendering
   ```

## Database Schema

### Player Collection
```javascript
{
  _id: ObjectId,
  playerName: String,
  team: String,
  position: [String],  // Can have multiple positions
  stats: {
    points: Number,
    rebounds: Number,
    assists: Number,
    steals: Number,
    blocks: Number,
    threePointers: Number,
    fieldGoalPercentage: Number,
    freeThrowPercentage: Number,
    turnovers: Number
  },
  projectedRank: Number,
  injuryStatus: String,
  notes: String,
  lastUpdated: Date
}
```

### Draft Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  draftName: String,
  teams: [
    {
      teamName: String,
      position: Number,  // Draft position
      picks: [
        {
          round: Number,
          pickNumber: Number,
          playerId: ObjectId,
          timestamp: Date
        }
      ]
    }
  ],
  settings: {
    rounds: Number,
    teams: Number,
    timePerPick: Number,
    scoringFormat: String,
    serpentine: Boolean
  },
  status: String,  // "scheduled", "in-progress", "completed"
  createdAt: Date,
  updatedAt: Date
}
```

### User Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  passwordHash: String,
  savedDrafts: [ObjectId],
  preferences: {
    defaultScoringFormat: String,
    favoriteTeam: String,
    theme: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Player Endpoints
- `GET /api/players` - Get all players with filtering options
- `GET /api/players/:id` - Get a specific player
- `GET /api/players/positions/:position` - Get players by position
- `GET /api/players/rankings` - Get players sorted by projected rank

### Draft Endpoints
- `POST /api/drafts` - Create a new draft
- `GET /api/drafts` - Get all drafts for the user
- `GET /api/drafts/:id` - Get a specific draft
- `PUT /api/drafts/:id` - Update draft details
- `POST /api/drafts/:id/picks` - Add a new pick to the draft
- `GET /api/drafts/:id/recommendations` - Get AI recommendations for next pick

### Team Analysis Endpoints
- `GET /api/analysis/team/:draftId/:teamId` - Get team analysis
- `GET /api/analysis/standings/:draftId` - Get projected standings
- `GET /api/analysis/scarcity` - Get position scarcity analysis

### Mock Draft Endpoints
- `POST /api/mock/simulate` - Run a mock draft simulation
- `GET /api/mock/strategies` - Get available AI draft strategies
- `POST /api/mock/evaluate` - Evaluate a draft strategy

## Security Considerations

- JWT-based authentication for API access
- Input validation on all endpoints
- Rate limiting to prevent abuse
- HTTPS for all communications
- Secure storage of user credentials (hashed passwords)
- Regular security audits and dependency updates