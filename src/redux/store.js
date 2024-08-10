import { configureStore } from "@reduxjs/toolkit";
import fetchMoviesReducer from "./features/movies/fetchMoviesSlice";
import fetchMovieByIdReducer from "./features/movies/fetchMovieByIdSlice";
import authReducer from "./features/auth/authSlice";
import addMovieReducer from "./features/movies/addMovieSlice";
import checkMovieReducer from "./features/movies/checkMovieSlice";
import fetchWatchListReducer from "./features/movies/fetchWatchListSlice";
import removeMovieReducer from "./features/movies/removeMovieSlice";

export const store = configureStore({
  reducer: {
    fetchMovies: fetchMoviesReducer,
    fetchMovieById: fetchMovieByIdReducer,
    auth: authReducer,
    addMovie: addMovieReducer,
    checkMovie: checkMovieReducer,
    fetchWatchList: fetchWatchListReducer,
    removeMovie: removeMovieReducer,
  },
});
