import { axiosClient } from '../../api/client';
import type { ApiResponse } from '../../types/common/apiResponse';
import type { UserProfileResponse, UserSummaryResponse } from '../../types/user/api/userProfile';
import type { UserSummaryRequest } from '../../types/user/request/UserSummaryRequest';

export const fetchUserProfile = () => {
    return axiosClient.get<ApiResponse<UserProfileResponse>>("/v1/profile");
}

export const fetchUsersByIds = (request: UserSummaryRequest) => {
    return axiosClient.post<ApiResponse<UserSummaryResponse[]>>("/v1/users", request);
}