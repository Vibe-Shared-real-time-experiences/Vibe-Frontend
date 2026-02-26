import React from 'react'
import type { UIMessage } from '../../../../types/chat/ui/message';
import { Loader2, AlertCircle } from 'lucide-react';
import type { MemberSummaryInfo } from '../../../../types/chat/api/member';
import { VisualAttachment } from './VisualAttachment';
import { FileAttachment } from './FileAttachment';

const MessageItem = ({ message, channelMembers, isUnread }: { message: UIMessage; channelMembers: Record<string, MemberSummaryInfo> | null, isUnread: boolean }) => {

    const visualMedia = message.attachments?.filter(a =>
        a.contentType?.startsWith('image/') || a.contentType?.startsWith('video/')
    ) || [];
    const files = message.attachments?.filter(a => !a.contentType?.startsWith('image/')
        && !a.contentType?.startsWith('video/')) || [];

    const isSending = message.status === 'SENDING';
    const isError = message.status === 'FAILED';

    console.log("member name: ", channelMembers?.[message.authorId]?.displayName);

    return (

        <>
            {/* Unread mark */}
            {isUnread && (
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-red-500" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-[#2B2D31] px-3 text-xs text-blue-400 font-semibold">
                            New Messages
                        </span>
                    </div>
                </div>
            )}
            <div className={`flex gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-1 group ${isSending ? 'opacity-50' : ''}`}>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-indigo-500 mt-1 shrink-0 cursor-pointer hover:drop-shadow-md transition">
                    <img src={channelMembers?.[message.authorId]?.avatarUrl} />
                </div>

                <div className="flex-1 min-w-0">

                    {/* Header: Name + time */}
                    <div className="flex items-center gap-2">
                        <span className="text-white text-base font-medium hover:underline cursor-pointer">
                            {channelMembers ? channelMembers[message.authorId]?.displayName : "Unknown"}
                        </span>
                        <span className="text-xs text-gray-400">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: '2-digit' })}
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
        </>
    );
};



export default MessageItem;