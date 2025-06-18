// Player Types
export interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  threePointers: number;
  fieldGoalPercentage: number;
  freeThrowPercentage: number;
  turnovers: number;
  minutes: number;
  games: number;
}

export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'G' | 'F' | 'UTIL';

export interface Player {
  id: string;
  name: string;
  team: string;
  positions: PlayerPosition[];
  stats: PlayerStats;
  projectedRank: number;
  adp: number; // Average Draft Position
  tier: number;
  injuryStatus: string;
  notes: string;
  lastUpdated: string;
}

// Draft Types
export interface DraftPick {
  round: number;
  pickNumber: number;
  playerId: string;
  player?: Player;
  timestamp: string;
}

export interface DraftTeam {
  id: string;
  name: string;
  position: number; // Draft position
  owner: string;
  picks: DraftPick[];
}

export type DraftStatus = 'scheduled' | 'in-progress' | 'completed';

export interface DraftSettings {
  rounds: number;
  teams: number;
  timePerPick: number;
  scoringFormat: ScoringFormat;
  serpentine: boolean;
}

export type ScoringFormat = 'standard' | 'points' | 'roto' | 'h2h' | 'custom';

export interface Draft {
  id: string;
  name: string;
  teams: DraftTeam[];
  settings: DraftSettings;
  status: DraftStatus;
  currentPick: {
    round: number;
    pick: number;
    teamId: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Team Analysis Types
export interface CategoryScore {
  category: string;
  score: number;
  rank: number;
  percentile: number;
}

export interface TeamAnalysis {
  teamId: string;
  draftId: string;
  categoryScores: CategoryScore[];
  positionalBreakdown: {
    [key in PlayerPosition]: number;
  };
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  projectedStanding: number;
}

// Mock Draft Types
export type DraftStrategy = 
  | 'best-player-available'
  | 'position-scarcity'
  | 'category-focus'
  | 'balanced'
  | 'upside-potential'
  | 'custom';

export interface MockDraftSettings extends DraftSettings {
  userPosition: number;
  aiStrategies: {
    teamId: string;
    strategy: DraftStrategy;
    categoryFocus?: string[];
  }[];
}

export interface MockDraftResult {
  draft: Draft;
  teamAnalyses: TeamAnalysis[];
  summary: {
    userTeamRank: number;
    bestValuePick: DraftPick;
    missedOpportunities: {
      round: number;
      pickedPlayerId: string;
      betterAvailableId: string;
    }[];
  };
}

// UI Types
export interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

export interface FilterConfig {
  positions: PlayerPosition[];
  teams: string[];
  searchTerm: string;
  minRank: number;
  maxRank: number;
  injuryStatus: string[];
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  preferences: {
    defaultScoringFormat: ScoringFormat;
    favoriteTeam?: string;
    theme: 'light' | 'dark' | 'system';
  };
}