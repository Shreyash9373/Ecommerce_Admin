import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null, // Stores admin details
  isAuthenticated: false, // Tracks authentication state
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
      console.log("Admin", state.admin);
      console.log("Auth", state.isAuthenticated);
    },
    clearAdmin: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
