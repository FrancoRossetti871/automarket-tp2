// Store global de Redux. La sesion no vive aca: la maneja useSession() de Better Auth.
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { carsApi } from "./api";

export const store = configureStore({
  reducer: {
    [carsApi.reducerPath]: carsApi.reducer, // state.carsApi -> cache de RTK Query
  },
  // El middleware de RTK Query maneja la cache, el refetch y la invalidacion por tags.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(carsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
