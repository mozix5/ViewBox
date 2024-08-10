import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET } from "../../../utils/api";

const InitialState = {
  fetchedMovies: {},
  isFetching: {},
  error: {},
};

export const fetchMovies = createAsyncThunk(
  "movies/fetch",
  async ({ category, page = 1, fetchUrl, key }, { rejectWithValue }) => {
    try {
      const response = await GET({ fetchUrl, category, page });
      return { key, fetchedMovies:response };
    } catch (error) {
      return rejectWithValue({ key, error: error.message });
    }
  }
);

const fetchMoviesSlice = createSlice({
  name: "fetchMovies",
  initialState: InitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state, action) => {
        const { key } = action.meta.arg;
        state.isFetching[key] = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const { key, fetchedMovies } = action.payload;
        state.isFetching[key] = false;
        state.fetchedMovies[key] = fetchedMovies.results;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        const { key, error } = action.payload;
        state.isFetching[key] = false;
        state.error[key] = error;
      });
  },
});

export default fetchMoviesSlice.reducer;
