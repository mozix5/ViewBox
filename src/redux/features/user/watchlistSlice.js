import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../../services/userService";

const initialState = {
  watchList: {},
  isFetching: {},
  isUpdating: {}, // Track loading state for individual movie IDs
  error: {},
  inWatchlist: {}, // cache for individual movie checks
};

export const fetchWatchList = createAsyncThunk(
  "watchlist/fetch",
  async ({ userId, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await userService.getWatchlist(userId, page);
      return { key: page, data };
    } catch (error) {
      return rejectWithValue({ key: page, error: error.response?.data?.message || error.message });
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  "watchlist/add",
  async ({ body }, { rejectWithValue }) => {
    try {
      const { data } = await userService.addToWatchlist(body);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  "watchlist/remove",
  async ({ userId, movieId }, { rejectWithValue }) => {
    try {
      const { data } = await userService.removeFromWatchlist(userId, movieId);
      return { movieId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const checkWatchlist = createAsyncThunk(
  "watchlist/check",
  async ({ userId, movieId }, { rejectWithValue }) => {
    try {
      const { data } = await userService.checkWatchlist(userId, movieId);
      return { movieId, exists: data.isMovieInWatchList };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    // Optimistic update for removing
    removeOptimistic: (state, action) => {
      const { movieId, key } = action.payload;
      if (state.watchList[key]) {
        state.watchList[key] = state.watchList[key].filter(item => item.movie.movieId !== movieId);
      }
      state.inWatchlist[movieId] = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWatchList.pending, (state, action) => {
        const { page } = action.meta.arg;
        state.isFetching[page] = true;
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
      })
      // Check
      .addCase(checkWatchlist.pending, (state, action) => {
        state.isUpdating[action.meta.arg.movieId] = true;
      })
      .addCase(checkWatchlist.fulfilled, (state, action) => {
        const { movieId, exists } = action.payload;
        state.isUpdating[movieId] = false;
        state.inWatchlist[movieId] = exists;
      })
      .addCase(checkWatchlist.rejected, (state, action) => {
        state.isUpdating[action.meta.arg.movieId] = false;
      })
      // Add
      .addCase(addToWatchlist.pending, (state, action) => {
        state.isUpdating[action.meta.arg.body.movieId] = true;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        const { movieId } = action.meta.arg.body;
        state.isUpdating[movieId] = false;
        state.inWatchlist[movieId] = true;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.isUpdating[action.meta.arg.body.movieId] = false;
      })
      // Remove
      .addCase(removeFromWatchlist.pending, (state, action) => {
        state.isUpdating[action.meta.arg.movieId] = true;
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        const { movieId } = action.payload;
        state.isUpdating[movieId] = false;
        state.inWatchlist[movieId] = false;
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.isUpdating[action.meta.arg.movieId] = false;
      });
  },
});

export const { removeOptimistic } = watchlistSlice.actions;
export default watchlistSlice.reducer;
