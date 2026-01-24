import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CategoryResponse } from "../../types/chat/category";
import type { ChannelResponse } from "../../types/chat/channel";
import { flatChannelFormCategories } from "../../utils/channelUtil";

interface ChannelState {
    categories: CategoryResponse[];

    channelsMap: Record<string, ChannelResponse>;

    activeChannelId: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ChannelState = {
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
        setServerData: (state, action: PayloadAction<CategoryResponse[]>) => {
            const { categories, channelsMap, activeChannelId } = flatChannelFormCategories(action.payload);

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
})

export const channelReducer = channelSlice.reducer;
export const { setServerData, setActiveChannel } = channelSlice.actions;