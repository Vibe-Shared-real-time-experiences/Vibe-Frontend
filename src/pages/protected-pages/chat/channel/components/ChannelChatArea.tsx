import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../features/hooks';
import { useParams } from 'react-router-dom';
import { fetchMessagesByChannelId, sendMessage } from '../../../../../features/chat/messageThunk';
import ChannelChatHeader from './ChannelChatHeader';
import { ChatInput } from '../../components/ChatInput';
import MessageItem from '../../components/MessageItem';
import { markChannelAsRead } from '../../../../../features/chat/unreadStateThunk';
import { debounce } from 'lodash';

const ChannelChatArea = () => {
    const { channelId, serverId } = useParams();
    const dispatch = useAppDispatch();

    const currentUserId = useAppSelector((state) => state.auth.user?.id);
    const currentChannel = useAppSelector((state) => state.channel.channelsMap[channelId || '']);
    const { messagesByChannelId, isLoading: isLoadingMessages } = useAppSelector((state) => state.message);
    const { channelMembers, isLoading: isLoadingMembers } = useAppSelector((state) => state.member);
    const { unreadChannel } = useAppSelector((state) => state.unreadState);

    const channelData = channelId ? messagesByChannelId[channelId] : null;
    const currentMessages = channelData?.messages || [];

    const fetchingChannelIdRef = useRef<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef(0);
    const isChannelInitializedRef = useRef(false);
    const isAtBottomRef = useRef(true);
    const initialScrollTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    // console.log(unreadChannel?.[channelId!])
    // const unreadInfo = unreadChannel?.[channelId!] ?? null;
    // const lastReadId = unreadInfo?.lastReadMessageId ?? 0;
    // const hasUnread = unreadInfo?.unread ?? false;
    // const startMessage = channelData?.messages?.find(m => m.id > lastReadId);

    const SCROLL_THRESHOLD = 100;
    const { messages, headCursor, tailCursor, hasMoreOlder, hasMoreNewer } = channelData || {};

    const [isFetchingOld, setIsFetchingOld] = useState(false);
    const [isFetchingNew, setIsFetchingNew] = useState(false);

    const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMemberListOpen, setIsMemberListOpen] = useState(false);

    // 1. Fetch message when first time load or change channel
    useEffect(() => {
        // dispatch(fetchUnreadStateByChannelId(channelId!));

        const isNoData = channelId !== null && messagesByChannelId[channelId!] == null
        const isChangeChannel = fetchingChannelIdRef.current !== channelId;

        if (isNoData && isChangeChannel) {
            // Only reset prevScrollHeightRef on channel change, not on every message update
            prevScrollHeightRef.current = 0;
            isChannelInitializedRef.current = false;
            fetchingChannelIdRef.current = channelId!;
            dispatch(fetchMessagesByChannelId({ channelId: channelId!, cursor: null, direction: "BEFORE" }));
        }
    }, [dispatch, channelId, serverId]);

    // Clear fetching flags when messages update (fetch completes)
    useEffect(() => {
        setIsFetchingOld(false);
        setIsFetchingNew(false);
    }, [messages]);

    // 3. Layout Effect (for scroll position adjustments)
    useLayoutEffect(() => {
        const container = chatContainerRef.current;
        if (!container || !messages) return;

        // TRƯỜNG HỢP 1: Đang load tin cũ (Pagination)
        // Logic: Tính toán độ chênh lệch để giữ nguyên mắt đọc
        if (prevScrollHeightRef.current > 0) {
            if (initialScrollTimeoutIdRef.current) {
                clearTimeout(initialScrollTimeoutIdRef.current);
                initialScrollTimeoutIdRef.current = null;
            }

            const newScrollHeight = container.scrollHeight;
            const diff = newScrollHeight - prevScrollHeightRef.current;

            if (diff > 0) {
                container.scrollTop = container.scrollTop + diff;
            }

            prevScrollHeightRef.current = 0;
            return
        }

        // // TRƯỜNG HỢP 2: Mới vào kênh (tìm tin nhắn mới nhất)
        // if (!isChannelInitializedRef.current) {

        //     if (!unreadInfo) {
        //         return;
        //     }

        //     if (hasUnread) {
        //         if (startMessage) {
        //             setTimeout(() => {
        //                 const el = document.getElementById(`msg-${startMessage.id}`);
        //                 if (el) container.scrollTop = el.offsetTop - 20;
        //                 else container.scrollTop = 0;
        //             }, 100);
        //         } else {
        //             container.scrollTop = 0;
        //         }
        //     } else {
        //         container.scrollTop = container.scrollHeight;
        //     }
        // } else {
        //     console.log('Scroll to Bottom for new channel');
        //     // Wait for DOM update
        //     setTimeout(() => {
        //         if (chatContainerRef.current) {
        //             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        //         }
        //     }, 100);
        // }

        // TRƯỜNG HỢP 2: Mới vào kênh
        if (!isChannelInitializedRef.current) {
            // Wait for DOM update
            initialScrollTimeoutIdRef.current = setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }
            }, 100);
        }

        // Trường hợp 3: Tin nhắn mới đến trong kênh đã được khởi tạo
        const lastMessage = messages[messages.length - 1];
        const isMyMessage = lastMessage?.authorId === currentUserId;

        if (isAtBottomRef.current || isMyMessage) {
            container.scrollTop = container.scrollHeight;

            setShowScrollDownBtn(false);
            setUnreadCount(0);
        } else {
            setShowScrollDownBtn(true);
            setUnreadCount(unreadCount + 1);
        }

        isChannelInitializedRef.current = true;
        // Note: Scroll Down (Load Future) does not need to be handled here

    }, [messages, channelId]);

    // 2. Handle Scroll 
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.target as HTMLDivElement;
        const { scrollTop, scrollHeight, clientHeight } = container;

        // SCROLL UP (Load History)
        if (scrollTop < SCROLL_THRESHOLD && !isFetchingOld && hasMoreOlder && headCursor) {
            setIsFetchingOld(true);
            prevScrollHeightRef.current = scrollHeight;

            dispatch(fetchMessagesByChannelId({
                channelId: channelId!,
                cursor: headCursor,
                direction: 'BEFORE'
            }));
        }

        // SCROLL DOWN (Load Future)
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        if (distanceFromBottom < SCROLL_THRESHOLD && !isFetchingNew && hasMoreNewer && tailCursor) {
            setIsFetchingNew(true);
            dispatch(fetchMessagesByChannelId({
                channelId: channelId!,
                cursor: tailCursor,
                direction: 'AFTER'
            }));
        }

        // --- LOGIC MARK AS READ ---
        // Find last message ID in bottom viewport
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        isAtBottomRef.current = isNearBottom;

        if (isNearBottom) {
            const lastMessageId = unreadChannel?.[channelId!].lastMessageId
            // Trigger debounce update
            updateReadStatus(channelId!, lastMessageId!);

            // Hide scroll down button
            setShowScrollDownBtn(false);
        }
    }// Throttle 200ms: Check scroll position every 200ms

    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (container) {
            // Smooth scroll cho nó nghệ
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            setShowScrollDownBtn(false);
            setUnreadCount(0);
        }
    };

    const updateReadStatus = useMemo(() =>
        debounce((channelId: string, messageId: string) => {
            if (messageId <= unreadChannel?.[channelId!]?.lastReadMessageId) {
                return;
            }

            dispatch(markChannelAsRead({ userId: currentUserId!, channelId, lastReadMessageId: messageId }));
        }, 1000), // Only trigger after 1s user stop scrolling
        [unreadChannel]
    );

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

    return (
        <>
            <ChannelChatHeader title={currentChannel?.name ? `#${currentChannel.name}` : 'Channel'} onOpenChannelMember={() => setIsMemberListOpen(!isMemberListOpen)} />

            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="relative flex-1 flex flex-col overflow-y-auto p-4 space-y-4"
            >
                {/* Loading Indicator */}
                {isFetchingOld && (
                    <div className="text-center py-2 text-xs text-gray-400">
                        Loading history...
                    </div>
                )}

                {/* Out of messages */}
                {!hasMoreOlder && currentMessages.length > 0 && (
                    <div className="text-center py-4 text-gray-500 text-xs">
                        This is the start of the conversation.
                    </div>
                )}

                {/* Render messages */}

                {[...currentMessages].reverse().map((message) => {
                    // const isUnreadMsg = hasUnread
                    //     && message.id == String(Number(unreadChannel?.[channelId!].lastReadMessageId || 0) + 1);
                    return (
                        <MessageItem
                            key={message.id}
                            message={message}
                            isUnread={false}
                            channelMembers={channelMembers}
                        />
                    )
                })}

            </div>

            {/* --- FLOATING BUTTON --- */}
            {showScrollDownBtn && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-10 right-10 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all animate-bounce"
                >
                    {unreadCount} New Messages ⬇
                </button>
            )}

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