import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../src/features/authentication/userSlice";
import groupIdSlice from "./features/groupexpense/groupIdSlice";
import { firestoreApi } from "./firestoreApi";

// Function to setup and configure the Redux store
export const setupStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      groupId: groupIdSlice,
      // Adding RTK Query's API slice reducer for Firestore operations
      [firestoreApi.reducerPath]: firestoreApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      // Get default middleware and concatenate with firestoreApi's middleware for advanced RTK Query functionality
      return getDefaultMiddleware().concat(firestoreApi.middleware);
    },
  });

export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
