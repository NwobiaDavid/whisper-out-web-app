import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './theme/themeSlice.ts';
import unreadMessagesReducer from './unreadMessages/unreadMessagesSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    unreadMessages: unreadMessagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
