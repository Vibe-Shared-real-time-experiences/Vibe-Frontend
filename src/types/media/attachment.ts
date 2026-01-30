export interface MessageAttachmentRequest {
    url: string;
    type: "IMAGE" | "VIDEO" | "FILE";
    width?: number;
    height?: number;
    size: number;
    contentType: string;
}