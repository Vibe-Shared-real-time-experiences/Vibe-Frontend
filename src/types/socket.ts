import type { MessageResponse } from "./chat/api/message";

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
    id: string;
    url: string;
    type: string;
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