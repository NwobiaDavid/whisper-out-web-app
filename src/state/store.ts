import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './theme/themeSlice.ts';

const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
