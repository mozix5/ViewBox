import { tmdbClient } from "./apiClient";

const cache = new Map();

export const movieService = {
  getPopular: (page = 1) => fetchWithCache(`/movie/popular`, { params: { page } }),
  getTopRated: (page = 1) => fetchWithCache(`/movie/top_rated`, { params: { page } }),
  getUpcoming: (page = 1) => fetchWithCache(`/movie/upcoming`, { params: { page } }),
  getNowPlaying: (page = 1) => fetchWithCache(`/movie/now_playing`, { params: { page } }),
  
  getDetails: (id) => fetchWithCache(`/movie/${id}`, { params: { append_to_response: "videos" } }),
  
  search: (query, page = 1) => fetchWithCache(`/search/movie`, { params: { query, page } }),

  getByCategory: (category, page = 1) => fetchWithCache(`/movie/${category}`, { params: { page } }),

  getByUrl: (url) => fetchWithCache(url),
  
  discover: (filters, page = 1) => {
    const { year, genre, language, sort } = filters;
    const params = {
      page,
      primary_release_year: year,
      with_genres: genre,
      with_original_language: language,
      sort_by: sort,
    };
    return fetchWithCache(`/discover/movie`, { params });
  },
};

// Internal cache wrapper
async function fetchWithCache(url, config = {}) {
  const cacheKey = url + JSON.stringify(config.params || {});
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const response = await tmdbClient.get(url, config);
  const data = response.data;
  cache.set(cacheKey, data);
  return data;
}
