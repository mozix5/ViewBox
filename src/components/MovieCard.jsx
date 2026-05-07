import React, { memo } from "react";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMovieById } from "../redux/features/movies/fetchMovieByIdSlice";

const MovieCard = ({ image, rating, id, genre, title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Prefetch movie details on hover for instant feel when clicking
  const handleMouseEnter = () => {
    if (id) {
      dispatch(fetchMovieById({ id }));
    }
  };

  return (
    <div
      onClick={() => navigate(`/${genre}/${id}`)}
      onMouseEnter={handleMouseEnter}
      className="group relative h-56 w-36 sm:h-72 sm:w-48 rounded-2xl overflow-hidden cursor-pointer shrink-0 shadow-lg hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 hover:-translate-y-2 hover:scale-105"
    >
      {/* Poster - Optimized to w342 for performance */}
      <img
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        src={`https://image.tmdb.org/t/p/w342${image}`}
        loading="lazy"
        alt={title || "Movie poster"}
      />
      
      {/* ... rest of the component remains same ... */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        {title && (
          <p className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-2">{title}</p>
        )}
        <div className="flex items-center gap-1.5">
          <AiFillStar className="text-yellow-400 text-sm" />
          <span className="text-yellow-300 text-sm font-bold">{Number(rating).toFixed(1)}</span>
          <span className="text-gray-400 text-xs">/10</span>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <AiFillStar className="text-yellow-400 text-xs" />
        <span className="text-white text-xs font-bold">{Number(rating).toFixed(1)}</span>
      </div>
    </div>
  );
};

export default memo(MovieCard);
