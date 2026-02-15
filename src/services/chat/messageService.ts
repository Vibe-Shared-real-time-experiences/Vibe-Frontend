import axiosClient from '../../api/client';
import type { CreateMessageResponse } from './../../types/chat/api/message';
import type { ChannelMessagesResponse } from '../../types/chat/api/message';
import type { CreateMessageRequest, FetchMessagesRequest } from '../../types/chat/request/message';
import type { ApiResponse } from '../../types/common/apiResponse';
import type { CursorResponse } from '../../types/common/cursorResponse';


export const fetchMessagesByChannelId = async (fetchMessagesRequest: FetchMessagesRequest) => {
    // GET /channels/{id}/messages?cursor={cursor}&limit=20
    const params = fetchMessagesRequest.cursor ? { cursor: fetchMessagesRequest.cursor, limit: 50, direction: fetchMessagesRequest.direction } : { limit: 50, direction: fetchMessagesRequest.direction };
    const response = await axiosClient.get<ApiResponse<CursorResponse<ChannelMessagesResponse>>>(`/v1/channels/${fetchMessagesRequest.channelId}/messages`, { params });

    console.log("Fetched messages response: ", response.data.data);

    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error('Failed to fetch messages');
    }
}

export const sendMessage = async (channelId: string, createMessageRequest: CreateMessageRequest) => {
    // POST /messages
    const response = await axiosClient.post<ApiResponse<CreateMessageResponse>>(`/v1/channels/${channelId}/messages`, createMessageRequest);
    if (response.status === 200 || response.status === 201) {
        return response.data;
    } else {
        throw new Error('Failed to send message');
    }
}