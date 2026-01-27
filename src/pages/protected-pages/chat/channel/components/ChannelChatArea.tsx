import MemberList from './MemberList'
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../features/hooks';
import { useParams } from 'react-router-dom';
import { fetchMessagesByChannelId } from '../../../../../features/chat/messageThunk';
import ChannelChatHeader from './ChannelChatHeader';
import { Plus } from 'lucide-react';

const ChannelChatArea = () => {
    const { channelId, serverId } = useParams();
    const dispatch = useAppDispatch();

    // Select data
    const { categories, currentServerId, activeChannelId } = useAppSelector((state) => state.channel);
    const { messagesByChannelId } = useAppSelector((state) => state.message);
    const { channelMembers } = useAppSelector((state) => state.member);

    // Lấy data cụ thể của channel này
    const channelData = channelId ? messagesByChannelId[channelId] : null;
    const currentMessages = channelData?.messages || [];
    const nextCursor = channelData?.nextCursor; // Lấy cursor hiện tại ra

    const fetchingChannelIdRef = useRef<string | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef(0);

    const [isFetchingOld, setIsFetchingOld] = useState(false);

    // 1. Fetch message when first time load or change channel
    useEffect(() => {

        const isNoData = channelId !== null && messagesByChannelId[channelId!] == null
        const isFetching = fetchingChannelIdRef.current !== channelId;

        if (channelId && (isNoData || isFetching)) {

            // Reset scroll về 0 để tránh tính toán sai layout cũ
            prevScrollHeightRef.current = 0;
            dispatch(fetchMessagesByChannelId({ channelId: channelId!, cursor: null }));
        }
    }, [dispatch, channelId, serverId]);

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;

        if (container.scrollTop < 10 && !isFetchingOld && nextCursor) {
            setIsFetchingOld(true);
            prevScrollHeightRef.current = container.scrollHeight;

            try {
                // Gọi API với cursor tiếp theo
                await dispatch(fetchMessagesByChannelId({
                    channelId: channelId!,
                    cursor: nextCursor
                })).unwrap();
            } catch (err) {
                console.error("Failed to load more messages", err);
            } finally {
                setIsFetchingOld(false);
            }
        }
    };

    useLayoutEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        // TRƯỜNG HỢP 1: Đang load tin cũ (Pagination)
        // Logic: Tính toán độ chênh lệch để giữ nguyên mắt đọc
        if (prevScrollHeightRef.current > 0) {
            const newHeight = container.scrollHeight;
            const diff = newHeight - prevScrollHeightRef.current;
            container.scrollTop = diff;
            prevScrollHeightRef.current = 0;
        }

        // TRƯỜNG HỢP 2: Mới vào kênh hoặc Chat Realtime
        // Logic: Không có dấu hiệu load cũ -> Mặc định cuộn xuống đáy
        else {
            container.scrollTop = container.scrollHeight;
        }
    }, [currentMessages.length, channelId]);


    const [isMemberListOpen, setIsMemberListOpen] = useState(false);

    return (
        <>
            <ChannelChatHeader title={channelId ? `#${channelId}` : 'Channel'} onOpenChannelMember={() => setIsMemberListOpen(!isMemberListOpen)} />

            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4"
            >
                {/* Loading Indicator */}
                {isFetchingOld && (
                    <div className="text-center py-2 text-xs text-gray-400">
                        Loading history...
                    </div>
                )}

                {/* Out of messages */}
                {!nextCursor && currentMessages.length > 0 && (
                    <div className="text-center py-4 text-gray-500 text-xs">
                        This is the start of the conversation.
                    </div>
                )}

                {/* Render messages */}
                {[...currentMessages].reverse().map((message) => (
                    <div key={message.id} className="flex gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-1 group">
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
                ))}
            </div>

            {/* Message Input */}
            <div className="px-4 pb-6 pt-2">
                <div className="bg-[#383A40] rounded-lg px-4 py-2.5 flex items-center gap-4">
                    <Plus size={24} className="text-gray-200 cursor-pointer bg-gray-700 rounded-full p-1" />
                    <input
                        type="text"
                        placeholder={`Message #${channelId || 'general'}`}
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-400"
                    />
                </div>
            </div>
        </>
    )
}

export default ChannelChatArea;