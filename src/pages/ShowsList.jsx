import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MovieCard from "../components/MovieCard";
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
  }, [dispatch, fetchMovies]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-16 text-white">
      <div className="grid grid-cols-5 mb-12 gap-6 place-items-center border-red-600">
        {fetchedMovies[pageNum]?.map((item) => (
          <MovieCard
            key={item.id}
            image={item.poster_path}
            rating={item.vote_average}
            id={item.id}
          />
        ))}
      </div>
      <Paginator />
    </div>
  );
};

export default ShowsList;
