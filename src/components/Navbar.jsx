import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiBookmark, FiX, FiMenu } from "react-icons/fi";
import { searchMovies, clearSearch } from "../redux/features/movies/searchMovieSlice";
import { logout, validate } from "../redux/features/user/authSlice";

import SearchDropdown from "./navbar/SearchDropdown";
import UserMenu from "./navbar/UserMenu";
import MobileMenu from "./navbar/MobileMenu";

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

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Restore session from localStorage
  useEffect(() => {
    if (userToken) {
      try {
        const stored = localStorage.getItem("user");
        const currentUser = stored ? JSON.parse(stored) : null;
        if (currentUser) dispatch(validate(currentUser));
      } catch (e) {
        console.error("Failed to parse user from storage", e);
      }
    }
  }, [userToken, dispatch]);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const t = setTimeout(() => dispatch(searchMovies({ query: searchQuery })), 450);
      return () => clearTimeout(t);
    } else {
      dispatch(clearSearch());
    }
  }, [searchQuery, dispatch]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset on route change
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

  const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`;

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

            {/* Desktop search dropdown */}
            {showSearch && searchQuery.trim().length > 1 && (
              <div className="absolute top-[calc(100%+10px)] left-0 right-0 z-50">
                <SearchDropdown
                  isSearching={isSearching}
                  searchResults={searchResults}
                  searchQuery={searchQuery}
                  onResultClick={handleResultClick}
                />
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

                {/* User menu */}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/10 transition-all group"
                  >
                    <div className="relative">
                      <img
                        src={avatarSrc}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border-2 border-white/15 group-hover:border-purple-400/60 transition-colors"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                    </div>
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors max-w-[100px] truncate">
                      {user?.username}
                    </span>
                  </button>

                  {showUserMenu && <UserMenu user={user} onSignOut={handleSignOut} />}
                </div>
              </>
            )}
          </div>

          {/* Mobile right icons */}
          <div className="flex sm:hidden items-center gap-1 ml-auto">
            <button
              onClick={() => { setMobileSearchOpen((s) => !s); setMobileMenuOpen(false); }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileSearchOpen ? <FiX /> : <FiSearch />}
            </button>
            <button
              onClick={() => { setMobileMenuOpen((s) => !s); setMobileSearchOpen(false); }}
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

            {/* Mobile search dropdown */}
            {searchQuery.trim().length > 1 && (
              <div className="mt-2">
                <SearchDropdown
                  isSearching={isSearching}
                  searchResults={searchResults}
                  searchQuery={searchQuery}
                  onResultClick={handleResultClick}
                  headerLabel={<><span className="text-purple-400">{searchResults?.length ?? 0}</span> results</>}
                />
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <MobileMenu
            isAuthenticated={isAuthenticated}
            user={user}
            onSignOut={handleSignOut}
            onNavigate={navigate}
          />
        )}
      </nav>
    </div>
  );
};

export default Navbar;
