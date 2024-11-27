import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UnreadMessagesState {
  [channelTitle: string]: number; // Key is channel name, value is the count of unread messages
}

const initialState: UnreadMessagesState = {};

const unreadMessagesSlice = createSlice({
  name: 'unreadMessages',
  initialState,
  reducers: {
    setUnreadMessages: (
      state,
      action: PayloadAction<{ channelTitle: string; count: number }>
    ) => {
      state[action.payload.channelTitle] = action.payload.count;
    },
    resetUnreadMessages: (state, action: PayloadAction<string>) => {
      state[action.payload] = 0; // Reset unread messages for the specified channel
    },
  },
});

export const { setUnreadMessages, resetUnreadMessages } = unreadMessagesSlice.actions;

export default unreadMessagesSlice.reducer;
