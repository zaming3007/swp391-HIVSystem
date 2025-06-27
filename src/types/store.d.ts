declare module '../store' {
    import { User, AuthState } from './index';
    import { configureStore } from '@reduxjs/toolkit';

    export const store: ReturnType<typeof configureStore>;

    export interface RootState {
        auth: AuthState;
    }

    export type AppDispatch = typeof store.dispatch;

    export const updateUser: (user: User) => void;
} 