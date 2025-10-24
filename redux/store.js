import { configureStore } from '@reduxjs/toolkit';
import songQueueSlice from './slices/songQueueSlice';

export const store = configureStore({
    reducer: {
        songQueue: songQueueSlice
    },
});