import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { HiArrowSmRight } from "react-icons/hi";

import MovieCard from "./MovieCard";
import { MovieCardSkeleton } from "./Skeleton";
import { fetchMovies } from "../redux/features/movies/fetchMoviesSlice";
import { SECTION_LABELS } from "../config/movieConfig";

const Row = ({ fetchURL, title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchedMovies, isFetching } = useSelector((state) => state.fetchMovies);
  const scrollRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMovies({ fetchUrl: fetchURL, key: title }));
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -600 : 600, behavior: "smooth" });
    }
  };

  const label = SECTION_LABELS[title] || title;

  return (
    <section className="px-8 md:px-14 pb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Accent bar */}
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-violet-600" />
          <h2 className="text-white text-xl font-bold capitalize tracking-tight">{label}</h2>
        </div>

        <button
          onClick={() => navigate(`/${title}`)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition-colors font-medium group"
        >
          See all
          <HiArrowSmRight className="text-base group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Row with scroll arrows */}
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 w-10 h-10 rounded-full bg-black/70 backdrop-blur border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:bg-purple-600/80 shadow-xl"
        >
          <FiChevronLeft className="text-lg" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 w-10 h-10 rounded-full bg-black/70 backdrop-blur border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:bg-purple-600/80 shadow-xl"
        >
          <FiChevronRight className="text-lg" />
        </button>

        {/* Left fade edge */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-20" />
        {/* Right fade edge */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent z-20" />

        {isFetching[title] || !fetchedMovies[title] ? (
          <div className="flex gap-5 overflow-x-hidden py-2">
            {[...Array(8)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-scroll scrollbar-hide scroll-smooth snap-x snap-mandatory py-2"
          >
            {fetchedMovies[title]?.map((item) => (
              <div key={item.id} className="snap-start shrink-0">
                <MovieCard
                  image={item.poster_path}
                  rating={item.vote_average}
                  id={item.id}
                  genre={title}
                  title={item.title}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Row;
