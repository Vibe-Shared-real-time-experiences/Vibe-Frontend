import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../features/hooks';
import { useParams } from 'react-router-dom';
import { fetchMessagesByChannelId, sendMessage } from '../../../../../features/chat/messageThunk';
import ChannelChatHeader from './ChannelChatHeader';
import { ChatInput } from '../../components/ChatInput';
import MessageItem from '../../components/MessageItem';

const ChannelChatArea = () => {
    const { channelId, serverId } = useParams();
    const dispatch = useAppDispatch();

    const currentUserId = useAppSelector((state) => state.auth.user?.id);
    const currentChannel = useAppSelector((state) => state.channel.channelsMap[channelId || '']);
    const { messagesByChannelId } = useAppSelector((state) => state.message);
    const { channelMembers } = useAppSelector((state) => state.member);

    const channelData = channelId ? messagesByChannelId[channelId] : null;
    const currentMessages = channelData?.messages || [];
    const nextCursor = channelData?.nextCursor;

    const fetchingChannelIdRef = useRef<string | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef(0);

    const [isFetchingOld, setIsFetchingOld] = useState(false);

    // 1. Fetch message when first time load or change channel
    useEffect(() => {

        const isNoData = channelId !== null && messagesByChannelId[channelId!] == null
        const isFetching = fetchingChannelIdRef.current !== channelId;

        if (channelId && isNoData && isFetching) {
            fetchingChannelIdRef.current = channelId;
            prevScrollHeightRef.current = 0;
            dispatch(fetchMessagesByChannelId({ channelId: channelId!, cursor: null }));
        }

    }, [dispatch, channelId, serverId, messagesByChannelId]);

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;

        if (container.scrollTop < 10 && !isFetchingOld && nextCursor) {
            setIsFetchingOld(true);
            prevScrollHeightRef.current = container.scrollHeight;

            try {
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

    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async (content: string, files: File[]) => {
        if (!content && files.length === 0) return;

        setIsSending(true);

        try {
            await dispatch(sendMessage({
                channelId: channelId!,
                senderId: currentUserId!,
                content: content,
                files: files
            }))

        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsSending(false);
        }
    };

    const [isMemberListOpen, setIsMemberListOpen] = useState(false);

    return (
        <>
            <ChannelChatHeader title={currentChannel?.name ? `#${currentChannel.name}` : 'Channel'} onOpenChannelMember={() => setIsMemberListOpen(!isMemberListOpen)} />

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
                    <MessageItem key={message.id} message={message} channelMembers={channelMembers} />
                ))}
            </div>

            {/* Message Input */}
            <ChatInput
                placeholder={`Message #${currentChannel?.name || 'general'}`}
                onSubmit={handleSendMessage}
                disabled={isSending}
            />
        </>
    )
}

export default ChannelChatArea;