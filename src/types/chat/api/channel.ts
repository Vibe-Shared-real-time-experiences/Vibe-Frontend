
export interface ChannelResponse {
    id: string;
    serverId: string;
    categoryId?: string;
    name: string;
    type: 'TEXT' | 'VOICE' | 'DM'
    position: number;
    publicAccess: boolean;
    active: boolean;
}