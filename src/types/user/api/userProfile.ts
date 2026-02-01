export interface UserProfileResponse {
    id: string;
    displayName: string;
    dateOfBirth: string;
    avatarUrl: string | null;
    bio: string | null;
    isPublic: boolean;
}