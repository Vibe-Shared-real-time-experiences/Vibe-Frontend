import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CategoryResponse } from "../../types/chat/category";
import type { ChannelResponse } from "../../types/chat/channel";
import { flatChannelFormCategories } from "../../utils/channelUtil";
import type { ServerDetailResponse } from "../../types/chat/server";
import { getServerById } from "./serverThunk";

interface ChannelState {
    currentServerId: string | null;
    categories: CategoryResponse[];

    channelsMap: Record<string, ChannelResponse>;

    activeChannelId: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ChannelState = {
    currentServerId: null,
    categories: [],
    channelsMap: {},
    activeChannelId: null,
    isLoading: false,
    error: null,
};

export const channelSlice = createSlice({
    name: "channel",
    initialState: initialState,
    reducers: {
        setServerData: (state, action: PayloadAction<ServerDetailResponse>) => {
            const { serverId, categories, channelsMap, activeChannelId } = flatChannelFormCategories(action.payload);

            state.currentServerId = serverId;
            state.categories = categories;
            state.channelsMap = channelsMap;
            state.activeChannelId = activeChannelId;

            state.isLoading = false;
            state.error = null;
        },

        setActiveChannel: (state, action: PayloadAction<string>) => {
            state.activeChannelId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getServerById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });

        builder.addCase(getServerById.fulfilled, (state, action: PayloadAction<ServerDetailResponse>) => {
            const { serverId, categories, channelsMap, activeChannelId } = flatChannelFormCategories(action.payload);

            state.currentServerId = serverId;
            state.categories = categories;
            state.channelsMap = channelsMap;
            state.activeChannelId = activeChannelId;
            state.isLoading = false;
            state.error = null;
        });
    }
})

export const channelReducer = channelSlice.reducer;
export const { setServerData, setActiveChannel } = channelSlice.actions;