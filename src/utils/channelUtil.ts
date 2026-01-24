import type { CategoryResponse } from "../types/chat/category";
import type { ChannelResponse } from "../types/chat/channel";

export const flatChannelFormCategories = (categories: CategoryResponse[]) => {
    const channelsMap: Record<string, ChannelResponse> = {};
    let firstChannelId: string | null = null;

    categories.forEach((cat) => {
        cat.channels.forEach((chan) => {
            // 1. Build channels map
            channelsMap[chan.id] = chan;

            // 2. Find first text channel ID
            if (firstChannelId == null && chan.type === 'TEXT') {
                firstChannelId = chan.id;
            }
        });
    });

    return { categories, channelsMap, activeChannelId: firstChannelId };
};