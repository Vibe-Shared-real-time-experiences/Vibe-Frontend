import { client } from "../../api/client";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../../types/auth";
import type { ApiResponse } from "../../types/common/apiResponse";

export const loginApi = (data: LoginRequest) => {
    return client.post<ApiResponse<LoginResponse>>("/v1/auth/login", data);
};

export const registerApi = (data: RegisterRequest) => {
    return client.post<ApiResponse<RegisterResponse>>("/v1/auth/register", data);
}