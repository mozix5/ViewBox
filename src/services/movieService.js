import { tmdbClient } from "./apiClient";

const cache = new Map();

export const movieService = {
  getDetails: (id) => fetchWithCache(`/movie/${id}`, { params: { append_to_response: "videos,credits" } }),

  getWatchProviders: (id) => fetchWithCache(`/movie/${id}/watch/providers`),

  getPersonDetails: (id) => fetchWithCache(`/person/${id}`, { params: { append_to_response: "combined_credits" } }),

  getOmdbDetails: async (imdbId) => {
    if (!imdbId) return null;
    const cacheKey = `omdb_${imdbId}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    // Request via backend proxy, no apikey needed in frontend
    const res = await fetch(`http://localhost:5001/proxy/omdb?i=${imdbId}`);
    const data = await res.json();
    cache.set(cacheKey, data);
    return data;
  },
  
  search: (query, page = 1) => fetchWithCache(`/search/movie`, { params: { query, page } }),

  getByCategory: (category, page = 1) => fetchWithCache(`/movie/${category}`, { params: { page } }),
  
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
