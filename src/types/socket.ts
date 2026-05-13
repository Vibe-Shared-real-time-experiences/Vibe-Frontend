export type WsEventType = 'MESSAGE_CREATED' | 'MESSAGE_UPDATED' | 'MESSAGE_DELETED';

export interface WsEvent<T> {
    eventType: WsEventType;
    data: T;
}
export interface WsUserSummary {
    id: string;
    username: string;
    avatarUrl: string | null;
}

export interface WsAttachmentResponse {
    url: string;
    type: string;
    contentType: string;

    width: number | null;
    height: number | null;
    size: number;
}

export interface WsMessageResponse {
    id: string;
    authorId: string;
    channelId: string;
    content: string;
    // author: WsUserSummary;
    attachments: WsAttachmentResponse[];
    createdAt: string;
}

export type WsMessageEvent = WsEvent<WsMessageResponse>;