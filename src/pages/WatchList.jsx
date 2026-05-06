import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar } from "react-icons/ai";
import { FiBookmark, FiTrash2 } from "react-icons/fi";
import { MdMovieFilter } from "react-icons/md";

import { fetchWatchList, removeOptimistic, removeFromWatchlist } from "../redux/features/movies/watchlistSlice";
import { MovieCardSkeleton } from "../components/Skeleton";

const WatchList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { watchList, isFetching } = useSelector((state) => state.watchlist);
  const { search } = useLocation();
  const pageNum = parseInt(search.split("=")[1]) || 1;

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWatchList({ userId: user._id, page: pageNum }));
    }
  }, [user, dispatch, pageNum]);

  const handleRemove = async (movieId) => {
    if (user?._id) {
      // Optimistic update for better UX
      dispatch(removeOptimistic({ movieId, key: pageNum }));
      
      // Actual API call
      await dispatch(removeFromWatchlist({ userId: user._id, movieId }));
      
      // Refresh to ensure sync if needed (optional)
      dispatch(fetchWatchList({ userId: user._id, page: pageNum }));
    }
  };

  const movies = watchList[pageNum] || [];
  const fetching = isFetching[pageNum];

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[400px] bg-purple-700 rounded-full blur-[180px] opacity-8 pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-700 rounded-full blur-[150px] opacity-8 pointer-events-none" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-8 md:px-14 pt-28 pb-16">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-purple-400 to-violet-600 shrink-0" />
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold mb-1">My Collection</p>
              <h1 className="text-4xl font-extrabold leading-none">Watchlist</h1>
            </div>
          </div>

          {!fetching && movies.length > 0 && (
            <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-2xl px-5 py-3">
              <FiBookmark className="text-purple-400" />
              <span className="text-2xl font-bold text-white">{movies.length}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider ml-1">
                {movies.length === 1 ? "Title" : "Titles"}
              </span>
            </div>
          )}
        </div>

        {/* ── Grid / States ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {fetching ? (
            /* Loading state */
            [...Array(12)].map((_, i) => (
              <div key={i} className="flex justify-center">
                <MovieCardSkeleton />
              </div>
            ))
          ) : movies.length === 0 ? (
            /* Empty state */
            <div className="col-span-full flex flex-col items-center justify-center py-32 gap-6 text-center">
              <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                <MdMovieFilter className="text-5xl text-gray-600" />
              </div>
              <h2 className="text-3xl font-bold text-white">Nothing saved yet</h2>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Browse movies and tap the bookmark icon to build your personal watchlist.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-2 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30"
              >
                Discover Movies
              </button>
            </div>
          ) : (
            /* Movies list */
            movies.map(({ movie }) => (
              <div
                key={movie._id}
                className="group relative h-72 w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                onClick={() => navigate(`/${movie.genre || "popular"}/${movie.movieId}`)}
              >
                {/* Poster */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.posterUrl}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Hover overlay — reveals title + rating */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-2">{movie.title}</p>
                  <div className="flex items-center gap-1.5">
                    <AiFillStar className="text-yellow-400 text-sm" />
                    <span className="text-yellow-300 text-sm font-bold">{Number(movie.rating).toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">/10</span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(movie.movieId);
                  }}
                  title="Remove from Watchlist"
                  className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:bg-red-600 hover:border-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchList;
