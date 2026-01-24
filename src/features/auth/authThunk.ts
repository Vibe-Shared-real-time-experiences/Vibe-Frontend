import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../../types/auth";
import * as authService from "../../services/auth/authService";

export const login = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string }>(
    "auth/login",
    async (credentials: LoginRequest, thunkApi) => {
        try {
            const response = await authService.login(credentials);
            return response.data.data;
        } catch (error: unknown) {
            return thunkApi.rejectWithValue("Login failed" + error);
        }
    }
)

export const register = createAsyncThunk<RegisterResponse, RegisterRequest, { rejectValue: string }>(
    "auth/register",
    async (data: RegisterRequest, thunkApi) => {
        try {
            const response = await authService.register(data);
            return response.data.data;
        } catch (error: unknown) {
            return thunkApi.rejectWithValue("Registration failed" + error);
        }
    }
)