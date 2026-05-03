import axios from "axios";
import { key, TMDB_API, VIEWBOX_API } from "./constants";

export const GET = async ({ id, fetchUrl, category, page, query }) => {
  const url = fetchUrl
    ? fetchUrl
    : id
    ? `${TMDB_API}/movie/${id}?api_key=${key}&append_to_response=videos`
    : query
    ? `${TMDB_API}/search/movie?api_key=${key}&query=${query}&language=en-US&page=${page}`
    : `${TMDB_API}/movie/${category}?api_key=${key}&language=en-US&page=${page}`;

  const response = await axios.get(url);
  return response.data;
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
