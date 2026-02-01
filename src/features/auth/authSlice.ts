import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchUserProfile, login, register } from "./authThunk";
import type { LoginResponse, RegisterResponse } from "../../types/auth";
import type { UserProfileResponse } from "../../types/user/api/userProfile";

interface AuthState {
    user: UserProfileResponse | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
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
            state.isLoading = false;
            state.error = null;

            localStorage.setItem("access_token", action.payload.accessToken);
            localStorage.setItem("refresh_token", action.payload.refreshToken);
        });
        builder.addCase(login.rejected, (state, action) => {
            // Handle failed login
            state.isAuthenticated = false;
            state.isLoading = false;

            state.user = null
            state.error = action.payload || "Login failed";
        });

        // REGISTER
        builder.addCase(register.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
            // Handle successful registration
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            localStorage.setItem("access_token", action.payload.accessToken);
            localStorage.setItem("refresh_token", action.payload.refreshToken);
        })
        builder.addCase(register.rejected, (state, action) => {
            // Handle failed registration
            state.isAuthenticated = false;
            state.isLoading = false;

            state.user = null;
            state.error = action.payload || "Registration failed";
        });

        // FETCH USER PROFILE
        builder.addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfileResponse>) => {
            state.user = action.payload;
        });
    }
});

export default authSlice.reducer;