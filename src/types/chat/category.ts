import type { ChannelResponse } from "./channel";

export interface CategoryResponse {
    id: string;
    serverId: string;
    name: string;
    position: number;
    publicAccess: boolean;
    active: boolean;
    channels: ChannelResponse[];
}
