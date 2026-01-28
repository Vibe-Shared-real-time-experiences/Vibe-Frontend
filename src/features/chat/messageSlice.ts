import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChannelMessages, MessageResponse } from "../../types/chat/message";
import { fetchMessagesByChannelId, sendMessage } from "./messageThunk";
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

export const messageSlice = createSlice({
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
        },

        addOptimisticMessage: (state, action) => {
            const { channelId } = action.payload;
            state.messagesByChannelId[channelId]!.messages!.unshift(action.payload);
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

        // SEND MESSAGE
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const { key, realMessage } = action.payload
            const channelId = realMessage.channelId;

            // Tìm tin nhắn tạm bằng tempId và thay thế bằng tin thật
            const channelData = state.messagesByChannelId[channelId];
            if (channelData) {
                const index = channelData.messages!.findIndex(m => m.id === key);
                if (index !== -1) {
                    channelData.messages![index] = {
                        ...realMessage,
                        status: "sent" // 🟢 Đã gửi
                    };
                }
            }
        });

        // Gửi thất bại
        builder.addCase(sendMessage.rejected, (state, action) => {
            const { key } = action.payload as any; // Lấy tempId từ rejectValue
            // Tìm và update status = error để hiện màu đỏ
            // ... logic tìm index như trên ...
            const channelId = action.meta.arg.channelId;
            const channelData = state.messagesByChannelId[channelId];

            if (!channelData) return;

            const index = channelData.messages!.findIndex(m => m.id === key);
            if (index !== -1) {
                channelData.messages![index].status = "error"; // 🔴 Lỗi
            }
        });
    },
})

export default messageSlice.reducer;
export const { addRealTimeMessage, addOptimisticMessage } = messageSlice.actions;