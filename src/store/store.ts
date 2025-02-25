import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../slice/booksSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
});

// Define RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
