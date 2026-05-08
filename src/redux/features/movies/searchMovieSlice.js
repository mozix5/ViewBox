import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { movieService } from "../../../services/movieService";

const initialState = {
  searchResults: [],
  isSearching: false,
  error: null,
};

export const searchMovies = createAsyncThunk(
  "movies/search",
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await movieService.search(query, page);
      return response.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchMovieSlice = createSlice({
  name: "searchMovies",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch } = searchMovieSlice.actions;
export default searchMovieSlice.reducer;
