// src/pages/ServerPage.tsx
import { Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../features/hooks';
import ChannelLeftSidebar from './components/ChannelLeftSidebar';
import ChannelChatArea from './components/ChannelChatArea';
import AppLoader from '../../../../components/common/AppLoader';
import { getServerById } from '../../../../features/chat/serverThunk';

export default function ChannelPage() {
    const { serverId } = useParams();
    const dispatch = useAppDispatch();

    const { currentServerId, isLoading } = useAppSelector((state) => state.channel);

    useEffect(() => {
        if (!currentServerId) {
            dispatch(getServerById(serverId!));
        }
    }, [dispatch, serverId, currentServerId]);

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