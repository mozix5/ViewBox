import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MovieCard from "../components/MovieCard";
import Paginator from "../components/Paginator";

import { setHeaders } from "../utils/constants";
import { fetchWatchList } from "../redux/features/movies/fetchWatchListSlice";
import { removeMovie } from "../redux/features/movies/removeMovieSlice";

const WatchList = () => {
  const dispatch = useDispatch();
  const { user, userToken } = useSelector((state) => state.auth);
  const { watchList } = useSelector((state) => state.fetchWatchList);
  const headers = setHeaders(userToken);
  const { search } = useLocation();
  const key = search.split("=")[1] || 1;
  console.log(key);

  useEffect(() => {
    if (user?._id && key) {
      const endpoint = `${user?._id}${search}`;
      dispatch(fetchWatchList({ endpoint, headers, key }));
    }
  }, [user, dispatch, fetchWatchList, search, key]);

  const handleRemove = async (movieId) => {
    if (user?._id) {
      const endpoint = `${user._id}/${movieId}`;
      await dispatch(removeMovie({ endpoint, headers }));
      
      const fetchEndpoint = `${user._id}${search}`;
      dispatch(fetchWatchList({ endpoint: fetchEndpoint, headers, key }));
    }
  };

  return (
    <div className=" bg-black pt-20 pb-6 text-white min-h-screen px-16">
      {(!watchList[key] || watchList[key].length === 0) ? (
        <div className="flex flex-col items-center justify-center w-full h-[60vh] text-gray-400">
          <svg className="w-24 h-24 mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          <h2 className="text-3xl font-bold text-white mb-3">Your Watchlist is Empty</h2>
          <p className="text-lg text-center max-w-md">Looks like you haven't added any movies or shows yet. Browse around and click the bookmark icon to save them for later!</p>
        </div>
      ) : (
        <>
          <div className=" flex gap-8 flex-wrap justify-start">
            {watchList[key].map(({ movie }) => (
              <div key={movie._id} className="relative group">
                <MovieCard
                  image={movie.posterUrl}
                  rating={movie.rating}
                  id={movie.movieId}
                  genre={movie.title}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(movie.movieId);
                  }}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg"
                  title="Remove from Watchlist"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {/* <Paginator /> */}
        </>
      )}
    </div>
  );
};

export default WatchList;
