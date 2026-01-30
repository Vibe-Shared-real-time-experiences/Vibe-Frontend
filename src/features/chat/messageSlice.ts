import type { UIAttachment, UIChannelMessages } from './../../types/chat/ui/message';
import { createSlice } from "@reduxjs/toolkit";
import { fetchMessagesByChannelId, sendMessage } from "./messageThunk";
import type { UIMessage } from "../../types/chat/ui/message";
interface MessageState {
    messagesByChannelId: Record<string, UIChannelMessages | null>;
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
            state.messagesByChannelId[channelId]!.messages!.push(action.payload);
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

                state.isLoading = false;
                state.error = null;
            }
        });
        builder.addCase(fetchMessagesByChannelId.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || "Failed to fetch messages";
        });

        // SEND MESSAGE
        builder.addCase(sendMessage.pending, (state, action) => {
            const { channelId, content, files } = action.meta.arg;
            const tempId = action.meta.requestId;

            const previewAttachments: UIAttachment[] = files.map(file => {
                const type = file.type.startsWith('image/') ? 'IMAGE'
                    : file.type.startsWith('video/') ? 'VIDEO'
                        : 'FILE';

                return {
                    url: URL.createObjectURL(file),
                    type: type,
                    contentType: file.type,
                    size: file.size,
                    isUploading: true
                };
            });

            // 1. Create temp message for optimistic UI
            const tempMessage: UIMessage = {
                id: tempId, // Using dispatch requestId as temp ID
                channelId,
                content: content,
                senderId: "me", // Placeholder, replace with actual sender ID
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                attachments: previewAttachments.map(att => ({
                    ...att,
                    isUploading: true
                })),
                metadata: null,
                status: "SENDING"
            };

            // 2. Add temp message to state immediately
            if (!state.messagesByChannelId[channelId]) {
                state.messagesByChannelId[channelId] = {
                    messages: [],
                    senders: [],
                    nextCursor: null,
                    hasMore: false,
                }
            }
            state.messagesByChannelId[channelId]!.messages!.unshift(tempMessage);

            state.isLoading = true;
            state.error = null;

            // 3. Cleanup preview URLs 
            // previewAttachments.forEach(att => URL.revokeObjectURL(att.url));
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const tempId = action.meta.requestId;

            const channelId = action.meta.arg.channelId;
            const { attachmentResponses } = action.payload

            // Replace temp message with real message
            const channelData = state.messagesByChannelId[channelId];
            if (channelData) {
                const index = channelData.messages!.findIndex(m => m.id === tempId);
                if (index !== -1) {
                    channelData.messages![index] = {
                        ...channelData.messages![index],
                        attachments: attachmentResponses,
                        status: "SUCCESS"
                    };
                }
            }

            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            const tempId = action.meta.requestId;

            const channelId = action.meta.arg.channelId;
            const channelData = state.messagesByChannelId[channelId];

            if (!channelData) return;

            const index = channelData.messages!.findIndex(m => m.id === tempId);
            if (index !== -1) {
                channelData.messages![index].status = "FAILED";
            }

            state.isLoading = false;
            state.error = "Failed to send message";
        });
    },
})

export default messageSlice.reducer;
export const { addRealTimeMessage, addOptimisticMessage } = messageSlice.actions;