import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiBookmark, FiUser, FiLogOut, FiX, FiMenu } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { searchMovies, clearSearch } from "../redux/features/movies/searchMovieSlice";
import { logout, validate } from "../redux/features/user/authSlice";

const Navbar = () => {
  const { user, isAuthenticated, userToken } = useSelector((state) => state.auth);
  const { searchResults, isSearching } = useSelector((state) => state.searchMovies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (userToken) {
      try {
        const storedUser = localStorage.getItem("user");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        if (currentUser) dispatch(validate(currentUser));
      } catch (e) {
        console.error("Failed to parse user from storage", e);
      }
    }
  }, [userToken, dispatch]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const t = setTimeout(() => dispatch(searchMovies({ query: searchQuery })), 450);
      return () => clearTimeout(t);
    } else {
      dispatch(clearSearch());
    }
  }, [searchQuery, dispatch]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setShowSearch(false);
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  const handleResultClick = () => {
    setSearchQuery("");
    setShowSearch(false);
    setMobileSearchOpen(false);
  };

  const handleSignOut = () => {
    dispatch(logout());
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-[200] flex flex-col transition-all duration-500 ${scrolled ? "px-3 sm:px-6 pt-3 sm:pt-4" : "px-0 pt-0"}`}>
      <nav
        className={`w-full transition-all duration-500 ${
          scrolled
            ? "max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-white/8 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)] ring-1 ring-black/20"
            : "max-w-none rounded-none bg-gradient-to-b from-black/60 to-transparent border-transparent"
        }`}
      >
        {/* ── Main bar ── */}
        <div
          className={`flex items-center gap-3 sm:gap-6 transition-all duration-500 ${scrolled ? "px-4 sm:px-5" : "px-4 sm:px-6"}`}
          style={{ height: scrolled ? "52px" : "64px" }}
        >
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="shrink-0 text-xl sm:text-2xl font-black tracking-tight uppercase select-none"
            style={{
              background: "linear-gradient(120deg, #fff 20%, hsl(270, 60%, 70%) 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ViewBox
          </button>

          {/* Desktop Search */}
          <div ref={searchRef} className="hidden sm:flex flex-1 justify-center max-w-xl mx-auto relative">
            <div
              className={`flex items-center gap-3 w-full rounded-full px-4 py-2 transition-all duration-300 ${
                showSearch
                  ? "bg-white/12 ring-2 ring-purple-500/60 shadow-lg shadow-purple-500/10"
                  : "bg-white/8 hover:bg-white/12"
              }`}
            >
              {isSearching ? (
                <span className="w-4 h-4 border-2 border-gray-500 border-t-purple-400 rounded-full animate-spin shrink-0" />
              ) : (
                <FiSearch className="text-gray-400 shrink-0 text-base" />
              )}
              <input
                type="text"
                placeholder="Search movies & shows…"
                className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-500 hover:text-white transition-colors">
                  <FiX className="text-base" />
                </button>
              )}
            </div>

            {/* Desktop Search Dropdown */}
            {showSearch && searchQuery.trim().length > 1 && (
              <div className="absolute top-[calc(100%+10px)] left-0 right-0 bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto scrollbar-hide">
                {isSearching ? (
                  <div className="p-6 flex flex-col items-center gap-3 text-gray-500">
                    <span className="w-6 h-6 border-2 border-gray-700 border-t-purple-400 rounded-full animate-spin" />
                    <span className="text-sm">Searching…</span>
                  </div>
                ) : searchResults?.length > 0 ? (
                  <>
                    <div className="px-4 pt-3 pb-2 text-xs uppercase tracking-widest text-gray-600 font-semibold border-b border-white/5">
                      Results for "{searchQuery}"
                    </div>
                    {searchResults.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-white/6 transition-colors border-b border-white/4 last:border-none group"
                      >
                        <div className="relative shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : "https://placehold.co/46x68/1a1a2e/666?text=?"}
                            alt={movie.title}
                            className="w-10 h-[60px] object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors">{movie.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                            <span>{movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</span>
                            {movie.vote_average > 0 && (
                              <>
                                <span>·</span>
                                <AiFillStar className="text-yellow-500 text-[10px]" />
                                <span>{movie.vote_average?.toFixed(1)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-700 text-xs group-hover:text-purple-400 transition-colors">→</span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <div className="p-8 text-center text-gray-600 text-sm">
                    No results for "<span className="text-gray-400">{searchQuery}</span>"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side — desktop */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 sm:px-4 py-2"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-sm font-bold bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white px-4 sm:px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/watchList")}
                  title="Watchlist"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <FiBookmark className="text-base" />
                </button>

                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/10 transition-all group"
                  >
                    <div className="relative">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border-2 border-white/15 group-hover:border-purple-400/60 transition-colors"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                    </div>
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors max-w-[100px] truncate">
                      {user?.username}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-52 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/8 flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full border border-white/15"
                        />
                        <div className="overflow-hidden">
                          <p className="text-white text-sm font-semibold truncate">{user?.username}</p>
                          <p className="text-gray-600 text-xs truncate">{user?.email}</p>
                        </div>
                      </div>
                      <div className="py-1.5">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/6 transition-colors">
                          <FiUser className="text-purple-400" /> My Profile
                        </Link>
                        <Link to="/watchList" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/6 transition-colors">
                          <FiBookmark className="text-purple-400" /> My Watchlist
                        </Link>
                      </div>
                      <div className="border-t border-white/8 py-1.5">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/8 transition-colors"
                        >
                          <FiLogOut /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile right icons */}
          <div className="flex sm:hidden items-center gap-1 ml-auto">
            <button
              onClick={() => { setMobileSearchOpen(s => !s); setMobileMenuOpen(false); }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileSearchOpen ? <FiX /> : <FiSearch />}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(s => !s); setMobileSearchOpen(false); }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-4 pb-3" ref={searchRef}>
            <div className="flex items-center gap-3 w-full rounded-full px-4 py-2 bg-white/10 ring-2 ring-purple-500/60">
              {isSearching ? (
                <span className="w-4 h-4 border-2 border-gray-500 border-t-purple-400 rounded-full animate-spin shrink-0" />
              ) : (
                <FiSearch className="text-gray-400 shrink-0" />
              )}
              <input
                autoFocus
                type="text"
                placeholder="Search movies & shows…"
                className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-500 hover:text-white">
                  <FiX />
                </button>
              )}
            </div>
            {searchQuery.trim().length > 1 && (
              <div className="mt-2 bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto scrollbar-hide">
                {isSearching ? (
                  <div className="p-6 flex flex-col items-center gap-3 text-gray-500">
                    <span className="w-6 h-6 border-2 border-gray-700 border-t-purple-400 rounded-full animate-spin" />
                    <span className="text-sm">Searching…</span>
                  </div>
                ) : searchResults?.length > 0 ? (
                  searchResults.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/movie/${movie.id}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/6 transition-colors border-b border-white/4 last:border-none"
                    >
                      <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : "https://placehold.co/46x68/1a1a2e/666?text=?"}
                        alt={movie.title}
                        className="w-9 h-[54px] object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                        <p className="text-gray-500 text-xs">{movie.release_date?.split("-")[0]}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-600 text-sm">No results found</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pb-4 border-t border-white/10 mt-1">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-3">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-sm font-medium text-gray-300 hover:text-white py-2.5 border border-white/10 rounded-xl transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full text-sm font-bold bg-gradient-to-r from-purple-600 to-violet-500 text-white py-2.5 rounded-xl"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="pt-3">
                <div className="flex items-center gap-3 mb-4 px-1">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-purple-500/40"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{user?.username}</p>
                    <p className="text-gray-500 text-xs">{user?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/6 rounded-xl transition-colors">
                    <FiUser className="text-purple-400" /> My Profile
                  </Link>
                  <Link to="/watchList" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/6 rounded-xl transition-colors">
                    <FiBookmark className="text-purple-400" /> My Watchlist
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/8 rounded-xl transition-colors"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
