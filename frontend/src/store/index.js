import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "../services/api/baseApi";
import { pharmacyApi } from "../services/pharmacyApi";
import authReducer from "../modules/auth/authSlice";

export const store = configureStore({
  reducer: {
    // Redux ToolKit Query (RTK Query)
    [baseApi.reducerPath]: baseApi.reducer,
    [pharmacyApi.reducerPath]: pharmacyApi.reducer,

    // Feature reducers
    auth: authReducer,
  },

  // Custom middleware for RTK Query caching & invalidation
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, pharmacyApi.middleware),
});

// Refetch on focus or reconnect
setupListeners(store.dispatch);

// Removed TypeScript types from Javascript file
