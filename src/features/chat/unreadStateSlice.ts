import { createSlice } from "@reduxjs/toolkit";
import { fetchUnreadStateByChannelId, markChannelAsRead } from "./unreadStateThunk";
import type { UserReadStateResponse } from "../../types/user/api/userReadState";

interface UnreadState {
    unreadChannel: Record<string, UserReadStateResponse> | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UnreadState = {
    unreadChannel: null,
    isLoading: false,
    error: null,
};

export const unreadStateSlice = createSlice({
    name: "unreadState",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Unread Channels
        builder.addCase(fetchUnreadStateByChannelId.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchUnreadStateByChannelId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.unreadChannel = {};
            const data = action.payload;
            state.unreadChannel[data.channelId] = data;
        });
        builder.addCase(fetchUnreadStateByChannelId.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Update Unread State by Channel ID
        builder.addCase(markChannelAsRead.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(markChannelAsRead.fulfilled, (state, action) => {
            const lastReadMsg = action.meta.arg.lastReadMessageId;
            const channelId = action.meta.arg.channelId;

            if (state.unreadChannel) {
                state.unreadChannel[channelId].lastReadMessageId = lastReadMsg;
                state.unreadChannel[channelId].unread = false
            }

            state.isLoading = false;
        });
        builder.addCase(markChannelAsRead.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const unreadStateReducer = unreadStateSlice.reducer;