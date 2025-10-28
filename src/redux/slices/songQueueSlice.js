import { createSlice } from '@reduxjs/toolkit';

const songQueueSlice = createSlice({
    name: 'songQueue',
    initialState: {
        current: -1,
        originalQueue: [],
        queue: [
            "86c9f86a7a680a1fb79cfa361eb6f96f",
            "1728c8a02bdde2e3be2d500299a015ad",
            "279658cde05f7033a90f27b541376529",
            "e873f53843a90a4424c715b56b3849a7",
            "92c6f5266613dae5e2cb3c58e9ffe942",
        ],
        repeatMode: 0, // 0: off, 1: all, 2: one
        shuffle: false,
    },
    reducers: {
        enqueueNext: (state, action) => {
            state.queue.splice(state.current + 1, 0, action.payload);

            if (state.shuffle) { state.originalQueue.push(action.payload); }
        },
        enqueue: (state, action) => {
            state.queue.push(action.payload);

            if (state.shuffle) { state.originalQueue.push(action.payload); }
        },
        dequeue: (state, action) => {
            return state.filter((item) => item != action.payload);
        },
        increaseCurrent: (state) => {
            if (state.queue.length == 0) return;

            if (state.current < state.queue.length - 1) {
                if (state.repeatMode == 2) {
                    state.current = state.current;
                } else {
                    state.current += 1;
                }
            } else {
                if (state.repeatMode == 1) {
                    state.current = 0;
                } else {
                    state.current = state.current;
                }
            }
        },
        decreaseCurrent: (state) => {
            if (state.queue.length == 0) return;

            if (state.current > 0) {
                if (state.repeatMode == 2) {
                    state.current = state.current;
                } else {
                    state.current -= 1;
                }
            } else {
                state.current = state.current;
            }
        },
        clearQueue: (state) => {
            state.queue = [];
            state.current = -1;
        },
        toggleShuffle: (state) => {
            if (state.shuffle) {
                state.shuffle = false;
                state.current = state.originalQueue.indexOf(state.queue[state.current]);
                state.queue = [...state.originalQueue];
                state.originalQueue = [];
            } else {
                state.shuffle = true;
                state.originalQueue = [...state.queue];
                const currentItem = state.queue[state.current];
                for (let i = state.queue.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]];
                }
                state.current = state.queue.indexOf(currentItem);
            }
        },
        nextRepeatMode: (state) => {
            state.repeatMode = (state.repeatMode + 1) % 3;
        },
    }
});

export const { enqueueNext, enqueue, dequeue, increaseCurrent, decreaseCurrent, clearQueue, toggleShuffle, nextRepeatMode } = songQueueSlice.actions;
export default songQueueSlice.reducer;