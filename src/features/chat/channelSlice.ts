import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CategoryResponse } from "../../types/chat/api/category";
import type { ChannelResponse } from "../../types/chat/api/channel";
import { flatChannelFormCategories } from "../../utils/channelUtil";
import type { ServerDetailResponse } from "../../types/chat/api/server";
import { getServerById } from "./serverThunk";

interface ChannelState {
    currentServerId: string | null;
    categories: CategoryResponse[];

    channelsMap: Record<string, ChannelResponse>;

    currentChannel: ChannelResponse | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ChannelState = {
    currentServerId: null,
    categories: [],
    channelsMap: {},
    currentChannel: null,
    isLoading: false,
    error: null,
};

export const channelSlice = createSlice({
    name: "channel",
    initialState: initialState,
    reducers: {
        setServerData: (state, action: PayloadAction<ServerDetailResponse>) => {
            const { serverId, categories, channelsMap, currentChannel } = flatChannelFormCategories(action.payload);

            state.currentServerId = serverId;
            state.categories = categories;
            state.channelsMap = channelsMap;
            state.currentChannel = currentChannel;

            state.isLoading = false;
            state.error = null;
        },

        setActiveChannel: (state, action: PayloadAction<ChannelResponse | null>) => {
            state.currentChannel = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getServerById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });

        builder.addCase(getServerById.fulfilled, (state, action: PayloadAction<ServerDetailResponse>) => {
            const { serverId, categories, channelsMap, currentChannel } = flatChannelFormCategories(action.payload);

            state.currentServerId = serverId;
            state.categories = categories;
            state.channelsMap = channelsMap;
            state.currentChannel = currentChannel;
            state.isLoading = false;
            state.error = null;
        });
    }
})

export const channelReducer = channelSlice.reducer;
export const { setServerData, setActiveChannel } = channelSlice.actions;