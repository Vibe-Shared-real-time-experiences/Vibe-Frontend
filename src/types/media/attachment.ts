export interface MessageAttachmentRequest {
    url: string;
    type: "IMAGE" | "VIDEO" | "FILE";
    width?: number;
    height?: number;
    size: number;
    contentType: string;
}

export interface AttachmentResponse {
    url: string;
    type: "IMAGE" | "VIDEO" | "FILE";
    contentType: string;
    width: number | null;
    height: number | null;
    size: number;
}