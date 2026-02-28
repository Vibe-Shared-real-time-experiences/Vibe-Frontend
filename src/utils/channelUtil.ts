import type { ChannelResponse } from "../types/chat/api/channel";
import type { ServerDetailResponse } from "../types/chat/api/server";

export const flatChannelFormCategories = (server: ServerDetailResponse) => {
    const channelsMap: Record<string, ChannelResponse> = {};
    let firstChannel: ChannelResponse | undefined;

    server.categories.forEach((cat) => {
        if (cat.position === 0 && cat.channels.length > 0) {
            cat.channels.forEach((chan) => {
                // 1. Build channels map
                channelsMap[chan.id] = chan;

                // 2. Find first text channel ID
                if (firstChannel == null && chan.type === "TEXT" && chan.position === 0) {
                    firstChannel = chan;
                }
            });
        }
    });

    return {
        serverId: server.id.toString(),
        categories: server.categories,
        channelsMap,
        currentChannel: firstChannel,
    };
};