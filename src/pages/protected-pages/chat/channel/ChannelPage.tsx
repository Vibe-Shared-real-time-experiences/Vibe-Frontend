// src/pages/ServerPage.tsx
import { Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../features/hooks';
import ChannelLeftSidebar from './components/ChannelLeftSidebar';
import { getServerById } from '../../../../features/chat/serverThunk';
import { socketService } from '../../../../services/socketService';
import { addRealTimeMessage } from '../../../../features/chat/messageSlice';
import type { WsMessageEvent } from '../../../../types/socket';

export default function ChannelPage() {
    const { serverId } = useParams();
    const dispatch = useAppDispatch();

    const { currentServerId, channelsMap, isLoading } = useAppSelector((state) => state.channel);
    const currentUserId = useAppSelector((state) => state.auth.user?.id);

    useEffect(() => {
        if (!currentServerId) {
            dispatch(getServerById(serverId!))
        }
    }, [dispatch, serverId, currentServerId]);

    useEffect(() => {
        // 1. Subscribe to active server
        if (serverId && serverId !== socketService.getCurrentServerId()) {
            socketService.unsubscribeCurrentServer();

            socketService.subscribeToServer(serverId, (event: WsMessageEvent) => {
                // console.log("Received event for server:", event);
            });
        }

        // 2. Subcribe to channels in current server
        const channelIds = channelsMap
            ? Object.values(channelsMap).filter(channel => channel.serverId == serverId).map(channel => channel.id)
            : [];

        socketService.unsubscribeCurrentChannel();
        if (channelIds.length > 0) {
            socketService.subscribeToChannels(channelIds, (event: WsMessageEvent) => {
                console.log("Received event for channel:", event);
                if (event.eventType === 'MESSAGE_CREATED') {

                    console.log("idddddd:", event.data.author.id, currentUserId);

                    if (event.data.author.id === currentUserId) {
                        return; // Ignore messages sent by current user
                    }

                    // Handle new message event
                    dispatch(addRealTimeMessage(event.data));
                }
            });
        }
    }, [serverId, channelsMap, dispatch, currentUserId]);

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* 1. Secondary Sidebar (Channels) */}
            <ChannelLeftSidebar />

            <div className="flex-1 flex flex-col bg-[#313338] min-w-0 relative" >
                <Outlet />
            </div>
        </div>
    );
}