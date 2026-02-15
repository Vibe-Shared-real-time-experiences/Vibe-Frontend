

export interface UpdateUnreadStateRequest {
    userId: string;
    channelId: string;
    lastReadMessageId: string;
}