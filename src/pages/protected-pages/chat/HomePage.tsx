// src/pages/HomePage.tsx
import { MessageSquare } from 'lucide-react';

export default function HomePage() {



    return (
        <div className="flex-1 bg-[#313338] flex flex-col items-center justify-center text-center relative p-4">
            {/* Search bar */}
            <div className="w-full h-12 border-b border-[#1F2023] flex items-center px-4 absolute top-0 left-0">
                <button className="text-gray-400 bg-[#1E1F22] text-sm px-2 py-1 rounded w-64 text-left">Find or start a conversation</button>
            </div>

            {/* Contents */}
            <div className="bg-[#2B2D31] p-4 rounded-full mb-4">
                <MessageSquare size={48} className="text-gray-400" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">No Conversations Yet</h3>
            <p className="text-gray-400 max-w-md">
                You haven't clicked on any server yet. Check the sidebar on the left to join the action, or wait for a friend to message you!
            </p>
        </div>
    );
}