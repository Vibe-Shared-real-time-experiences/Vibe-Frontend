// src/pages/ServerPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../features/hooks';
import { getServerById } from '../../../features/chat/serverThunk';
import ChannelLeftSidebar from '../../../components/chat/ChannelLeftSidebar';
import ChannelChatArea from '../../../components/chat/ChannelChatArea';

export default function ChannelPage() {
    const { serverId } = useParams();

    const dispatch = useAppDispatch();
    const { currentServerId, categories } = useAppSelector((state) => state.channel);

    useEffect(() => {
        if (serverId && serverId !== currentServerId) {
            dispatch(getServerById(serverId));
        }
    }, [dispatch, serverId, currentServerId]);


    // if (isLoading) {
    //     return <div className="flex items-center justify-center h-full text-white">Loading...</div>;
    // }

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* 1. Secondary Sidebar (Channels) */}
            <ChannelLeftSidebar categories={categories} currentServerId={currentServerId!} />

            {/* 2. Channel Chat Area */}
            {<ChannelChatArea />}
        </div>
    );
}