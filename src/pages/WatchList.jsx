import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MovieCard from "../components/MovieCard";
import Paginator from "../components/Paginator";

import { setHeaders } from "../utils/constants";
import { fetchWatchList } from "../redux/features/movies/fetchWatchListSlice";

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
      const endpoint = `${user?._id}/${search}`;
      dispatch(fetchWatchList({ endpoint, headers, key }));
    }
  }, [user, dispatch, fetchWatchList]);

  return (
    <div className=" bg-black pt-20 pb-6 text-white min-h-screen px-16">
      <div className=" flex gap-8 flex-wrap justify-start">
        {watchList[key]?.map(({ movie }) => (
          <MovieCard
            key={movie._id}
            image={movie.posterUrl}
            rating={movie.rating}
            id={movie.movieId}
            genre={movie.title}
          />
        ))}
      </div>
      <Paginator />
    </div>
  );
};

export default WatchList;
