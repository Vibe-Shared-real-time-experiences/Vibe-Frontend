// src/components/layout/ServerSidebar.tsx
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CreateServerForm from './CreateServerForm';
import { useAppDispatch, useAppSelector } from '../../../../../features/hooks';
import { getServerById, getServers } from '../../../../../features/chat/serverThunk';
import { flatChannelFormCategories } from '../../../../../utils/channelUtil';
import { socketService } from '../../../../../services/socketService';

export default function ServerSidebar() {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { servers } = useAppSelector((state) => state.server);
    const { currentServerId } = useAppSelector((state) => state.channel);

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (servers.length === 0) {
            dispatch(getServers());
        }
    }, [dispatch, servers.length]);

    useEffect(() => {
        if (token && !socketService.isConnected()) {
            socketService.connect(token);
        }
    }, [token])

    const [isOpen, setOpen] = useState(false);

    const handleOpenServer = async (serverId: string) => {
        if (serverId === currentServerId) {
            return;
        }

        const serverDetail = await dispatch(getServerById(serverId)).unwrap();
        const { currentChannel } = flatChannelFormCategories(serverDetail);

        if (currentChannel) {
            navigate(`/channels/${serverDetail.id}/${currentChannel.id}`);
        } else {
            throw new Error("No active channel found");
        }
    }

    return (
        <>
            {isOpen && <CreateServerForm onClose={() => setOpen(false)} />}

            <nav className="w-[72px] bg-[#1E1F22] py-3 flex flex-col items-center gap-2 overflow-y-auto shrink-0">
                {/* Home */}
                <button
                    onClick={() => navigate('/channels/@me')}
                    className="w-12 h-12 bg-[#313338] hover:bg-[#5865F2] hover:rounded-[16px] rounded-[24px] transition-all duration-200 flex items-center justify-center group mb-2"
                >
                    <img src="/vibe-logo.png" alt="Home" className="w-7 h-5" />
                </button>

                <div className="w-8 h-[2px] bg-[#35363C] rounded-lg mx-auto" />

                {/* Server List */}
                {servers.map((server) => {

                    const isActive = currentServerId === server.id.toString();

                    return (
                        <div key={server.id} className="relative group w-full flex justify-center">
                            {/* White pill indicator on hover */}
                            <div className={`
                                absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-white transition-all duration-200
                                ${isActive ? 'h-10 opacity-100' : 'h-2 opacity-0 group-hover:opacity-100 group-hover:h-5'} 
                            `} />
                            <button
                                onClick={() => handleOpenServer(server.id)}
                                className="w-12 h-12 rounded-[24px] group-hover:rounded-[16px] overflow-hidden transition-all duration-200"
                            >
                                <img src={server.iconUrl ? server.iconUrl : '/default-icon.png'} alt={server.id} className="w-full h-full object-cover" />
                            </button>
                        </div>
                    )
                })}

                {/* Line to separate */}
                <div className="w-8 h-[2px] bg-[#35363C] rounded-lg mx-auto mt-2" />

                {/* Add Server Button */}
                <button
                    onClick={() => setOpen(true)}
                    className="w-12 h-12 bg-[#313338] hover:bg-[#23A559] text-[#23A559] hover:text-white rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center group"
                >
                    <Plus size={24} />
                </button>
            </nav>
        </>
    );
}