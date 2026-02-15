import type { MessageAttachmentResponse } from "../../media/api/attatchmentResponse";
import type { MemberSummaryInfo } from "./member";

export interface ChannelMessages extends ChannelMessagesResponse {
    nextCursor: string | null;
    hasMore: boolean;
}

export interface ChannelMessagesResponse {
    messages: MessageResponse[] | null;
    memberInfos: MemberSummaryInfo[] | null;
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
export interface MessageMetadataResponse {
    reactions: Record<string, number>; // e.g., { "like": 10, "love": 5 }
}
export interface CreateMessageResponse {
    clientUniqueId: string;
    messageId: string;
    status: "SENDING" | "SUCCESS" | "FAILED";
}