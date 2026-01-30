import { createSlice } from "@reduxjs/toolkit";
import { fetchMessagesByChannelId } from "./messageThunk";
import type { ChannelMessages } from "../../types/chat/api/message";
import type { MemberSummaryInfo } from "../../types/chat/api/member";


interface memberState {
    channelMembers: Record<string, MemberSummaryInfo>;
}

const initialState: memberState = {
    channelMembers: {},
};

export const memberSlice = createSlice({
    name: "member",
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Update channel members when fetching channel messages
        builder.addCase(fetchMessagesByChannelId.fulfilled, (state, action) => {
            const { channelId } = action.meta.arg;
            const channelMessages = action.payload as ChannelMessages;

            channelMessages.senders?.forEach((member) => {
                state.channelMembers[channelId] = member;
            });
        });
    }
});

export default memberSlice.reducer;