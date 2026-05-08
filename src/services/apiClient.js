import axios from "axios";
import { TMDB_API, VIEWBOX_API } from "../utils/constants";

// Client for TMDB (via Proxy)
export const tmdbClient = axios.create({
  baseURL: TMDB_API,
  params: {
    language: "en-US",
  },
});

// Client for ViewBox (Private Backend)
export const viewboxClient = axios.create({
  baseURL: VIEWBOX_API,
});

// Auto-inject Authorization header for ViewBox requests
viewboxClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      const cleanToken = JSON.parse(token);
      config.headers.Authorization = `Bearer ${cleanToken}`;
    } catch (e) {
      // If token isn't valid JSON, fallback to raw string or ignore
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
