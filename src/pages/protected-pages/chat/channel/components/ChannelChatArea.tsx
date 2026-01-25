
import MemberList from './MemberList'
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../features/hooks';
import { useParams } from 'react-router-dom';
import { fetchMessagesByChannelId } from '../../../../../features/chat/messageThunk';
import ChannelChatHeader from './ChannelChatHeader';
import { Plus } from 'lucide-react';

const ChannelChatArea = () => {

    const { channelId, serverId } = useParams();

    const dispatch = useAppDispatch();
    const { messagesByChannelId } = useAppSelector((state) => state.message);
    const { channelMembers } = useAppSelector((state) => state.member);

    useEffect(() => {
        if (channelId) {
            dispatch(fetchMessagesByChannelId({ channelId, cursor: null }));
        }
    }, [dispatch, channelId, serverId]);

    const [isMemberListOpen, setIsMemberListOpen] = useState(false);

    return (
        <>
            <div className="flex-1 flex flex-col bg-[#313338] min-w-0 relative" >
                {/* Chat Header */}
                <ChannelChatHeader title={channelId ? `#${channelId}` : 'Channel'} onOpenChannelMember={() => setIsMemberListOpen(!isMemberListOpen)} />

                {/* Messages Area (Scrollable) */}
                <div className="flex-1 flex flex-col-reverse overflow-y-auto p-4 space-y-4">
                    {channelId != null && messagesByChannelId[channelId]?.messages?.map((message) => (
                        <div key={message.id} className="flex gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-1">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 mt-1 shrink-0"></div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-white text-xs hover:underline cursor-pointer">{channelMembers ? channelMembers[message.senderId]?.displayName : "Unknown"}</span>
                                    <span className="text-[11px] text-gray-400">{message.createdAt}</span>
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

            {isMemberListOpen && <MemberList />}
        </>
    )
}

export default ChannelChatArea