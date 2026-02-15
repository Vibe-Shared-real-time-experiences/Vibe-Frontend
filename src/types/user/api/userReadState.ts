
export interface UserReadStateResponse {
    channelId: string;
    userId: string;
    lastMessageId: string;
    lastReadMessageId: string;
    unreadCount: number;
    unread: boolean;
    lastReadAt: string;
}