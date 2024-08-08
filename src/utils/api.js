import axios from "axios";
import { key, TMDB_API, VIEWBOX_API } from "./constants";

export const GET = async ({ id, fetchUrl, category, page }) => {
  const url = fetchUrl
    ? fetchUrl
    : id
    ? `${TMDB_API}/${id}?api_key=${key}&append_to_response=videos`
    : `${TMDB_API}/${category}?api_key=${key}&language=en-US&page=${page}`;

  const response = await axios.get(url);
  return response.data;
};

export const POST = async (endpoint, { body }) => {
  const url = `${VIEWBOX_API}/${endpoint}`;
  const response = await axios.post(url, body);
  return response.data;
};
