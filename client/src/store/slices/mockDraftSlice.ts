import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Draft, DraftPick, DraftTeam, MockDraftStrategy } from '../../types';
import axios from 'axios';

interface MockDraftState {
  mockDraft: Draft | null;
  availableStrategies: MockDraftStrategy[];
  loading: boolean;
  error: string | null;
  simulationSpeed: 'slow' | 'normal' | 'fast';
  simulationPaused: boolean;
  simulationComplete: boolean;
  currentSimulationPick: number;
  totalPicks: number;
}

const initialState: MockDraftState = {
  mockDraft: null,
  availableStrategies: [],
  loading: false,
  error: null,
  simulationSpeed: 'normal',
  simulationPaused: false,
  simulationComplete: false,
  currentSimulationPick: 0,
  totalPicks: 0,
};

export const fetchAvailableStrategies = createAsyncThunk(
  'mockDraft/fetchAvailableStrategies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/mock-draft/strategies');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while fetching strategies');
    }
  }
);

export const startNewMockDraft = createAsyncThunk(
  'mockDraft/startNewMockDraft',
  async (draftConfig: Partial<Draft>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/mock-draft', draftConfig);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while creating a mock draft');
    }
  }
);

export const mockDraftSlice = createSlice({
  name: 'mockDraft',
  initialState,
  reducers: {
    resetMockDraft: (state) => {
      state.mockDraft = null;
      state.simulationPaused = false;
      state.simulationComplete = false;
      state.currentSimulationPick = 0;
    },
    setSimulationSpeed: (state, action: PayloadAction<'slow' | 'normal' | 'fast'>) => {
      state.simulationSpeed = action.payload;
    },
    pauseSimulation: (state) => {
      state.simulationPaused = true;
    },
    resumeSimulation: (state) => {
      state.simulationPaused = false;
    },
    completeSimulation: (state) => {
      state.simulationComplete = true;
      state.simulationPaused = false;
    },
    
    // Mock draft picks
    addMockDraftPick: (state, action: PayloadAction<{ teamId: string; playerId: string; pickNumber: number; round: number }>) => {
      if (!state.mockDraft) return;
      
      const { teamId, playerId, pickNumber, round } = action.payload;
      
      // Find the team
      const teamIndex = state.mockDraft.teams.findIndex(team => team.id === teamId);
      if (teamIndex === -1) return;
      
      // Create the pick
      const newPick: DraftPick = {
        playerId,
        pickNumber,
        round,
        timestamp: new Date().toISOString()
      };
      
      // Add pick to team
      state.mockDraft.teams[teamIndex].picks.push(newPick);
      
      // Update current pick counter
      state.currentSimulationPick += 1;
      
      // Check if simulation is complete
      if (state.currentSimulationPick >= state.totalPicks) {
        state.simulationComplete = true;
        state.simulationPaused = false;
      }
      
      // Update current pick in the draft
      if (state.mockDraft.currentPick) {
        // Increment pick within round
        if (state.mockDraft.currentPick.pick < state.mockDraft.settings.teams) {
          state.mockDraft.currentPick.pick += 1;
        } else {
          // Move to next round
          state.mockDraft.currentPick.round += 1;
          state.mockDraft.currentPick.pick = 1;
        }
        
        // Handle serpentine draft order
        if (state.mockDraft.settings.serpentine && state.mockDraft.currentPick.round % 2 === 0) {
          // Reverse order in even rounds
          const teamIndex = state.mockDraft.settings.teams - state.mockDraft.currentPick.pick;
          state.mockDraft.currentPick.teamId = state.mockDraft.teams[teamIndex].id;
        } else {
          // Standard order in odd rounds
          const teamIndex = state.mockDraft.currentPick.pick - 1;
          state.mockDraft.currentPick.teamId = state.mockDraft.teams[teamIndex].id;
        }
      }
    },
    
    // Setup total picks calculation
    initializeSimulation: (state) => {
      if (!state.mockDraft) return;
      
      state.totalPicks = state.mockDraft.settings.teams * state.mockDraft.settings.rounds;
      state.currentSimulationPick = 0;
      state.simulationComplete = false;
      state.simulationPaused = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableStrategies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableStrategies.fulfilled, (state, action) => {
        state.loading = false;
        state.availableStrategies = action.payload;
      })
      .addCase(fetchAvailableStrategies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(startNewMockDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startNewMockDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.mockDraft = action.payload;
        state.simulationComplete = false;
        state.simulationPaused = false;
        state.currentSimulationPick = 0;
        state.totalPicks = action.payload.settings.teams * action.payload.settings.rounds;
      })
      .addCase(startNewMockDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  resetMockDraft, 
  setSimulationSpeed, 
  pauseSimulation, 
  resumeSimulation, 
  completeSimulation,
  addMockDraftPick,
  initializeSimulation
} = mockDraftSlice.actions;

export default mockDraftSlice.reducer;