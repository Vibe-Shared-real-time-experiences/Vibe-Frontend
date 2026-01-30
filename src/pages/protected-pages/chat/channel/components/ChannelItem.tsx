import { Hash, Settings, Users } from 'lucide-react'
import type { ChannelResponse } from '../../../../../types/chat/api/channel';

const ChannelItem = ({ channel, isActive, onChangeChannel }: { channel: ChannelResponse; isActive: boolean; onChangeChannel: (channelId: string) => void }) => {
    return (
        <div
            onClick={() => onChangeChannel(channel.id)}
            key={channel.id}
            className={`group flex items-center justify-between px-2 py-[6px] rounded transition ${isActive
                ? 'bg-[#35373C] text-gray-100'
                : 'hover:bg-[#35373C] text-gray-400 hover:text-gray-100 cursor-pointer'
                }`}
        >
            <div className="flex items-center min-w-0">
                <Hash size={20} className="mr-1.5 text-gray-400 flex-shrink-0" />
                <span className="font-medium truncate">{channel.name}</span>
            </div>
            <div className={`flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition ${isActive ? 'opacity-100' : ''}`}>
                <Users size={16} className="text-gray-500 hover:text-gray-300 cursor-pointer" />
                <Settings size={16} className="text-gray-500 hover:text-gray-300 cursor-pointer" />
            </div>
        </div>
    )
}

export default ChannelItem