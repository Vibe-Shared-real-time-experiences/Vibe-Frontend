import axiosClient from "../../api/client"
import type { ChannelUnreadResponse } from "../../types/chat/api/channel";
import type { CreateServerRequest, ServerDetailResponse, ServerResponse } from "../../types/chat/api/server";
import type { ApiResponse } from "../../types/common/apiResponse";

export const fetchServers = () => {
    return axiosClient.get<ApiResponse<ServerResponse[]>>("/v1/servers");
}

export const fetchServerById = (serverId: string) => {
    return axiosClient.get<ApiResponse<ServerDetailResponse>>(`/v1/servers/${serverId}`);
}

export const fetchUnreadChannels = (serverId: string) => {
    return axiosClient.get<ApiResponse<ChannelUnreadResponse[]>>(
        `/v1/servers/${serverId}/read-states`
    );
}

export const createServer = (data: CreateServerRequest) => {
    return axiosClient.post<ApiResponse<ServerDetailResponse>>("/v1/servers", data);
}