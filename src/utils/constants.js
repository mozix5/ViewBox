export const key = import.meta.env.VITE_API_KEY;
export const TMDB_API = import.meta.env.VITE_BASE_API_URL;
export const VIEWBOX_API = import.meta.env.VITE_BASE_DB_URL;

export const setHeaders = (token) => {
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return header;
};
