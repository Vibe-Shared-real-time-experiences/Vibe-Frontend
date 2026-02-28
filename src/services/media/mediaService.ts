import axios from "axios";
import axiosClient from "../../api/client";
import type { MessageAttachmentRequest } from "../../types/media/attachment";
import { determineAttachmentType, getImageDimensions } from "../../utils/mediaUtil";

export const mediaService = {
    // upload: async (file: File, type: string = "ATTACHMENT", id?: string): Promise<MessageAttachmentRequest> => {
    // const formData = new FormData();
    //     formData.append("file", file);
    //     formData.append("type", type);
    //     if (id) {
    //         formData.append("id", id);
    //     }

    //     const response = await axiosClient.post("/v1/media/upload", formData, {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //         },
    //     });
    //     return response.data.data;
    // },

    upload: async (file: File, contentType: string = "ATTACHMENT", id?: string): Promise<MessageAttachmentRequest> => {

        // 1. Get image dimensions
        const { width, height } = await getImageDimensions(file);

        // 2. Request presigned URL from BE
        const presignedRes = await axiosClient.post("/v1/media/presigned-url",
            {
                fileName: file.name,
                contentType: file.type,
                type: contentType,
                id: id
            }
        );

        const { url, objectKey } = presignedRes.data.data; // Tuỳ cách BE ông bọc response

        // 3. Upload file directly to Storage using the presigned URL
        await axios.put(url, file, {
            headers: {
                "Content-Type": file.type
            }
        });

        // 4. Return attachment info that will be saved in DB
        const type = determineAttachmentType(file.type);

        return {
            objectKey: objectKey,
            type: type,
            contentType: file.type,
            width: width,
            height: height,
            size: file.size
        } as MessageAttachmentRequest;
    },
};