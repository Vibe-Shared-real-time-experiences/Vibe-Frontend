import type { ChannelMessages } from '../../types/chat/message';
import * as messageService from './../../services/chat/messageService';
import { createAsyncThunk } from "@reduxjs/toolkit";
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