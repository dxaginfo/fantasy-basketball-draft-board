import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './slices/playersSlice';
import draftReducer from './slices/draftSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import analysisReducer from './slices/analysisSlice';

export const store = configureStore({
  reducer: {
    players: playersReducer,
    draft: draftReducer,
    ui: uiReducer,
    user: userReducer,
    analysis: analysisReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;