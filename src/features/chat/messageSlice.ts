import { createSlice } from "@reduxjs/toolkit";
import type { ChannelMessages } from "../../types/chat/message";
import { fetchMessagesByChannelId } from "./messageThunk";
import { getServerById } from "./serverThunk";

interface MessageState {
    messagesByChannelId: Record<string, ChannelMessages | null>;
    isLoading: boolean;
    error: string | null;
}

const initialState: MessageState = {
    messagesByChannelId: {},
    isLoading: false,
    error: null,
};

const messageSlice = createSlice({
    name: "message",
    initialState: initialState,
    reducers: {
        addRealTimeMessage: (state, action) => {
            const { channelId, message } = action.payload;
            if (!state.messagesByChannelId[channelId]) {
                state.messagesByChannelId[channelId] = {
                    messages: [],
                    senders: [],
                    nextCursor: null,
                    hasMore: false,
                };
            }

            state.messagesByChannelId[channelId].messages?.push(message);
        }
    },
    extraReducers: (builder) => {
        // FETCH MESSAGES BY CHANNEL ID
        builder.addCase(fetchMessagesByChannelId.pending, (state) => {
            state.messagesByChannelId = {};

            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchMessagesByChannelId.fulfilled, (state, action) => {
            const { channelId } = action.meta.arg;
            state.messagesByChannelId[channelId] = action.payload;

            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(fetchMessagesByChannelId.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || "Failed to fetch messages";
        });
    },
})

export default messageSlice.reducer;
export const { addRealTimeMessage } = messageSlice.actions;