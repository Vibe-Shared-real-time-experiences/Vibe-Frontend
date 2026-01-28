import type { ChannelMessages, MessageResponse } from '../../types/chat/message';
import * as messageService from './../../services/chat/messageService';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid'; // Cài thư viện uuid
import { messageSlice } from './messageSlice';
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

            console.log("Fetched messages: ", channelMessages);

            return channelMessages;

        } catch (error: unknown) {
            return thunkApi.rejectWithValue("Fetching messages failed" + error);
        }
    }
);

export const sendMessage = createAsyncThunk(
    "message/send",
    async ({ channelId, content, attachments }: { content: string, channelId: string, attachments: any[] }, thunkAPI) => {
        const key = uuidv4();

        const optimisticMessage: MessageResponse = {
            id: key,
            channelId,
            content,
            senderId: "me", // Lấy từ auth store
            createdAt: new Date().toISOString(),
            status: "sending", // 🟡 Đang gửi
            key: key
        };

        // Dispatch action nhỏ để nhét ngay vào Store (cho hiện lên UI)
        thunkAPI.dispatch(messageSlice.actions.addOptimisticMessage(optimisticMessage));

        try {
            // 3. Gọi API thật
            const response = await messageService.sendMessage({
                clientUniqueId: key,
                content: content,
                attachments: attachments
            });

            // 4. API trả về tin thật -> Return để Reducer update lại
            return {
                key, // Trả lại tempId để reducer biết mà tìm
                realMessage: response.data // Tin nhắn xịn từ DB
            };

        } catch (error) {
            // 5. Lỗi -> Return reject để update thành error
            return thunkAPI.rejectWithValue({ tempId, error });
        }
    }
);