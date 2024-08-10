import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { POST } from "../../../utils/api";

const initialState = {
  isAdding: false,
  error: {},
};

export const addMovie = createAsyncThunk(
  "watchList/addMovie",
  async ({ body, headers }, { rejectWithValue }) => {
    try {
      const response = await POST("movies", { body, headers });
      return response;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

const addMovieSlice = createSlice({
  name: "addMovie",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMovie.pending, (state) => {
        state.isAdding = true;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.isAdding = false;
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload ? action.payload.error : "Unknown Error";
      });
  },
});

export default addMovieSlice.reducer;
