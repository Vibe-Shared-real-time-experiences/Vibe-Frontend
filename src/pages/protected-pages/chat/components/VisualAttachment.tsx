import { useState } from "react";
import type { UIAttachment } from "../../../../types/chat/ui/message";

export const VisualAttachment = ({ attachment, isSingle }: { attachment: UIAttachment, isSingle: boolean }) => {
    const [isError, setIsError] = useState(false);
    const isVideo = attachment.contentType?.startsWith('video/');

    console.log("Attachment: ", attachment);


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

            {/* Sending spinner */}
            {attachment.isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};