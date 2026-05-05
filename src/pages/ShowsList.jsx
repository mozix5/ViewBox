import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MovieCard from "../components/MovieCard";
import { MovieCardSkeleton } from "../components/Skeleton";
import Paginator from "../components/Paginator";
import { fetchMovies } from "../redux/features/movies/fetchMoviesSlice";

const SECTION_LABELS = {
  upcoming: "Coming Soon",
  popular: "Popular Right Now",
  trending: "Trending Today",
  top_rated: "Top Rated",
  horror: "Horror",
};

const ShowsList = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { fetchedMovies, isFetching } = useSelector((state) => state.fetchMovies);

  const searchParams = new URLSearchParams(window.location.search);
  const pageNum = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    dispatch(fetchMovies({ page: pageNum, category: params.genre, key: pageNum }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, pageNum, params.genre]);

  const label = SECTION_LABELS[params.genre] || params.genre;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700 rounded-full blur-[160px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-8 pt-28 pb-4">
        {/* Header */}
        <div className="mb-10 flex items-end gap-4">
          <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-purple-400 to-violet-600 shrink-0" />
          <div>
            <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold mb-1">Browse</p>
            <h1 className="text-4xl font-extrabold capitalize leading-none">{label}</h1>
          </div>
          <div className="ml-auto text-sm text-gray-600">
            Page {pageNum}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 place-items-center mb-4">
          {isFetching[pageNum] || !fetchedMovies[pageNum]
            ? [...Array(18)].map((_, i) => <MovieCardSkeleton key={i} />)
            : fetchedMovies[pageNum]?.map((item) => (
                <MovieCard
                  key={item.id}
                  image={item.poster_path}
                  rating={item.vote_average}
                  id={item.id}
                  genre={params.genre}
                  title={item.title}
                />
              ))}
        </div>

        <Paginator />
      </div>
    </div>
  );
};

export default ShowsList;
