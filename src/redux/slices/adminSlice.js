import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null, // Stores admin details
  isAuthenticated: false, // Tracks authentication state
  loading: true,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      console.log("Admin", state.admin);
      console.log("Auth", state.isAuthenticated);
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload; // Set only authentication status
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAdmin, logoutAdmin, setAuthStatus, setLoading } =
  adminSlice.actions;
export default adminSlice.reducer;
