import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../../services/userService";

const initialState = {
  isAdding: false,
  error: null,
};

export const addReview = createAsyncThunk(
  "reviews/add",
  async ({ body }, { rejectWithValue }) => {
    try {
      const { data } = await userService.addReview(body);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add review");
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
