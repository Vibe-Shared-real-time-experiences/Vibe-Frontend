import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createServer, getServerById, getServers } from "./serverThunk";
import type { ServerResponse } from "../../types/chat/api/server";

interface ServerState {
    servers: ServerResponse[];
    currentServerId: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ServerState = {
    servers: [],
    currentServerId: null,
    isLoading: false,
    error: null,
};

export const serverSlice = createSlice({
    name: "server",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        // GET SERVERS
        builder.addCase(getServers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getServers.fulfilled, (state, action: PayloadAction<ServerResponse[]>) => {
            state.isLoading = false;
            state.servers = action.payload;
        });
        builder.addCase(getServers.rejected, (state, action: PayloadAction<string | undefined>) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to fetch servers";
        });

        // GET SERVER BY ID
        builder.addCase(getServerById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getServerById.fulfilled, (state, action: PayloadAction<ServerResponse>) => {
            state.isLoading = false;
            state.currentServerId = action.payload.id;
        });
        builder.addCase(getServerById.rejected, (state, action: PayloadAction<string | undefined>) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to fetch server by ID";
        });

        // Create Server
        builder.addCase(createServer.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createServer.fulfilled, (state, action: PayloadAction<ServerResponse>) => {
            state.isLoading = false;
            state.servers.push(action.payload);
            state.currentServerId = action.payload.id;
        });
        builder.addCase(createServer.rejected, (state, action: PayloadAction<string | undefined>) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to create server";
        });
    }
})

export const serverReducer = serverSlice.reducer;