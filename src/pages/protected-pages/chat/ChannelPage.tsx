// src/pages/ServerPage.tsx
import { useParams } from 'react-router-dom';
import { Hash, Bell, Users, Plus } from 'lucide-react';

export default function ChannelPage() {
    const { serverId } = useParams();

    // Mock Channels (Business Logic: In real app, fetch channels by serverId)
    const channels = ['general', 'videos-and-ideas', 'coding-technical', 'system-design'];

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* 1. Secondary Sidebar (Channels) */}
            <div className="w-60 bg-[#2B2D31] flex flex-col">
                {/* Server Header */}
                <div className="h-12 border-b border-[#1F2023] hover:bg-[#35373C] transition cursor-pointer px-4 flex items-center justify-between shadow-sm">
                    <h1 className="font-bold text-white truncate">Vibe Server {serverId}</h1>
                </div>

                {/* Channel List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-[2px]">
                    {channels.map(channel => (
                        <div key={channel} className="group flex items-center px-2 py-[6px] rounded hover:bg-[#35373C] text-gray-400 hover:text-gray-100 cursor-pointer transition">
                            <Hash size={20} className="mr-1.5 text-gray-400" />
                            <span className="font-medium truncate">{channel}</span>
                        </div>
                    ))}
                </div>

                {/* User Mini Profile (Bottom) */}
                <div className="h-[52px] bg-[#232428] flex items-center px-2 gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-500"></div>
                    <div className="flex-1">
                        <div className="text-xs font-bold text-white">NoobLearn</div>
                        <div className="text-[10px] text-gray-400">#1234</div>
                    </div>
                </div>
            </div>

            {/* 2. Main Chat Area */}
            <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
                {/* Chat Header */}
                <div className="h-12 border-b border-[#26272D] flex items-center px-4 justify-between shadow-sm z-10">
                    <div className="flex items-center text-white">
                        <Hash size={24} className="text-gray-400 mr-2" />
                        <span className="font-bold mr-4">general</span>
                        <span className="text-xs text-gray-400 border-l border-gray-600 pl-4">The main lounge</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                        <Bell size={20} className="cursor-pointer hover:text-white" />
                        <Users size={20} className="cursor-pointer hover:text-white" />
                        <div className="w-64 bg-[#1E1F22] rounded px-2 py-1 text-sm text-gray-400 hidden lg:block">Search...</div>
                    </div>
                </div>

                {/* Messages Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Mock Message */}
                    <div className="flex gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-1">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 mt-1 shrink-0"></div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-white font-medium hover:underline cursor-pointer">Phước</span>
                                <span className="text-xs text-gray-400">Today at 9:41 PM</span>
                            </div>
                            <p className="text-gray-100">vcl bựa thế :))</p>
                        </div>
                    </div>
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

            {/* 3. Member List (Optional/Hidden on small screens) */}
            <div className="w-60 bg-[#2B2D31] hidden xl:flex flex-col p-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Online — 1</h3>
                <div className="flex items-center gap-3 opacity-90 hover:opacity-100 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 relative">
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-[2px] border-[#2B2D31]"></div>
                    </div>
                    <span className="text-gray-300 font-medium">Phước</span>
                </div>
            </div>
        </div>
    );
}