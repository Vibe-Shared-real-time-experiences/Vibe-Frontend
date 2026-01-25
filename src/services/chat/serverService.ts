import axiosClient from "../../api/client"
import type { CreateServerRequest, ServerDetailResponse, ServerResponse } from "../../types/chat/server";
import type { ApiResponse } from "../../types/common/apiResponse";

export const fetchServers = () => {
    return axiosClient.get<ApiResponse<ServerResponse[]>>("/v1/servers");
}

export const fetchServerById = (serverId: string) => {
    return axiosClient.get<ApiResponse<ServerDetailResponse>>(`/v1/servers/${serverId}`);
}

export const createServer = (data: CreateServerRequest) => {
    return axiosClient.post<ApiResponse<ServerDetailResponse>>("/v1/servers", data);
}