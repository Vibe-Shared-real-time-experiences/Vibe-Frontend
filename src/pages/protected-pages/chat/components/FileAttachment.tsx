import { Download, FileIcon } from "lucide-react";
import type { UIAttachment } from "../../../../types/chat/ui/message";

// Helper: Format file size (bytes -> KB/MB)
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileAttachment = ({ attachment }: { attachment: UIAttachment }) => {
    return (
        <div className="flex items-center gap-3 p-3 rounded bg-[#2b2d31] border border-[#1e1f22] hover:bg-[#35373c] transition group/file">
            <div className="p-2 bg-indigo-500/10 rounded">
                <FileIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm text-indigo-100 font-medium truncate">
                    {attachment.objectKey?.split('/').pop()}
                </div>
                <div className="text-xs text-gray-400">
                    {formatFileSize(attachment.size ?? 0)}
                </div>
            </div>
            {/* Download button */}
            <a
                href={attachment.objectKey}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-gray-400 hover:text-white opacity-0 group-hover/file:opacity-100 transition"
            >
                <Download className="w-5 h-5" />
            </a>

            {/* Sending spinner */}
            {attachment.isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};