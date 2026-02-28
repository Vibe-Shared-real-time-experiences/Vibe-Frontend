import { mediaService } from '../../services/media/mediaService';
import type { ChannelMessages } from '../../types/chat/api/message';
import type { FetchMessagesRequest } from '../../types/chat/request/message';
import type { MessageAttachmentRequest } from '../../types/media/attachment';
import * as messageService from './../../services/chat/messageService';
import * as userProfileService from '../../services/user/userProfileService';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import type { MemberSummaryInfo } from '../../types/chat/api/member';
export const fetchMessagesByChannelId = createAsyncThunk<ChannelMessages, FetchMessagesRequest, { rejectValue: string }>(
    "message/fetchMessages",
    async (fetchMessagesRequest: FetchMessagesRequest, thunkApi) => {
        try {
            const response = await messageService.fetchMessagesByChannelId(fetchMessagesRequest);

            const channelMessages: ChannelMessages = {
                messages: response.data.items.messages,
                memberInfos: response.data.items.memberInfos,
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
    async ({ channelId, senderId, content, files }: { channelId: string, senderId: string, content: string, files: File[] }, thunkAPI) => {
        const key = uuidv4();
        const tempId = key;

        try {
            let attachmentRequests: MessageAttachmentRequest[] = [];

            // 1. Send image first if any
            if (files.length > 0) {
                attachmentRequests = await Promise.all(
                    files.map(file => mediaService.upload(file, "ATTACHMENT"))
                );
            }

            // 2. Send message with attachment URLs that sent from media service
            const response = await messageService.sendMessage(
                channelId,
                {
                    clientUniqueId: key,
                    content: content,
                    attachments: attachmentRequests
                });

            return {
                senderId,
                realMessage: response.data,
                attachmentResponses: attachmentRequests
            }

        } catch (error) {
            return thunkAPI.rejectWithValue({ tempId, error });
        }
    }
);

export const fetchMissingMembers = createAsyncThunk<MemberSummaryInfo[], string[], { rejectValue: string }>(
    "message/fetchMissingMembers",
    async (userIds: string[], thunkApi) => {
        try {
            if (userIds.length === 0) {
                return [];
            }

            const response = await userProfileService.fetchUsersByIds({ userIds });

            // Map UserSummaryResponse to MemberSummaryInfo
            const members: MemberSummaryInfo[] = response.data.data.map(user => ({
                memberId: user.id,
                displayName: user.username,
                avatarUrl: user.avatarUrl || ''
            }));

            return members;

        } catch (error: unknown) {
            console.error("Error fetching missing members: ", error);
            return thunkApi.rejectWithValue("Fetching members failed" + error);
        }
    }
);