import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreateServerRequest, ServerDetailResponse, ServerResponse } from "../../types/chat/server";

import * as serverService from "../../services/chat/serverService";
import type { RootState } from "../store";

export const getServers = createAsyncThunk<ServerResponse[], void, { rejectValue: string }>(
    "chat/getServers",
    async (_, thunkApi) => {
        try {
            const response = await serverService.fetchServers();
            return response.data.data;
        } catch (error: unknown) {
            return thunkApi.rejectWithValue("Fetching servers failed" + error);
        }
    }
)

export const getServerById = createAsyncThunk<ServerDetailResponse, string, { rejectValue: string }>(
    "chat/getServerById",
    async (serverId: string, thunkApi) => {
        try {
            const response = await serverService.fetchServerById(serverId);
            return response.data.data;
        } catch (error: unknown) {
            return thunkApi.rejectWithValue("Fetching server by ID failed" + error);
        }
    },
    {
        condition: (serverId, { getState }) => {
            const { server } = getState() as RootState;

            if (server.isLoading && server.currentServerId === serverId) {
                return false;
            }

            // Return true => Cho phép gọi API
            return true;
        }
    }
)

export const createServer = createAsyncThunk<ServerDetailResponse, CreateServerRequest, { rejectValue: string }>(
    "chat/createServer",
    async (data: CreateServerRequest, thunkApi) => {
        try {
            const response = await serverService.createServer(data);
            return response.data.data;
        } catch (error: unknown) {
            return thunkApi.rejectWithValue("Creating server failed" + error);
        }
    }
)