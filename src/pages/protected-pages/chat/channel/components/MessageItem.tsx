import React from 'react'
import type { UIMessage } from '../../../../../types/chat/ui/message';
import type { MemberSummaryInfo } from '../../../../../types/chat/member';

const MessageItem = ({ message, channelMembers }: { message: UIMessage; channelMembers: Record<string, MemberSummaryInfo> | null }) => {
    return (
        <div className="flex gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-1 group">
            <div className="w-10 h-10 rounded-full bg-indigo-500 mt-1 shrink-0"></div>
            <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-white text-base font-medium hover:underline cursor-pointer">
                        {channelMembers ? channelMembers[message.senderId]?.displayName : "Unknown"}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                        {message.createdAt}
                    </span>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {message.content}
                </p>
            </div>
        </div>
    )
}

export default MessageItem