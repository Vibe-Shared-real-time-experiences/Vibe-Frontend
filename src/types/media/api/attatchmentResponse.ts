export interface MessageAttachmentResponse {
    url: string;
    type: "IMAGE" | "VIDEO" | "FILE";
    contentType: string;
    width: number | null;
    height: number | null;
    size: number;
}
