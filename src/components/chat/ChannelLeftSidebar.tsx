import type { CategoryResponse } from '../../types/chat/category'
import { Hash } from 'lucide-react'

const ChannelLeftSidebar = ({ categories, currentServerId }: { categories: CategoryResponse[], currentServerId: string }) => {

  return (
    <div className="w-60 bg-[#2B2D31] flex flex-col">
      {/* Server Header */}
      <div className="h-12 border-b border-[#1F2023] hover:bg-[#35373C] transition cursor-pointer px-4 flex items-center justify-between shadow-sm">
        <h1 className="font-bold text-white truncate">Vibe Server {currentServerId}</h1>
      </div>

      {/* Channel List */}
      <div className="flex-1 flex flex-col overflow-y-auto p-2 space-y-0.5 gap-y-1">
        {categories.map(category => (
          <div key={category.id} className="mt-4">
            <div className="text-xs font-bold text-gray-500 uppercase px-2 mb-1">{category.name} {category.id}</div>
            <div className="space-y-0.5">
              {category.channels.map(channel => (
                <div key={channel.id} className="group flex items-center px-2 py-[6px] rounded hover:bg-[#35373C] text-gray-400 hover:text-gray-100 cursor-pointer transition">
                  <Hash size={20} className="mr-1.5 text-gray-400" />
                  <span className="font-medium truncate">{channel.name} {channel.id}</span>
                </div>
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