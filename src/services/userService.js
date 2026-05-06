import { viewboxClient } from "./apiClient";

export const userService = {
  // Auth
  login: (body) => viewboxClient.post("/users/login", body),
  signup: (body) => viewboxClient.post("/users/signup", body),

  // Watchlist
  getWatchlist: (userId, page = 1) => viewboxClient.get(`/movies/${userId}?page=${page}`),
  addToWatchlist: (body) => viewboxClient.post("/movies", body),
  removeFromWatchlist: (userId, movieId) => viewboxClient.delete(`/movies/${userId}/${movieId}`),
  checkWatchlist: (userId, movieId) => viewboxClient.get(`/movies/${userId}/${movieId}`),

  // Reviews
  getReviews: (movieId) => viewboxClient.get(`/reviews/${movieId}`),
  addReview: (body) => viewboxClient.post("/reviews", body),
  toggleReviewLike: (reviewId) => viewboxClient.post(`/reviews/like/${reviewId}`),
};
