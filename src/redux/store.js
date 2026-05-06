import { configureStore } from "@reduxjs/toolkit";
import fetchMoviesReducer from "./features/movies/fetchMoviesSlice";
import fetchMovieByIdReducer from "./features/movies/fetchMovieByIdSlice";
import authReducer from "./features/auth/authSlice";
import searchMoviesReducer from "./features/movies/searchMovieSlice";
import watchlistReducer from "./features/movies/watchlistSlice";
import fetchReviewsReducer from "./features/reviews/fetchReviewsSlice";
import addReviewReducer from "./features/reviews/addReviewSlice";
import likeReviewReducer from "./features/reviews/likeReviewSlice";

export const store = configureStore({
  reducer: {
    fetchMovies: fetchMoviesReducer,
    fetchMovieById: fetchMovieByIdReducer,
    auth: authReducer,
    watchlist: watchlistReducer,
    searchMovies: searchMoviesReducer,
    fetchReviews: fetchReviewsReducer,
    addReview: addReviewReducer,
    likeReview: likeReviewReducer,
  },
});
