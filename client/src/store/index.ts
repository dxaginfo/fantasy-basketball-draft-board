import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './slices/playersSlice';
import draftReducer from './slices/draftSlice';
import uiReducer from './slices/uiSlice';
import mockDraftReducer from './slices/mockDraftSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    players: playersReducer,
    draft: draftReducer,
    ui: uiReducer,
    mockDraft: mockDraftReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;