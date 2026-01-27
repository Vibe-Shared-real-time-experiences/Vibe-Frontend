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
        builder.addCase(fetchMessagesByChannelId.pending, (state, action) => {
            const { channelId } = action.meta.arg;

            if (!state.messagesByChannelId[channelId]) {
                state.messagesByChannelId[channelId] = {
                    messages: [],
                    senders: [],
                    nextCursor: null,
                    hasMore: true,
                };
            }

            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchMessagesByChannelId.fulfilled, (state, action) => {
            const { channelId } = action.meta.arg;
            // New if no existing messages
            if (!state.messagesByChannelId[channelId]) {
                state.messagesByChannelId[channelId] = action.payload;
            } else {
                // Append messages to existing ones
                state.messagesByChannelId[channelId]!.messages = [
                    ...(state.messagesByChannelId[channelId]!.messages ?? []),
                    ...(action.payload.messages ?? []),
                ];

                state.messagesByChannelId[channelId].nextCursor = action.payload.nextCursor;
                state.messagesByChannelId[channelId].hasMore = action.payload.hasMore;

                console.log("message: ", state.messagesByChannelId[channelId].messages);

                state.isLoading = false;
                state.error = null;
            }
        });
        builder.addCase(fetchMessagesByChannelId.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || "Failed to fetch messages";
        });
    },
})

export default messageSlice.reducer;
export const { addRealTimeMessage } = messageSlice.actions;