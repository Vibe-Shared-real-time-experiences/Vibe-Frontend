import { axiosClient } from "../../api/client";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../../types/auth";
import type { ApiResponse } from "../../types/common/apiResponse";

export const login = (data: LoginRequest) => {
    return axiosClient.post<ApiResponse<LoginResponse>>("/v1/auth/login", data);
};

export const register = (data: RegisterRequest) => {
    return axiosClient.post<ApiResponse<RegisterResponse>>("/v1/auth/register", data);
}