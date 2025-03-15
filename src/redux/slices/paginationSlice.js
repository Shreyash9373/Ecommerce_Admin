import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: 1,
  recordsPerPage: 3, // Default records per page
  totalPages: 0, // Will be updated dynamically
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setRecordsPerPage: (state, action) => {
      state.recordsPerPage = action.payload;
    },
  },
});

export const { setCurrentPage, setTotalPages, setRecordsPerPage } =
  paginationSlice.actions;
export default paginationSlice.reducer;
