import { createSlice } from "@reduxjs/toolkit";
import { fetchMessagesByChannelId, fetchMissingMembers } from "./messageThunk";
import type { ChannelMessages } from "../../types/chat/api/message";
import type { MemberSummaryInfo } from "../../types/chat/api/member";


interface memberState {
    channelMembers: Record<string, MemberSummaryInfo>;
    isLoading: boolean;
    error: string;
}

const initialState: memberState = {
    channelMembers: {},
    isLoading: false,
    error: "",
};

export const memberSlice = createSlice({
    name: "member",
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Update channel members when fetching channel messages
        builder.addCase(fetchMessagesByChannelId.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(fetchMessagesByChannelId.fulfilled, (state, action) => {
            const channelMessages = action.payload as ChannelMessages;

            channelMessages.memberInfos?.forEach((member) => {
                state.channelMembers[member.memberId] = member;
            });

            state.isLoading = false;
            state.error = "";
        });
        builder.addCase(fetchMessagesByChannelId.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || "Failed to fetch channel members.";
        });

        // Fetch missing members by ID
        builder.addCase(fetchMissingMembers.pending, (state) => {
            state.isLoading = true;
            state.error = "";
        });
        builder.addCase(fetchMissingMembers.fulfilled, (state, action) => {
            // Merge fetched members into channelMembers cache
            action.payload.forEach((member) => {
                state.channelMembers[member.memberId] = member;
            });

            state.isLoading = false;
            state.error = "";
        });
        builder.addCase(fetchMissingMembers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || "Failed to fetch members.";
        });
    }
});

export default memberSlice.reducer;