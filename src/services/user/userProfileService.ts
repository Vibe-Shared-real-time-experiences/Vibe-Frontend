import { axiosClient } from '../../api/client';
import type { ApiResponse } from '../../types/common/apiResponse';
import type { UserProfileResponse } from '../../types/user/api/userProfile';

export const fetchUserProfile = () => {
    return axiosClient.get<ApiResponse<UserProfileResponse>>("/v1/profile");
}