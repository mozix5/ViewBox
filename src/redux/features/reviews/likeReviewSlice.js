import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { POST } from "../../../utils/api";

const initialState = {
  isLiking: false,
  error: null,
};

export const toggleLike = createAsyncThunk(
  "reviews/toggleLike",
  async ({ reviewId, headers }, { rejectWithValue }) => {
    try {
      const response = await POST(`reviews/like/${reviewId}`, { headers });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const likeReviewSlice = createSlice({
  name: "likeReview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.pending, (state) => {
        state.isLiking = true;
      })
      .addCase(toggleLike.fulfilled, (state) => {
        state.isLiking = false;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.isLiking = false;
        state.error = action.payload;
      });
  },
});

export default likeReviewSlice.reducer;
