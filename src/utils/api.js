import axios from "axios";
import { key, TMDB_API, VIEWBOX_API } from "./constants";

const cache = new Map();

export const GET = async ({ id, fetchUrl, category, page, query, filters }) => {
  // Generate a unique cache key based on the request parameters
  const cacheKey = JSON.stringify({ id, fetchUrl, category, page, query, filters });
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  let url;
  const cleanBase = TMDB_API.replace(/\/movie$/, "");

  if (fetchUrl) {
    url = fetchUrl;
  } else if (id) {
    url = `${cleanBase}/movie/${id}?api_key=${key}&append_to_response=videos`;
  } else if (query) {
    url = `${cleanBase}/search/movie?api_key=${key}&query=${query}&language=en-US&page=${page}`;
  } else if (filters) {
    const { year, genre, language, sort } = filters;
    url = `${cleanBase}/discover/movie?api_key=${key}&language=en-US&page=${page}`;
    if (year) url += `&primary_release_year=${year}`;
    if (genre) url += `&with_genres=${genre}`;
    if (language) url += `&with_original_language=${language}`;
    if (sort) url += `&sort_by=${sort}`;
  } else {
    url = `${cleanBase}/movie/${category}?api_key=${key}&language=en-US&page=${page}`;
  }

  const response = await axios.get(url);
  const data = response.data;
  
  // Store in cache for 5 minutes (or until page refresh)
  cache.set(cacheKey, data);
  
  return data;
};

export const POST = async (endpoint, { body, headers }) => {
  const url = `${VIEWBOX_API}/${endpoint}`;
  const response = await axios.post(url, body, headers);
  return response.data;
};

export const GET_VIEWBOX = async (endpoint, headers) => {
  const url = `${VIEWBOX_API}/${endpoint}`;
  const response = await axios.get(url, headers);
  return response.data;
};

export const DELETE_VIEWBOX = async (endpoint, headers) => {
  const url = `${VIEWBOX_API}/${endpoint}`;
  const response = await axios.delete(url, headers);
  return response.data;
};
