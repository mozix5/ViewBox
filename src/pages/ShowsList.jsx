import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MovieCard from "../components/MovieCard";
import { MovieCardSkeleton } from "../components/Skeleton";
import Paginator from "../components/Paginator";


import { fetchMovies } from "../redux/features/movies/fetchMoviesSlice";

const ShowsList = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { fetchedMovies, isFetching, error } = useSelector((state) => state.fetchMovies);

  const [pageNum, setPageNum] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return parseInt(searchParams.get("page")) || 1;
  });

  useEffect(() => {
    dispatch(
      fetchMovies({ page: pageNum, category: params.genre, key: pageNum })
    );
  }, [dispatch, pageNum, params.genre]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-16 text-white">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-12 gap-6 place-items-center">
        {isFetching[pageNum] || !fetchedMovies[pageNum] ? (
          [...Array(10)].map((_, i) => <MovieCardSkeleton key={i} />)
        ) : (
          fetchedMovies[pageNum]?.map((item) => (
            <MovieCard
              key={item.id}
              image={item.poster_path}
              rating={item.vote_average}
              id={item.id}
              genre={params.genre}
            />
          ))
        )}
      </div>

      <Paginator />
    </div>
  );
};

export default ShowsList;
