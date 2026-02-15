import type { MessageAttachmentResponse } from "../../media/api/attatchmentResponse";
import type { ChannelMessages, MessageResponse } from "../api/message";

export interface UIChannelMessages extends Omit<ChannelMessages, 'messages' | 'nextCursor' | 'hasMore'> {
    messages: UIMessage[] | null;
    headCursor?: string | null;
    tailCursor?: string | null;
    hasMoreOlder?: boolean;
    hasMoreNewer?: boolean;
}

export interface UIMessage extends Omit<MessageResponse, 'attachments'> {
    status?: "SENDING" | "SUCCESS" | "FAILED";
    tempId?: string;
    attachments?: UIAttachment[] | null;
}

export interface UIAttachment extends Partial<MessageAttachmentResponse> {
    file?: File;
    isUploading?: boolean;
}