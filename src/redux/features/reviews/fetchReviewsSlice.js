import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_VIEWBOX } from "../../../utils/api";

const initialState = {
  reviews: [],
  isFetching: false,
  error: null,
};

export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async ({ movieId }, { rejectWithValue }) => {
    try {
      const response = await GET_VIEWBOX(`reviews/${movieId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchReviewsSlice = createSlice({
  name: "fetchReviews",
  initialState: initialState,
  reducers: {},
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

export default fetchReviewsSlice.reducer;
