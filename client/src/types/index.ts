// Player Types
export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'G' | 'F' | 'UTIL';

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

export interface Player {
  id: string;
  name: string;
  team: string;
  positions: PlayerPosition[];
  stats: PlayerStats;
  projectedRank: number;
  adp: number;
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
  timestamp: string;
}

export interface DraftTeam {
  id: string;
  name: string;
  position: number;
  owner: string;
  picks: DraftPick[];
}

export interface DraftSettings {
  rounds: number;
  teams: number;
  timePerPick: number;
  scoringFormat: 'standard' | 'points' | 'roto' | 'h2h' | 'custom';
  serpentine: boolean;
}

export interface CurrentPick {
  round: number;
  pick: number;
  teamId: string;
}

export interface Draft {
  id: string;
  name: string;
  user: string;
  teams: DraftTeam[];
  settings: DraftSettings;
  status: 'scheduled' | 'in-progress' | 'completed';
  currentPick: CurrentPick;
  createdAt: string;
  updatedAt: string;
}

// UI State Types
export interface FilterConfig {
  positions: PlayerPosition[];
  teams: string[];
  searchTerm: string;
  minRank: number;
  maxRank: number;
  injuryStatus: string[];
}

export interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

// Analysis Types
export interface CategoryScore {
  category: string;
  value: number;
  percentile: number;
}

export interface TeamAnalysis {
  teamId: string;
  categoryScores: CategoryScore[];
  positionBreakdown: Record<PlayerPosition, number>;
  weakestCategories: string[];
  strongestCategories: string[];
  balance: number; // 0-100 score for category balance
}

// Mock Draft Types
export interface MockDraftStrategy {
  id: string;
  name: string;
  description: string;
  priorityCategories?: string[];
  targetPositions?: PlayerPosition[];
  preferYoung?: boolean;
  preferVeterans?: boolean;
  riskTolerance?: number; // 0-100
}

export interface MockDraftSettings extends DraftSettings {
  strategies: Record<string, MockDraftStrategy>;
  yourPosition: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}