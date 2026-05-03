import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { searchMovies, clearSearch } from "../redux/features/movies/searchMovieSlice";

import { logout, validate } from "../redux/features/auth/authSlice";

const Navbar = () => {
  const { loading, user, isAuthenticated, userToken } = useSelector(
    (state) => state.auth
  );
  const { searchResults, isSearching } = useSelector((state) => state.searchMovies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);


  useEffect(() => {
    if (userToken) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      dispatch(validate(currentUser));
    }
  }, [userToken, dispatch]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delayDebounceFn = setTimeout(() => {
        dispatch(searchMovies({ query: searchQuery }));
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      dispatch(clearSearch());
    }
  }, [searchQuery, dispatch]);

  const handleResultClick = () => {
    setSearchQuery("");
    setShowSearch(false);
  };


  return (
    <div className="text-white absolute right-0 left-0 z-[100] p-4 flex items-center justify-between">
      <div
        className=" font-sans  bg-clip-text text-4xl font-bold text-transparent uppercase cursor-pointer"
        style={{
          backgroundImage:
            "linear-gradient(45deg, hsl(240deg 33% 99%), hsl(263deg 38% 53%))",
          padding: "4px",
        }}
        onClick={() => navigate("/")}
      >
        viewbox
      </div>
      <div className="flex-1 flex justify-center px-8 relative">
        <div className={`flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1 w-full max-w-md transition-all ${showSearch ? 'ring-2 ring-purple-500' : ''}`}>
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search movies..."
            className="bg-transparent border-none outline-none text-white w-full py-1 text-sm placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearch(true)}
          />
          {searchQuery && (
            <AiOutlineClose 
              className="text-gray-400 cursor-pointer ml-2" 
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>

        {showSearch && searchQuery.trim().length > 1 && (
          <div className="absolute top-full mt-2 w-full max-w-md bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl max-h-[60vh] overflow-y-auto z-50 scrollbar-hide">
            {isSearching ? (
              <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
            ) : searchResults?.length > 0 ? (
              searchResults.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-4 p-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-none"
                >
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Image'}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded shadow-sm"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-white text-sm font-medium truncate">{movie.title}</div>
                    <div className="text-gray-400 text-xs mt-1">
                      {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'} • ⭐ {movie.vote_average?.toFixed(1)}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm">No movies found</div>
            )}
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="flex gap-6 items-center">
          <button className="text-sm font-medium hover:text-purple-400 transition-colors" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button
            type="button"
            className="bg-white text-black text-sm font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="flex gap-6 items-center">
          <div className="text-sm font-medium text-purple-300">{user?.username}</div>
          <button className="text-sm hover:text-purple-400 transition-colors" onClick={() => navigate("/watchList")}>Watchlist</button>
          <button className="text-sm hover:text-purple-400 transition-colors" onClick={handleSignOut}>Sign Out</button>
        </div>
      )}

    </div>
  );
};

export default Navbar;
