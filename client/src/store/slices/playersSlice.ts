import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Player, FilterConfig, SortConfig } from '../../types';
import axios from 'axios';

interface PlayersState {
  players: Player[];
  filteredPlayers: Player[];
  playerQueue: Player[];
  loading: boolean;
  error: string | null;
  filter: FilterConfig;
  sort: SortConfig;
  selectedPlayer: Player | null;
}

const initialState: PlayersState = {
  players: [],
  filteredPlayers: [],
  playerQueue: [],
  loading: false,
  error: null,
  filter: {
    positions: [],
    teams: [],
    searchTerm: '',
    minRank: 0,
    maxRank: 1000,
    injuryStatus: []
  },
  sort: {
    key: 'projectedRank',
    direction: 'ascending'
  },
  selectedPlayer: null
};

// Async Thunks
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/players');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchPlayerById = createAsyncThunk(
  'players/fetchPlayerById',
  async (playerId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/players/${playerId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<FilterConfig>>) => {
      state.filter = { ...state.filter, ...action.payload };
      state.filteredPlayers = applyFilters(state.players, state.filter);
      applySort(state);
    },
    setSort: (state, action: PayloadAction<SortConfig>) => {
      state.sort = action.payload;
      applySort(state);
    },
    addToQueue: (state, action: PayloadAction<Player>) => {
      if (!state.playerQueue.some(player => player.id === action.payload.id)) {
        state.playerQueue.push(action.payload);
      }
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.playerQueue = state.playerQueue.filter(player => player.id !== action.payload);
    },
    reorderQueue: (state, action: PayloadAction<{ oldIndex: number, newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload;
      const playerToMove = state.playerQueue[oldIndex];
      state.playerQueue.splice(oldIndex, 1);
      state.playerQueue.splice(newIndex, 0, playerToMove);
    },
    clearQueue: (state) => {
      state.playerQueue = [];
    },
    selectPlayer: (state, action: PayloadAction<Player>) => {
      state.selectedPlayer = action.payload;
    },
    clearSelectedPlayer: (state) => {
      state.selectedPlayer = null;
    },
    markPlayerAsDrafted: (state, action: PayloadAction<string>) => {
      // We don't remove the player from the players array, just update their status in the UI
      state.playerQueue = state.playerQueue.filter(player => player.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action: PayloadAction<Player[]>) => {
        state.loading = false;
        state.players = action.payload;
        state.filteredPlayers = applyFilters(action.payload, state.filter);
        applySort(state);
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPlayerById.fulfilled, (state, action: PayloadAction<Player>) => {
        const player = action.payload;
        // Update the player in the players array if it exists
        const index = state.players.findIndex(p => p.id === player.id);
        if (index !== -1) {
          state.players[index] = player;
        } else {
          state.players.push(player);
        }
        // Update filtered players and sort
        state.filteredPlayers = applyFilters(state.players, state.filter);
        applySort(state);
      });
  }
});

// Helper functions
function applyFilters(players: Player[], filter: FilterConfig): Player[] {
  return players.filter(player => {
    // Position filter
    if (filter.positions.length > 0 && !player.positions.some(pos => filter.positions.includes(pos))) {
      return false;
    }
    
    // Team filter
    if (filter.teams.length > 0 && !filter.teams.includes(player.team)) {
      return false;
    }
    
    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      if (!player.name.toLowerCase().includes(searchLower) && 
          !player.team.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    // Rank range filter
    if (player.projectedRank < filter.minRank || player.projectedRank > filter.maxRank) {
      return false;
    }
    
    // Injury status filter
    if (filter.injuryStatus.length > 0 && !filter.injuryStatus.includes(player.injuryStatus)) {
      return false;
    }
    
    return true;
  });
}

function applySort(state: PlayersState): void {
  state.filteredPlayers.sort((a, b) => {
    let valueA, valueB;
    
    // Handle nested properties like stats.points
    if (state.sort.key.includes('.')) {
      const [parent, child] = state.sort.key.split('.');
      valueA = a[parent as keyof Player][child as keyof typeof a[keyof Player]];
      valueB = b[parent as keyof Player][child as keyof typeof b[keyof Player]];
    } else {
      valueA = a[state.sort.key as keyof Player];
      valueB = b[state.sort.key as keyof Player];
    }
    
    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return state.sort.direction === 'ascending' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Handle number comparison
    return state.sort.direction === 'ascending' 
      ? (valueA as number) - (valueB as number) 
      : (valueB as number) - (valueA as number);
  });
}

export const { 
  setFilter,
  setSort,
  addToQueue,
  removeFromQueue,
  reorderQueue,
  clearQueue,
  selectPlayer,
  clearSelectedPlayer,
  markPlayerAsDrafted
} = playersSlice.actions;

export default playersSlice.reducer;