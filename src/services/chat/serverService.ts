import axiosClient from "../../api/client"
import type { CreateServerRequest, ServerDetailResponse, ServerResponse } from "../../types/chat/server";
import type { ApiResponse } from "../../types/common/apiResponse";

export const getServers = () => {
    return axiosClient.get<ApiResponse<ServerResponse[]>>("/v1/servers");
}

export const getServerById = (serverId: string) => {
    return axiosClient.get<ApiResponse<ServerDetailResponse>>(`/v1/chat/servers/${serverId}`);
}

export const createServer = (data: CreateServerRequest) => {
    return axiosClient.post<ApiResponse<ServerDetailResponse>>("/v1/servers", data);
}