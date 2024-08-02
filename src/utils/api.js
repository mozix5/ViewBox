import axios from "axios";
import { key } from "./constants";

// Base URL for the movie API

// GET function to fetch data based on provided parameters
const baseUrl = "https://api.themoviedb.org/3/movie";
export const GET = async ({ id, fetchUrl, category, page }) => {
  const url = fetchUrl
    ? fetchUrl
    : id
    ? `${baseUrl}/${id}?api_key=${key}&append_to_response=videos`
    : `${baseUrl}/${category}?api_key=${key}&language=en-US&page=${page}`;

  const response = await axios.get(url);
  return response.data;
};
