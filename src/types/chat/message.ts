import type { MemberSummaryInfo } from "./member";

export interface CreateMessageRequest {
    clientUniqueId: string;
    content: string;
    attachments: string[];
}

export interface ChannelMessages extends ChannelMessagesResponse {
    nextCursor: string | null;
    hasMore: boolean;
}

export interface ChannelMessagesResponse {
    messages: MessageResponse[] | null;
    senders: MemberSummaryInfo[] | null;
}

export interface MessageResponse {
    id: string;
    channelId: string;
    senderId: string;
    content: string;
    attachments: MessageAttachmentResponse[] | null;
    metadata: MessageMetadataResponse | null;
    createdAt: string;
    updatedAt: string;
}
export interface MessageAttachmentResponse {
    url: string;
    type: "IMAGE" | "VIDEO" | "FILE";
    contentType: string;
    width: number | null;
    height: number | null;
    size: number;
}

export interface MessageMetadataResponse {
    reactions: Record<string, number>; // e.g., { "like": 10, "love": 5 }
}