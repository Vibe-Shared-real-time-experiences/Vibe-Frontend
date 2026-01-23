import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { login, register } from "./authThunk";
import type { LoginResponse, RegisterResponse } from "../../types/auth";

interface AuthState {
    userId: string | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    userId: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        // LOGIN
        builder.addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
            // Handle successful login
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        });
        builder.addCase(login.rejected, (state) => {
            // Handle failed login
            state.isAuthenticated = false;
            state.token = null;
            state.refreshToken = null;
        });

        // REGISTER
        builder.addCase(register.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
            // Handle successful registration
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        })
        builder.addCase(register.rejected, (state) => {
            // Handle failed registration
            state.isAuthenticated = false;
            state.token = null;
            state.refreshToken = null;
        });
    }
});

export default authSlice.reducer;