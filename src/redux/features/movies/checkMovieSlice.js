import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_VIEWBOX } from "../../../utils/api";

const initialState = {
  isMovieInWatchList: false,
  isChecking: false,
  error: {},
};

export const checkMovie = createAsyncThunk(
  "watchList/checkMovie",
  async ({ endpoint, headers }, { rejectWithValue }) => {
    try {
      const response = await GET_VIEWBOX(`movies/${endpoint}`, headers);
      return response;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

const checkMovieSlice = createSlice({
  name: "checkMovie",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkMovie.pending, (state) => {
        state.isChecking = true;
      })
      .addCase(checkMovie.fulfilled, (state, action) => {
        state.isChecking = false;
        state.isMovieInWatchList = action.payload.isMovieInWatchList;
      })
      .addCase(checkMovie.rejected, (state, action) => {
        state.isChecking = false;
        state.error = action.payload ? action.payload.error : "Unknown Error";
      });
  },
});

export default checkMovieSlice.reducer;
