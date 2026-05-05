import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { POST } from "../../../utils/api";

const initialState = {
  isAdding: false,
  error: null,
};

export const addReview = createAsyncThunk(
  "reviews/add",
  async ({ body, headers }, { rejectWithValue }) => {
    try {
      const response = await POST("reviews", { body, headers });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addReviewSlice = createSlice({
  name: "addReview",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.isAdding = true;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.isAdding = false;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload;
      });
  },
});

export default addReviewSlice.reducer;
