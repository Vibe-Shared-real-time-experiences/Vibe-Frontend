import { createAsyncThunk } from "@reduxjs/toolkit";
import * as channelService from './../../services/chat/channelService';
import * as serverService from './../../services/chat/serverService';
import type { UpdateUnreadStateRequest } from "../../types/chat/request/unreadState";

export const fetchUnreadChannels = createAsyncThunk(
    "unreadState/fetchUnreadChannels",
    async (serverId: string, { rejectWithValue }) => {
        try {
            const response = await serverService.fetchUnreadChannels(serverId);
            return response.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch unread channels" + error);
        }
    }
)

export const fetchUnreadStateByChannelId = createAsyncThunk(
    "unreadState/fetchUnreadState",
    async (channelId: string, { rejectWithValue }) => {
        try {
            const response = await channelService.fetchUserReadStateByChannelId(channelId);
            return response;
        } catch (error) {
            return rejectWithValue("Failed to fetch unread state" + error);
        }
    }
)

export const markChannelAsRead = createAsyncThunk(
    "unreadState/markChannelAsRead",
    async (params: UpdateUnreadStateRequest, { rejectWithValue }) => {
        try {
            const response = await channelService.markChannelAsRead(params);
            return response;
        } catch (error) {
            return rejectWithValue("Failed to mark channel as read" + error);
        }
    }
)