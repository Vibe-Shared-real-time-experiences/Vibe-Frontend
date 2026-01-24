
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserBaseInfo;
}

export interface UserBaseInfo {
    id: string;
    displayName: string;
    avatarUrl?: string;
    roleName: string;
}

export interface RegisterRequest {
    email: string;
    displayName: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
    user: UserBaseInfo;
}