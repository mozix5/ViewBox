import { configureStore } from "@reduxjs/toolkit";
import fetchMoviesReducer from "./features/movies/fetchMoviesSlice";
import fetchMovieByIdReducer from "./features/movies/fetchMovieByIdSlice";
import authReducer from "./features/user/authSlice";
import searchMoviesReducer from "./features/movies/searchMovieSlice";
import watchlistReducer from "./features/user/watchlistSlice";
import reviewReducer from "./features/user/reviewSlice";

export const store = configureStore({
  reducer: {
    fetchMovies: fetchMoviesReducer,
    fetchMovieById: fetchMovieByIdReducer,
    auth: authReducer,
    watchlist: watchlistReducer,
    searchMovies: searchMoviesReducer,
    reviews: reviewReducer,
  },
});
