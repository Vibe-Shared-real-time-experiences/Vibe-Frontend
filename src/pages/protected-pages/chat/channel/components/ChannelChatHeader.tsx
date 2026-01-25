import { Bell, Hash, Users } from 'lucide-react'

const ChannelChatHeader = ({ title, onOpenChannelMember }: { title: string, onOpenChannelMember: () => void }) => {
    return (
        <div className="h-12 border-b border-[#26272D] flex items-center px-4 justify-between shadow-sm z-10" >
            <div className="flex items-center text-white">
                <Hash size={24} className="text-gray-400 mr-2" />
                <span className="font-bold mr-4">{title}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
                <Bell size={20} className="cursor-pointer hover:text-white" />
                <Users size={20} className="cursor-pointer hover:text-white" onClick={() => onOpenChannelMember()} />
                <div className="w-64 bg-[#1E1F22] rounded px-2 py-1 text-sm text-gray-400 hidden lg:block">Search...</div>
            </div>
        </div>
    )
}

export default ChannelChatHeader