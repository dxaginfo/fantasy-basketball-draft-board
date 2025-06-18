import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterConfig, SortConfig, PlayerPosition } from '../../types';

interface UiState {
  filterConfig: FilterConfig;
  sortConfig: SortConfig;
  activePage: 'draft' | 'players' | 'teams' | 'mock' | 'settings';
  sidebarOpen: boolean;
  darkMode: boolean;
  isMobile: boolean;
  activeTab: string;
  modalOpen: {
    newDraft: boolean;
    playerDetails: boolean;
    teamAnalysis: boolean;
    settings: boolean;
    help: boolean;
  };
  selectedPlayerId: string | null;
  selectedTeamId: string | null;
}

const initialState: UiState = {
  filterConfig: {
    positions: [],
    teams: [],
    searchTerm: '',
    minRank: 0,
    maxRank: 300,
    injuryStatus: [],
  },
  sortConfig: {
    key: 'projectedRank',
    direction: 'ascending',
  },
  activePage: 'draft',
  sidebarOpen: true,
  darkMode: false,
  isMobile: false,
  activeTab: 'available',
  modalOpen: {
    newDraft: false,
    playerDetails: false,
    teamAnalysis: false,
    settings: false,
    help: false,
  },
  selectedPlayerId: null,
  selectedTeamId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Filter actions
    setPositionFilter: (state, action: PayloadAction<PlayerPosition[]>) => {
      state.filterConfig.positions = action.payload;
    },
    setTeamFilter: (state, action: PayloadAction<string[]>) => {
      state.filterConfig.teams = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filterConfig.searchTerm = action.payload;
    },
    setRankRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.filterConfig.minRank = action.payload.min;
      state.filterConfig.maxRank = action.payload.max;
    },
    setInjuryStatusFilter: (state, action: PayloadAction<string[]>) => {
      state.filterConfig.injuryStatus = action.payload;
    },
    resetFilters: (state) => {
      state.filterConfig = initialState.filterConfig;
    },

    // Sort actions
    setSortConfig: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
    },
    toggleSortDirection: (state) => {
      state.sortConfig.direction = state.sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    },

    // Navigation actions
    setActivePage: (state, action: PayloadAction<UiState['activePage']>) => {
      state.activePage = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },

    // Display settings
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
      // Auto-close sidebar on mobile
      if (action.payload && state.sidebarOpen) {
        state.sidebarOpen = false;
      }
    },

    // Modal actions
    openModal: (state, action: PayloadAction<keyof UiState['modalOpen']>) => {
      state.modalOpen[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UiState['modalOpen']>) => {
      state.modalOpen[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modalOpen).forEach((key) => {
        state.modalOpen[key as keyof UiState['modalOpen']] = false;
      });
    },

    // Selection actions
    setSelectedPlayerId: (state, action: PayloadAction<string | null>) => {
      state.selectedPlayerId = action.payload;
    },
    setSelectedTeamId: (state, action: PayloadAction<string | null>) => {
      state.selectedTeamId = action.payload;
    },
  },
});

export const {
  setPositionFilter,
  setTeamFilter,
  setSearchTerm,
  setRankRange,
  setInjuryStatusFilter,
  resetFilters,
  setSortConfig,
  toggleSortDirection,
  setActivePage,
  toggleSidebar,
  setActiveTab,
  toggleDarkMode,
  setIsMobile,
  openModal,
  closeModal,
  closeAllModals,
  setSelectedPlayerId,
  setSelectedTeamId,
} = uiSlice.actions;

export default uiSlice.reducer;