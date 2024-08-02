import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET } from "../../../utils/api";

const InitialState = {
  data: {},
  loading: {},
  error: {},
};

export const fetchMovies = createAsyncThunk(
  "movies/fetch",
  async ({ category, page = 1, fetchUrl, key }, { rejectWithValue }) => {
    try {
      const response = await GET({ fetchUrl, category, page });
      return { key, data: response };
    } catch (error) {
      return rejectWithValue({ key, error: error.message });
    }
  }
);

const fetchMoviesSlice = createSlice({
  name: "movies",
  initialState: InitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state, action) => {
        const { key } = action.meta.arg;
        state.loading[key] = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        state.loading[key] = false;
        state.data[key] = data.results;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        const { key, error } = action.payload;
        state.loading[key] = false;
        state.error[key] = error;
      });
  },
});

export default fetchMoviesSlice.reducer;
