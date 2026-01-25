// src/pages/ServerPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../features/hooks';
import { getServerById } from '../../../../features/chat/serverThunk';
import ChannelLeftSidebar from './components/ChannelLeftSidebar';
import ChannelChatArea from './components/ChannelChatArea';
import AppLoader from '../../../../components/common/AppLoader';

export default function ChannelPage() {
    const { serverId } = useParams();

    const dispatch = useAppDispatch();
    const { currentServerId, isLoading } = useAppSelector((state) => state.channel);

    useEffect(() => {
        if (serverId && serverId !== currentServerId) {
            dispatch(getServerById(serverId));
        }
    }, [dispatch, serverId, currentServerId]);


    // if (isLoading) {
    //     return <AppLoader />
    // }

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* 1. Secondary Sidebar (Channels) */}
            <ChannelLeftSidebar />

            {/* 2. Channel Chat Area */}
            {<ChannelChatArea />}
        </div>
    );
}