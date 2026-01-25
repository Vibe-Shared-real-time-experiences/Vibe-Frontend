import axiosClient from '../../api/client';
import type { ChannelMessagesResponse } from '../../types/chat/message';
import type { ApiResponse } from '../../types/common/apiResponse';
import type { CursorResponse } from '../../types/common/cursorResponse';


export const fetchMessagesByChannelId = async ({ channelId, cursor }: { channelId: string; cursor: string | null }) => {
    // GET /channels/{id}/messages?cursor={cursor}&limit=20
    const params = cursor ? { cursor, limit: 20 } : { limit: 20 };
    const response = await axiosClient.get<ApiResponse<CursorResponse<ChannelMessagesResponse>>>(`/v1/channels/${channelId}/messages`, { params });

    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error('Failed to fetch messages');
    }
}