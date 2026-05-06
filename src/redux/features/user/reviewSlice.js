import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../../services/userService";

const initialState = {
  reviews: [],
  isFetching: false,
  isAdding: false,
  isUpdating: {}, // Track loading state for specific reviews (e.g. for likes)
  error: null,
};

export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async ({ movieId }, { rejectWithValue }) => {
    try {
      const { data } = await userService.getReviews(movieId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/add",
  async ({ body }, { rejectWithValue }) => {
    try {
      const { data } = await userService.addReview(body);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleReviewLike = createAsyncThunk(
  "reviews/toggleLike",
  async ({ reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await userService.toggleReviewLike(reviewId);
      return { reviewId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    // Optimistic update for likes if needed
    optimisticLike: (state, action) => {
      const { reviewId, userId } = action.payload;
      const review = state.reviews.find(r => r._id === reviewId);
      if (review) {
        const index = review.likes.indexOf(userId);
        if (index === -1) review.likes.push(userId);
        else review.likes.splice(index, 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
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
      })
      // Add
      .addCase(addReview.pending, (state) => {
        state.isAdding = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isAdding = false;
        state.reviews.unshift(action.payload); // Add new review to top
      })
      .addCase(addReview.rejected, (state) => {
        state.isAdding = false;
      })
      // Like
      .addCase(toggleReviewLike.pending, (state, action) => {
        state.isUpdating[action.meta.arg.reviewId] = true;
      })
      .addCase(toggleReviewLike.fulfilled, (state, action) => {
        const { reviewId, data } = action.payload;
        state.isUpdating[reviewId] = false;
        const index = state.reviews.findIndex(r => r._id === reviewId);
        if (index !== -1) {
          state.reviews[index] = data; // Update with latest review data from server
        }
      })
      .addCase(toggleReviewLike.rejected, (state, action) => {
        state.isUpdating[action.meta.arg.reviewId] = false;
      });
  },
});

export const { optimisticLike } = reviewSlice.actions;
export default reviewSlice.reducer;
