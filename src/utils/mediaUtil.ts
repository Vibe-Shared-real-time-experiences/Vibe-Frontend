// Helper: Get image dimensions from a File object 
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
        if (!file.type.startsWith("image/")) {
            resolve({ width: 0, height: 0 }); // Không phải ảnh thì cho 0 hết
            return;
        }
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => resolve({ width: 0, height: 0 });
        img.src = url;
    });
};

export const determineAttachmentType = (contentType: string): "IMAGE" | "VIDEO" | "FILE" | "AUDIO" | "OTHER" => {
    if (contentType.startsWith("image/")) {
        return "IMAGE";
    } else if (contentType.startsWith("video/")) {
        return "VIDEO";
    } else if (contentType.startsWith("audio/")) {
        return "AUDIO";
    } else if (contentType) {
        return "FILE";
    } else {
        return "OTHER";
    }
};