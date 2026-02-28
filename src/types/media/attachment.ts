export interface MessageAttachmentRequest {
    objectKey: string;
    type: "IMAGE" | "VIDEO" | "FILE";
    width?: number;
    height?: number;
    size: number;
    contentType: string;
}