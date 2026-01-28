export interface MessageAttachmentRequest {
    url: string;
    type: string;
    width?: number;
    height?: number;
    size: number;
    contentType: string;
}