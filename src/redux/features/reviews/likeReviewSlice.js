import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../../services/userService";

const initialState = {
  isLiking: false,
  error: null,
};

export const toggleLike = createAsyncThunk(
  "reviews/toggleLike",
  async ({ reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await userService.toggleReviewLike(reviewId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to like review");
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
