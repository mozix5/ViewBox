import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET } from "../../../utils/api";

const InitialState = {
  fetchedMovie: {},
  loading: false,
  error: null,
};

export const fetchMovieById = createAsyncThunk(
  "movieById/fetch",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await GET({ id });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchMovieByIdSlice = createSlice({
  name: "fetchMovieById",
  initialState: InitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchedMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown Error";
      });
  },
});

export default fetchMovieByIdSlice.reducer;
