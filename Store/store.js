import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./Slice/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
export default store;
