import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_VIEWBOX } from "../../../utils/api";

const initialState = {
  watchList: {},
  isFetching: {},
  error:{}
};

export const fetchWatchList = createAsyncThunk(
  "watchList/fetch",
  async ({ endpoint, headers, key }, { rejectWithValue }) => {
    try {
      const response = await GET_VIEWBOX(`movies/${endpoint}`, headers);
      return { key, data: response };
    } catch (error) {
      return rejectWithValue({ key, error: error.message });
    }
  }
);

const fetchWatchListSlice = createSlice({
  name: "watchList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchList.pending, (state, action) => {
        const { key } = action.meta.arg;
        state.isFetching[key] = true;
      })
      .addCase(fetchWatchList.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        state.isFetching[key] = false;
        state.watchList[key] = data;
      })
      .addCase(fetchWatchList.rejected, (state, action) => {
        const { key, error } = action.payload;
        state.isFetching[key] = false;
        state.error[key] = error;
      });
  },
});

export default fetchWatchListSlice.reducer;
