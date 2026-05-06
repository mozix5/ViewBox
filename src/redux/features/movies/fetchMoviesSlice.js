import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { movieService } from "../../../services/movieService";

const InitialState = {
  fetchedMovies: {},
  isFetching: {},
  error: {},
  totalPages: {},
};

export const fetchMovies = createAsyncThunk(
  "movies/fetch",
  async ({ category, page = 1, fetchUrl, key, filters }, { rejectWithValue }) => {
    try {
      let response;
      if (filters && Object.values(filters).some(v => v)) {
        response = await movieService.discover(filters, page);
      } else if (fetchUrl) {
        response = await movieService.getByUrl(fetchUrl);
      } else {
        response = await movieService.getByCategory(category, page);
      }
      return { key, fetchedMovies: response };
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
        state.totalPages[key] = fetchedMovies.total_pages;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        const { key, error } = action.payload;
        state.isFetching[key] = false;
        state.error[key] = error;
      });
  },
});

export default fetchMoviesSlice.reducer;
