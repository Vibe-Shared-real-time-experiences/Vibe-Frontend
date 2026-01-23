// src/components/layout/ServerSidebar.tsx
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ServerSidebar() {
    const navigate = useNavigate();

    const servers = [
        { id: '1', name: 'Test1', img: 'https://placehold.co/48x48/5865F2/white?text=N' },
        { id: '2', name: 'Test2', img: 'https://placehold.co/48x48/green/white?text=G' },
        { id: '3', name: 'Test3', img: 'https://placehold.co/48x48/orange/white?text=R' },
    ];

    return (
        <nav className="w-[72px] bg-[#1E1F22] py-3 flex flex-col items-center gap-2 overflow-y-auto shrink-0">
            {/* Home */}
            <button
                onClick={() => navigate('/channels')}
                className="w-12 h-12 bg-[#313338] hover:bg-[#5865F2] hover:rounded-[16px] rounded-[24px] transition-all duration-200 flex items-center justify-center group mb-2"
            >
                <img src="/vibe-logo.png" alt="Home" className="w-7 h-5" />
            </button>

            <div className="w-8 h-[2px] bg-[#35363C] rounded-lg mx-auto" />

            {/* Server List */}
            {servers.map((server) => (
                <div key={server.id} className="relative group w-full flex justify-center">
                    {/* White pill indicator on hover */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-white rounded-r-full opacity-0 group-hover:opacity-100 transition-all" />

                    <button
                        onClick={() => navigate(`/channels/${server.id}`)}
                        className="w-12 h-12 rounded-[24px] group-hover:rounded-[16px] overflow-hidden transition-all duration-200"
                    >
                        <img src={server.img} alt={server.name} className="w-full h-full object-cover" />
                    </button>
                </div>
            ))}

            {/* Line to separate */}
            <div className="w-8 h-[2px] bg-[#35363C] rounded-lg mx-auto mt-2" />

            {/* Add Server Button */}
            <button className="w-12 h-12 bg-[#313338] hover:bg-[#23A559] text-[#23A559] hover:text-white rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center group">
                <Plus size={24} />
            </button>
        </nav>
    );
}