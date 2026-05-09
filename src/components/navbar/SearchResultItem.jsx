import React from "react";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";

const SearchResultItem = ({ movie, onClick }) => (
  <Link
    to={`/movie/${movie.id}`}
    onClick={onClick}
    className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors group"
  >
    <div className="relative shrink-0 w-11 h-16 rounded-lg overflow-hidden bg-white/5 ring-1 ring-white/10">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
            : "https://placehold.co/44x64/0f0a1e/555?text=?"
        }
        alt={movie.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-semibold truncate group-hover:text-purple-300 transition-colors">
        {movie.title}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {movie.release_date && (
          <span className="text-[11px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
            {movie.release_date.split("-")[0]}
          </span>
        )}
        {movie.vote_average > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-yellow-500/90">
            <AiFillStar className="text-[10px]" />
            {movie.vote_average.toFixed(1)}
          </span>
        )}
      </div>
    </div>

    <span className="text-gray-700 group-hover:text-purple-400 transition-colors text-sm shrink-0">›</span>
  </Link>
);

export default SearchResultItem;
