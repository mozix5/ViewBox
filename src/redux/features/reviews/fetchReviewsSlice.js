import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../../services/userService";

const initialState = {
  reviews: [],
  isFetching: false,
  error: null,
};

export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async ({ movieId }, { rejectWithValue }) => {
    try {
      const { data } = await userService.getReviews(movieId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

const fetchReviewsSlice = createSlice({
  name: "fetchReviews",
  initialState: initialState,
  reducers: {
    toggleReviewLike: (state, action) => {
      const { reviewId, userId } = action.payload;
      const review = state.reviews.find((r) => r._id === reviewId);
      if (review) {
        if (!review.likes) review.likes = [];
        const isLiked = review.likes.includes(userId);
        if (isLiked) {
          review.likes = review.likes.filter((id) => id !== userId);
        } else {
          review.likes.push(userId);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isFetching = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export const { toggleReviewLike } = fetchReviewsSlice.actions;
export default fetchReviewsSlice.reducer;
