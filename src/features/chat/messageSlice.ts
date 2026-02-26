import type { UIAttachment, UIChannelMessages } from './../../types/chat/ui/message';
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMessagesByChannelId, sendMessage } from "./messageThunk";
import type { UIMessage } from "../../types/chat/ui/message";
import type { WsMessageResponse } from '../../types/socket';
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
        addRealTimeMessage: (state, action: PayloadAction<WsMessageResponse>) => {
            const channelId = action.payload.channelId;
            const message = action.payload;

            if (!state.messagesByChannelId[channelId]) {
                state.messagesByChannelId[channelId] = {
                    messages: [],
                    memberInfos: [],
                    headCursor: null,
                    tailCursor: null,
                    hasMoreOlder: false,
                    hasMoreNewer: false,
                };
            }

            const existed = state.messagesByChannelId[channelId]!.messages!.find(m => m.id == message.id);
            if (existed) return;

            const UIMessage = {
                id: message.id,
                channelId: message.channelId,
                content: message.content,
                authorId: message.authorId,
                createdAt: message.createdAt,
                attachments: message.attachments?.map(att => ({
                    id: att.id,
                    url: att.url,
                    type: att.type,
                })) as UIAttachment[],
                metadata: null,
            } as UIMessage;

            console.log("add new msg to reducer");

            state.messagesByChannelId[channelId].messages?.unshift(UIMessage);
        },

        addTempNewMessage: (state, action) => {
            const { channelId } = action.payload;
            const message = action.payload;

            const existed = state.messagesByChannelId[channelId]!.messages!.find(m => m.id === message.id);
            if (existed) return;

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
                    memberInfos: [],
                    headCursor: null,
                    tailCursor: null,
                    hasMoreOlder: false,
                    hasMoreNewer: false,
                };
            }

            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchMessagesByChannelId.fulfilled, (state, action) => {
            const { channelId } = action.meta.arg;
            const direction = action.meta.arg.direction;
            // New if no existing messages
            if (!state.messagesByChannelId[channelId]) {
                state.messagesByChannelId[channelId] = action.payload;
            } else {
                // Append or prepend messages based on direction
                const existingMessages = state.messagesByChannelId[channelId]?.messages || [];
                let newMessagesList = [] as UIMessage[];

                if (direction === "BEFORE") {
                    newMessagesList = [
                        ...existingMessages,
                        ...action.payload.messages!,
                    ];
                    state.messagesByChannelId[channelId]!.headCursor = action.payload.nextCursor;
                    state.messagesByChannelId[channelId]!.hasMoreOlder = action.payload.hasMore;
                } else if (direction === "AFTER") {
                    newMessagesList = [
                        ...action.payload.messages!,
                        ...existingMessages,
                    ];
                    state.messagesByChannelId[channelId]!.tailCursor = action.payload.nextCursor;
                    state.messagesByChannelId[channelId]!.hasMoreNewer = action.payload.hasMore;
                }

                const uniqueMessages = Array.from(
                    new Map(newMessagesList.map(msg => [msg.id, msg])).values()
                );

                // Update state
                state.messagesByChannelId[channelId].messages = uniqueMessages;

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
            const { channelId, senderId, content, files } = action.meta.arg;
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
                authorId: senderId,
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
                    memberInfos: [],
                    headCursor: null,
                    tailCursor: null,
                    hasMoreOlder: false,
                    hasMoreNewer: false,
                }
            }
            state.messagesByChannelId[channelId]!.messages!.unshift(tempMessage);

            state.isLoading = true;
            state.error = null;
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
export const { addRealTimeMessage, addTempNewMessage } = messageSlice.actions;