import type { ChannelMessages } from '../../types/chat/message';
import type { MessageAttachmentRequest } from '../../types/media/attachment';
import * as messageService from './../../services/chat/messageService';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
export const fetchMessagesByChannelId = createAsyncThunk<ChannelMessages, { channelId: string; cursor: string | null }, { rejectValue: string }>(
    "message/fetchMessages",
    async ({ channelId, cursor }: { channelId: string; cursor: string | null }, thunkApi) => {
        try {
            const response = await messageService.fetchMessagesByChannelId({ channelId, cursor });

            const channelMessages: ChannelMessages = {
                messages: response.data.items.messages,
                senders: response.data.items.senders,
                nextCursor: response.data.nextCursor,
                hasMore: response.data.hasMore,
            };

            return channelMessages;

        } catch (error: unknown) {
            return thunkApi.rejectWithValue("Fetching messages failed" + error);
        }
    }
);

export const sendMessage = createAsyncThunk(
    "message/send",
    async ({ channelId, content, attachments }: { channelId: string, content: string, attachments: MessageAttachmentRequest[] }, thunkAPI) => {
        const key = uuidv4();
        const tempId = key;

        try {
            const response = await messageService.sendMessage(
                channelId,
                {
                    clientUniqueId: key,
                    content: content,
                    attachments: attachments
                });

            return {
                realMessage: response.data
            }

        } catch (error) {
            return thunkAPI.rejectWithValue({ tempId, error });
        }
    }
);