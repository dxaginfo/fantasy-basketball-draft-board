// User types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Player types
export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'G' | 'F' | 'UTIL';

export type InjuryStatus = 'Healthy' | 'Day-to-Day' | 'Out' | 'Injured Reserve' | 'Out for Season';

export interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  threePointersMade: number;
  fieldGoalPercentage: number;
  freeThrowPercentage: number;
  turnovers: number;
  gamesPlayed: number;
  minutesPerGame: number;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  positions: PlayerPosition[];
  age: number;
  height: string;
  weight: number;
  college?: string;
  jerseyNumber?: string;
  photoUrl?: string;
  injuryStatus: InjuryStatus;
  stats: {
    current: PlayerStats;
    projected: PlayerStats;
    previousSeason?: PlayerStats;
  };
  projectedRank: number;
  averageDraftPosition: number;
  positionScarcity: number;
}

// Draft types
export interface DraftSettings {
  teams: number;
  rounds: number;
  timePerPick: number;
  serpentine: boolean;
  positions: {
    PG: number;
    SG: number;
    SF: number;
    PF: number;
    C: number;
    G: number;
    F: number;
    UTIL: number;
    Bench: number;
  };
  scoringSystem: 'standard' | 'points' | 'categories' | 'custom';
  draftType: 'live' | 'mock' | 'autopick';
}

export interface DraftPick {
  playerId: string;
  pickNumber: number;
  round: number;
  timestamp: string;
}

export interface DraftTeam {
  id: string;
  name: string;
  owner?: string;
  draftPosition: number;
  picks: DraftPick[];
  isUser: boolean;
  strategy?: string;
}

export interface CurrentPick {
  round: number;
  pick: number;
  teamId: string;
}

export interface Draft {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  settings: DraftSettings;
  teams: DraftTeam[];
  currentPick: CurrentPick;
  isComplete: boolean;
}

// Mock Draft types
export interface MockDraftStrategy {
  id: string;
  name: string;
  description: string;
  preferences: {
    positions?: PlayerPosition[];
    stats?: (keyof PlayerStats)[];
    rookiePreference?: number;
    riskTolerance?: number;
    upside?: number;
  };
}

// UI types
export interface FilterConfig {
  positions: PlayerPosition[];
  teams: string[];
  searchTerm: string;
  minRank: number;
  maxRank: number;
  injuryStatus: InjuryStatus[];
}

export interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

// Analysis types
export interface TeamAnalysis {
  team: DraftTeam;
  strengths: (keyof PlayerStats)[];
  weaknesses: (keyof PlayerStats)[];
  categoryRatings: Record<keyof PlayerStats, number>;
  balanceScore: number;
  upside: number;
  risk: number;
  positionalBalance: Record<PlayerPosition, number>;
}

export interface LeagueProjection {
  teamId: string;
  projectedPoints: number;
  categoryRankings: Record<keyof PlayerStats, number>;
  projectedStanding: number;
}

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  dismissable?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface DraftSettingsFormData {
  name: string;
  teams: number;
  rounds: number;
  timePerPick: number;
  serpentine: boolean;
  positions: DraftSettings['positions'];
  scoringSystem: DraftSettings['scoringSystem'];
  draftType: DraftSettings['draftType'];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}