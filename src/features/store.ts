import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import authReducer from "./auth/authSlice";
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import { serverReducer } from "./chat/serverSlice";
import { channelReducer } from "./chat/channelSlice";
import memberReducer from "./chat/memberSlice";
import messageReducer from "./chat/messageSlice";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ['auth'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    server: serverReducer,
    channel: channelReducer,
    message: messageReducer,
    member: memberReducer
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),

    reducer: persistedReducer
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;