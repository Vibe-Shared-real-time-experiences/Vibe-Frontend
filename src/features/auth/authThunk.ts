import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../../types/auth";
import { loginApi, registerApi } from "../../services/auth";

export const login = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string }>(
    "auth/login",
    async (credentials: LoginRequest, thunkApi) => {
        try {
            const response = await loginApi(credentials);
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
            const response = await registerApi(data);
            return response.data.data;
        } catch (error: unknown) {
            return thunkApi.rejectWithValue("Registration failed" + error);
        }
    }
)