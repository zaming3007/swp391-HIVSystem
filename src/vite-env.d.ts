/// <reference types="vite/client" />

declare module './store' {
    import { configureStore } from '@reduxjs/toolkit';

    export const store: ReturnType<typeof configureStore>;
    export type RootState = ReturnType<typeof store.getState>;
    export type AppDispatch = typeof store.dispatch;
}
