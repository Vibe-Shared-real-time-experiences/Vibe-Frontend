import { useState } from "react";
import type { AttachmentResponse } from "../../../../types/media/attachment";

export const VisualAttachment = ({ attachment, isSingle }: { attachment: AttachmentResponse, isSingle: boolean }) => {
    const [isError, setIsError] = useState(false);
    const isVideo = attachment.contentType.startsWith('video/');

    if (isError) return null;

    const aspectRatio = (attachment.width && attachment.height)
        ? `${attachment.width} / ${attachment.height}`
        : "16 / 9";

    return (
        <div
            className={`relative rounded-md overflow-hidden bg-black border border-gray-700/50 ${isSingle ? '' : 'aspect-square'}`}
            style={isSingle ? {
                aspectRatio: aspectRatio,
                maxHeight: '400px'
            } : {}}
        >
            {isVideo ? (
                <video
                    src={attachment.url}
                    controls
                    className={`w-full h-full ${isSingle ? 'bg-black' : 'object-cover'}`}
                    onError={() => setIsError(true)}
                />
            ) : (
                <img
                    src={attachment.url}
                    alt="attachment"
                    className={`w-full h-full ${isSingle ? 'object-contain bg-black/20' : 'object-cover'}`}
                    loading="lazy"
                    onError={() => setIsError(true)}
                />
            )}
        </div>
    );
};