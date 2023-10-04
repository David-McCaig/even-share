import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../src/features/authentication/userSlice";
import groupIdSlice from "./features/groupexpense/groupIdSlice";
import { firestoreApi } from "./firestoreApi";

export const setupStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      groupId: groupIdSlice,
      [firestoreApi.reducerPath]: firestoreApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(firestoreApi.middleware);
    },
  });

export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

