import axiosClient from "../../api/client";
import type { AttachmentResponse } from "../../types/media/attachment";

export const mediaService = {
    upload: async (file: File, type: string = "ATTACHMENT", id?: string): Promise<AttachmentResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        if (id) {
            formData.append("id", id);
        }

        const response = await axiosClient.post("/v1/media/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.data;
    },
};