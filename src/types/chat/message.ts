import type { MessageAttachmentRequest } from "../media/attachment";
import type { MemberSummaryInfo } from "./member";
import type { UIMessage } from "./ui/message";

export interface CreateMessageRequest {
    clientUniqueId: string;
    content: string;
    attachments: MessageAttachmentRequest[];
}

export interface ChannelMessages extends ChannelMessagesResponse {
    nextCursor: string | null;
    hasMore: boolean;
}

export interface ChannelMessagesResponse {
    messages: UIMessage[] | null;
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
export interface CreateMessageResponse {
    clientUniqueId: string;
    messageId: string;
    status: "SENDING" | "SUCCESS" | "FAILED";
}