import type { MessageAttachmentRequest } from "../../media/attachment";

export interface CreateMessageRequest {
    clientUniqueId: string;
    content: string;
    attachments: MessageAttachmentRequest[];
}

