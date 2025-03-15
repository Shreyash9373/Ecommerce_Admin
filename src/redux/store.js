import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import paginationReducter from "./slices/paginationSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    pagination: paginationReducter,
  },
});

export default store;
