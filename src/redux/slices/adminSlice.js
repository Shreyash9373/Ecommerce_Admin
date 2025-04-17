import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null, // Stores admin details
  isAuthenticated: false, // Tracks authentication state
  loading: true,
  theme: localStorage.getItem("theme") || "light",
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
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const {
  setAdmin,
  logoutAdmin,
  setAuthStatus,
  setLoading,
  toggleTheme,
  setTheme,
} = adminSlice.actions;
export default adminSlice.reducer;
