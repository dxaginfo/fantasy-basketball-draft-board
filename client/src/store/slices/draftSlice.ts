import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Draft, DraftPick, DraftTeam, DraftSettings, CurrentPick } from '../../types';
import axios from 'axios';

interface DraftState {
  currentDraft: Draft | null;
  userDrafts: Draft[];
  loading: boolean;
  error: string | null;
  draftTime: number; // Countdown timer in seconds
  draftTimerActive: boolean;
  draftQueue: string[]; // Array of player IDs
}

const initialState: DraftState = {
  currentDraft: null,
  userDrafts: [],
  loading: false,
  error: null,
  draftTime: 90, // Default 90 seconds
  draftTimerActive: false,
  draftQueue: [],
};

// Async thunks
export const fetchUserDrafts = createAsyncThunk(
  'draft/fetchUserDrafts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/drafts');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while fetching drafts');
    }
  }
);

export const fetchDraftById = createAsyncThunk(
  'draft/fetchDraftById',
  async (draftId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/drafts/${draftId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while fetching the draft');
    }
  }
);

export const createDraft = createAsyncThunk(
  'draft/createDraft',
  async (draftData: Partial<Draft>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/drafts', draftData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while creating the draft');
    }
  }
);

export const updateDraft = createAsyncThunk(
  'draft/updateDraft',
  async ({ draftId, draftData }: { draftId: string; draftData: Partial<Draft> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/drafts/${draftId}`, draftData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while updating the draft');
    }
  }
);

export const addDraftPick = createAsyncThunk(
  'draft/addDraftPick',
  async ({ draftId, teamId, playerId }: { draftId: string; teamId: string; playerId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/drafts/${draftId}/teams/${teamId}/picks`, { playerId });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while adding a draft pick');
    }
  }
);

// Slice
const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    setCurrentDraft: (state, action: PayloadAction<Draft>) => {
      state.currentDraft = action.payload;
    },
    updateDraftTime: (state, action: PayloadAction<number>) => {
      state.draftTime = action.payload;
    },
    startDraftTimer: (state) => {
      state.draftTimerActive = true;
    },
    pauseDraftTimer: (state) => {
      state.draftTimerActive = false;
    },
    resetDraftTimer: (state) => {
      if (state.currentDraft) {
        state.draftTime = state.currentDraft.settings.timePerPick;
      } else {
        state.draftTime = 90; // Default
      }
    },
    addToQueue: (state, action: PayloadAction<string>) => {
      if (!state.draftQueue.includes(action.payload)) {
        state.draftQueue.push(action.payload);
      }
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.draftQueue = state.draftQueue.filter(id => id !== action.payload);
    },
    reorderQueue: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.draftQueue.splice(fromIndex, 1);
      state.draftQueue.splice(toIndex, 0, removed);
    },
    clearQueue: (state) => {
      state.draftQueue = [];
    },
    advanceToNextPick: (state) => {
      if (!state.currentDraft) return;
      
      const { currentPick, settings, teams } = state.currentDraft;
      const { round, pick } = currentPick;
      
      // Calculate next pick
      if (pick < settings.teams) {
        // Stay in the same round, move to next pick
        currentPick.pick += 1;
      } else {
        // Move to next round, reset pick
        currentPick.round += 1;
        currentPick.pick = 1;
      }
      
      // Handle serpentine drafting (reverse order in even rounds)
      if (settings.serpentine && currentPick.round % 2 === 0) {
        const teamIndex = settings.teams - currentPick.pick;
        currentPick.teamId = teams[teamIndex].id;
      } else {
        const teamIndex = currentPick.pick - 1;
        currentPick.teamId = teams[teamIndex].id;
      }
      
      // Reset timer for next pick
      state.draftTime = settings.timePerPick;
      state.draftTimerActive = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserDrafts
      .addCase(fetchUserDrafts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDrafts.fulfilled, (state, action) => {
        state.loading = false;
        state.userDrafts = action.payload;
      })
      .addCase(fetchUserDrafts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchDraftById
      .addCase(fetchDraftById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDraft = action.payload;
        state.draftTime = action.payload.settings.timePerPick;
      })
      .addCase(fetchDraftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createDraft
      .addCase(createDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDraft = action.payload;
        state.userDrafts.push(action.payload);
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateDraft
      .addCase(updateDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDraft = action.payload;
        state.userDrafts = state.userDrafts.map(draft => 
          draft.id === action.payload.id ? action.payload : draft
        );
      })
      .addCase(updateDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // addDraftPick
      .addCase(addDraftPick.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDraftPick.fulfilled, (state, action) => {
        state.loading = false;
        
        if (state.currentDraft) {
          // Update the team with the new pick
          const { teamId, pick } = action.payload;
          
          state.currentDraft.teams = state.currentDraft.teams.map(team => {
            if (team.id === teamId) {
              return {
                ...team,
                picks: [...team.picks, pick]
              };
            }
            return team;
          });
          
          // Auto-advance to next pick
          const advanceState = JSON.parse(JSON.stringify(state));
          draftSlice.caseReducers.advanceToNextPick(advanceState);
          
          // Update current state with the advanced pick
          state.currentDraft.currentPick = advanceState.currentDraft?.currentPick;
          state.draftTime = advanceState.draftTime;
          state.draftTimerActive = advanceState.draftTimerActive;
          
          // Remove picked player from queue if present
          if (state.draftQueue.includes(pick.playerId)) {
            state.draftQueue = state.draftQueue.filter(id => id !== pick.playerId);
          }
        }
      })
      .addCase(addDraftPick.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCurrentDraft, 
  updateDraftTime, 
  startDraftTimer, 
  pauseDraftTimer, 
  resetDraftTimer,
  addToQueue,
  removeFromQueue,
  reorderQueue,
  clearQueue,
  advanceToNextPick
} = draftSlice.actions;

export default draftSlice.reducer;