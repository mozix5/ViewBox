import { configureStore } from "@reduxjs/toolkit";
import fetchMoviesReducer from "./features/movies/moviesSlice";
import fetchMovieByIdReducer from "./features/movies/movieByIdSlice";

export const store = configureStore({
  reducer: {
    movies: fetchMoviesReducer,
    movieById: fetchMovieByIdReducer,
  },
});
