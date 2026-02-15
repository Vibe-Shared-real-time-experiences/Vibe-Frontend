import type { MessageAttachmentRequest } from "../../media/attachment";

export type FetchDirection = "AFTER" | "BEFORE";

export interface FetchMessagesRequest {
    channelId: string;
    cursor: string | null;
    direction: FetchDirection;
}

export interface CreateMessageRequest {
    clientUniqueId: string;
    content: string;
    attachments: MessageAttachmentRequest[];
}