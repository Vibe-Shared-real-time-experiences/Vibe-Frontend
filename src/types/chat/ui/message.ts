import type { MessageResponse } from "../message";

export interface UIMessage extends MessageResponse {
    status?: "SENDING" | "SUCCESS" | "FAILED";
    tempId?: string;
}