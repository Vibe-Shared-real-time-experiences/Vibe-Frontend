import { Bell, Hash, Plus, Users } from 'lucide-react'
import MemberList from './MemberList'
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { useParams } from 'react-router-dom';
import { fetchMessagesByChannelId } from '../../features/chat/messageThunk';

const ChannelChatArea = () => {

    const { channelId, serverId } = useParams();

    const dispatch = useAppDispatch();
    const { messagesByChannelId, isLoading } = useAppSelector((state) => state.message);
    const { channelMembers } = useAppSelector((state) => state.member);

    useEffect(() => {
        if (channelId) {
            dispatch(fetchMessagesByChannelId({ channelId, cursor: null }));
        }
    }, [dispatch, channelId, serverId]);

    const [isMemberListOpen, setIsMemberListOpen] = useState(false);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full text-white">Loading...</div>;
    }

    return (
        <>
            <div className="flex-1 flex flex-col bg-[#313338] min-w-0 relative" >
                {/* Chat Header */}
                <div className="h-12 border-b border-[#26272D] flex items-center px-4 justify-between shadow-sm z-10" >
                    <div className="flex items-center text-white">
                        <Hash size={24} className="text-gray-400 mr-2" />
                        <span className="font-bold mr-4">general</span>
                        <span className="text-xs text-gray-400 border-l border-gray-600 pl-4">The main lounge</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                        <Bell size={20} className="cursor-pointer hover:text-white" />
                        <Users size={20} className="cursor-pointer hover:text-white" onClick={() => setIsMemberListOpen(!isMemberListOpen)} />
                        <div className="w-64 bg-[#1E1F22] rounded px-2 py-1 text-sm text-gray-400 hidden lg:block">Search...</div>
                    </div>
                </div>

                {/* Messages Area (Scrollable) */}
                <div className="flex-1 flex flex-col-reverse overflow-y-auto p-4 space-y-4">
                    {channelId != null && messagesByChannelId[channelId]?.messages?.map((message) => (
                        <div key={message.id} className="flex gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-1">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 mt-1 shrink-0"></div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-white font-medium hover:underline cursor-pointer">{channelMembers ? channelMembers[message.senderId]?.displayName : "Unknown"}</span>
                                    <span className="text-xs text-gray-400">{message.createdAt}</span>
                                </div>
                                <p className="text-gray-100">{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="px-4 pb-6 pt-2">
                    <div className="bg-[#383A40] rounded-lg px-4 py-2.5 flex items-center gap-4">
                        <Plus size={24} className="text-gray-200 cursor-pointer bg-gray-700 rounded-full p-1" />
                        <input
                            type="text"
                            placeholder="Message #general"
                            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Member List (Optional/Hidden on small screens) */}
            {isMemberListOpen && <MemberList channelId={null} />}
        </>
    )
}

export default ChannelChatArea