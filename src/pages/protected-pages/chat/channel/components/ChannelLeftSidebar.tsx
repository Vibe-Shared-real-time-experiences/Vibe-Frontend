import { useAppSelector } from '../../../../../features/hooks';
import { ChevronDown, Plus, Users } from 'lucide-react'
import ChannelItem from './ChannelItem';
import { useNavigate } from 'react-router-dom';
import { setActiveChannel } from '../../../../../features/chat/channelSlice';

const ChannelLeftSidebar = () => {

  const { categories, currentServerId, activeChannelId } = useAppSelector((state) => state.channel);
  const { servers } = useAppSelector((state) => state.server);

  const navigate = useNavigate();

  const currentServer = servers.find(server => server.id === currentServerId);

  const handleOnchangeChannel = (channelId: string) => {
    if (!channelId) return;

    setActiveChannel(channelId);
    navigate(`/channels/${currentServerId}/${channelId}`);
  }

  return (
    <div className="w-60 bg-[#2B2D31] flex flex-col">
      {/* Server Header */}
      <div className="h-12 border-b border-[#1F2023]  transition cursor-pointer px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1 flex-1 hover:bg-[#35373C]">
          <h1 className="font-bold text-white truncate">{currentServer?.name}</h1>
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        </div>
        <div>
          <Users size={16} className="text-gray-500 hover:text-gray-300 cursor-pointer" />
        </div>
      </div>

      {/* Channel List */}
      <div className="flex-1 flex flex-col overflow-y-auto p-2 space-y-0.5 gap-y-1">
        {categories.map(category => (
          <div key={category.id} className="mt-4">
            <div className="flex items-center justify-between px-2 mb-1">
              <div className="text-xs font-bold text-gray-500 uppercase">{category.name}</div>
              <Plus size={16} className="text-gray-500 hover:text-gray-300 cursor-pointer transition" />
            </div>
            <div className="space-y-0.5">
              {category.channels.map(channel => (
                <ChannelItem key={channel.id} channel={channel} activeChannelId={activeChannelId} onChangeChannel={handleOnchangeChannel} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Mini Profile (Bottom) */}
      <div className="h-[52px] bg-[#232428] flex items-center px-2 gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-500"></div>
        <div className="flex-1">
          <div className="text-xs font-bold text-white">Test</div>
          <div className="text-[10px] text-gray-400">#1234</div>
        </div>
      </div>
    </div>
  )
}

export default ChannelLeftSidebar