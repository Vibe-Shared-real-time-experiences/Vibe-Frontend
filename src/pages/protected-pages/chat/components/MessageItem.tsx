import React from 'react'
import type { UIMessage } from '../../../../types/chat/ui/message';

import { FileIcon, Download, Loader2, AlertCircle } from 'lucide-react';
import type { AttachmentResponse } from '../../../../types/media/attachment';
import type { MemberSummaryInfo } from '../../../../types/chat/member';
import { VisualAttachment } from './VisualAttachment';

// Helper: Format file size (bytes -> KB/MB)
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const MessageItem = ({ message, channelMembers }: { message: UIMessage; channelMembers: Record<string, MemberSummaryInfo> | null }) => {

    const visualMedia = message.attachments?.filter(a =>
        a.contentType.startsWith('image/') || a.contentType.startsWith('video/')
    ) || [];
    const files = message.attachments?.filter(a => !a.contentType.startsWith('image/')
        && !a.contentType.startsWith('video/')) || [];

    const isSending = message.status === 'SENDING';
    const isError = message.status === 'FAILED';

    return (
        <div className={`flex gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-1 group ${isSending ? 'opacity-50' : ''}`}>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-indigo-500 mt-1 shrink-0 cursor-pointer hover:drop-shadow-md transition">
                <img src={channelMembers?.[message.senderId]?.avatarUrl || ''} />
            </div>

            <div className="flex-1 min-w-0">

                {/* Header: Name + time */}
                <div className="flex items-center gap-2">
                    <span className="text-white text-base font-medium hover:underline cursor-pointer">
                        {channelMembers ? channelMembers[message.senderId]?.displayName : "Unknown"}
                    </span>
                    <span className="text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Status icon*/}
                    {isSending && <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />}
                    {isError && <AlertCircle className="w-3 h-3 text-red-500" />}
                </div>

                {/* Message content */}
                {message.content && (
                    <p className={`text-gray-300 text-sm whitespace-pre-wrap ${isError ? 'text-red-400' : ''}`}>
                        {message.content}
                    </p>
                )}

                {visualMedia.length > 0 && (
                    <div className={`mt-2 grid gap-2 max-w-[500px] ${visualMedia.length === 1 ? 'grid-cols-1' :
                        visualMedia.length === 2 ? 'grid-cols-2' :
                            'grid-cols-3'
                        }`}>
                        {visualMedia.map((media, index) => (
                            <VisualAttachment
                                key={index}
                                attachment={media}
                                isSingle={visualMedia.length === 1}
                            />
                        ))}
                    </div>
                )}

                {/* File Attachments Location (PDF, Zip...) */}
                {files.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2 max-w-[400px]">
                        {files.map((file, index) => (
                            <FileAttachment key={index} attachment={file} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const FileAttachment = ({ attachment }: { attachment: AttachmentResponse }) => {
    return (
        <div className="flex items-center gap-3 p-3 rounded bg-[#2b2d31] border border-[#1e1f22] hover:bg-[#35373c] transition group/file">
            <div className="p-2 bg-indigo-500/10 rounded">
                <FileIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm text-indigo-100 font-medium truncate">
                    {attachment.url.split('/').pop()}
                </div>
                <div className="text-xs text-gray-400">
                    {formatFileSize(attachment.size)}
                </div>
            </div>
            {/* Download button */}
            <a
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-gray-400 hover:text-white opacity-0 group-hover/file:opacity-100 transition"
            >
                <Download className="w-5 h-5" />
            </a>
        </div>
    );
};

export default MessageItem;