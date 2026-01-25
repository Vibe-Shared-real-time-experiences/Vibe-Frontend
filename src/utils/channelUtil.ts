import type { ChannelResponse } from "../types/chat/channel";
import type { ServerDetailResponse } from "../types/chat/server";

export const flatChannelFormCategories = (server: ServerDetailResponse) => {
    const channelsMap: Record<string, ChannelResponse> = {};
    let firstChannelId: string | null = null;

    server.categories.forEach((cat) => {
        if (cat.position === 0 && cat.channels.length > 0) {
            cat.channels.forEach((chan) => {
                // 1. Build channels map
                channelsMap[chan.id] = chan;

                // 2. Find first text channel ID
                if (firstChannelId == null && chan.type === "TEXT" && chan.position === 0) {
                    firstChannelId = chan.id;
                }
            });
        }
    });

    return { serverId: server.id, categories: server.categories, channelsMap, activeChannelId: firstChannelId };
};