import type { CategoryResponse } from "./category";

export interface CreateServerRequest {
    name: string;
    description?: string;
    iconUrl?: string;
    publicAccess: boolean;
}

export interface ServerResponse {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    iconUrl?: string;
    publicAccess: boolean;
    active: boolean;
}

export interface ServerDetailResponse extends ServerResponse {
    categories: CategoryResponse[];
}