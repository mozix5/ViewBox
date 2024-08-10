import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DELETE_VIEWBOX } from "../../../utils/api";

const initialState = {
  isRemoving: false,
  error: {},
};

export const removeMovie = createAsyncThunk(
  "movies/remove",
  async ({ endpoint, headers }, { rejectWithValue }) => {
    try {
      const response = await DELETE_VIEWBOX(`movies/${endpoint}`, headers);
      return response;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

const removeMovieSlice = createSlice({
  name: "removeMovie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeMovie.pending, (state) => {
        state.isRemoving = true;
      })
      .addCase(removeMovie.fulfilled, (state) => {
        state.isRemoving = false;
      })
      .addCase(removeMovie.rejected, (state, action) => {
        state.isRemoving = false;
        state.error = action.payload ? action.payload.error : "Unknown Error";
      });
  },
});

export default removeMovieSlice.reducer;
