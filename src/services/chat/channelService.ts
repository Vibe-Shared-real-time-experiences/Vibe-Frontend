import type { UserReadStateResponse } from '../../types/user/api/userReadState';
import type { ApiResponse } from '../../types/common/apiResponse';
import { axiosClient } from '../../api/client';
import type { UpdateUnreadStateRequest } from '../../types/chat/request/unreadState';

export const fetchUserReadStateByChannelId = async (channelId: string) => {
    const response = await axiosClient.get<ApiResponse<UserReadStateResponse>>(
        `/v1/channels/${channelId}/read-states`
    );

    console.log(response.data.data)

    if (response.status === 200) {
        return response.data.data;
    } else {
        throw new Error('Failed to fetch user read state');
    }
}

export const markChannelAsRead = async (request: UpdateUnreadStateRequest) => {
    const response = await axiosClient.post<ApiResponse<null>>(
        `/v1/channels/${request.channelId}/read-states`, {
        lastReadMessageId: request.lastReadMessageId
    });
    if (response.status === 200) {
        return response.data.data;
    } else {
        throw new Error('Failed to mark channel as read');
    }
}