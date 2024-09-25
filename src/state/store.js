import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './theme/themeSlice.js';

const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export default store;
