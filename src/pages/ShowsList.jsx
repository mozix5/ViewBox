import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MovieCard from "../components/MovieCard";
import { MovieCardSkeleton } from "../components/Skeleton";
import Paginator from "../components/Paginator";
import { fetchMovies } from "../redux/features/movies/fetchMoviesSlice";
import { FiFilter, FiChevronDown, FiX } from "react-icons/fi";

const SECTION_LABELS = {
  upcoming: "Coming Soon",
  popular: "Popular Right Now",
  trending: "Trending Today",
  top_rated: "Top Rated",
  horror: "Horror",
};

const GENRES = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" }, { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" }, { id: 27, name: "Horror" }, { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" }, { id: 10749, name: "Romance" },
];

const LANGUAGES = [
  { id: "en", name: "English" }, { id: "hi", name: "Hindi" }, { id: "es", name: "Spanish" },
  { id: "fr", name: "French" }, { id: "ja", name: "Japanese" }, { id: "ko", name: "Korean" },
];

const YEARS = Array.from({ length: 35 }, (_, i) => 2024 - i);

const ShowsList = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { fetchedMovies, isFetching, totalPages } = useSelector((state) => state.fetchMovies);

  const searchParams = new URLSearchParams(window.location.search);
  const pageNum = parseInt(searchParams.get("page")) || 1;
  const totalPageCount = totalPages[pageNum] || 1;

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLang, setSelectedLang] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const filters = {
      genre: selectedGenre,
      year: selectedYear,
      language: selectedLang,
    };
    
    // If any filter is active, use 'discover' logic, otherwise use category
    const isFiltered = selectedGenre || selectedYear || selectedLang;
    
    dispatch(fetchMovies({ 
      page: pageNum, 
      category: isFiltered ? null : params.genre, 
      filters: isFiltered ? filters : null,
      key: pageNum 
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, pageNum, params.genre, selectedGenre, selectedYear, selectedLang]);

  const label = SECTION_LABELS[params.genre] || params.genre;

  const clearFilters = () => {
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedLang("");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700 rounded-full blur-[160px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-8 pt-28 pb-4">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── Sidebar Filters ── */}
          <div className={`lg:w-64 shrink-0 transition-all ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-28 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <FiFilter className="text-purple-400" />
                  <span>Filters</span>
                </div>
                {(selectedGenre || selectedYear || selectedLang) && (
                  <button onClick={clearFilters} className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
                    <FiX /> Reset
                  </button>
                )}
              </div>

              {/* Genre Filter */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGenre(selectedGenre === g.id ? "" : g.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        selectedGenre === g.id 
                          ? "bg-purple-600 border-purple-500 text-white" 
                          : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Release Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Years</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Language Filter */}
              <div className="mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Language</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLang(selectedLang === l.id ? "" : l.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        selectedLang === l.id 
                          ? "bg-purple-600 border-purple-500 text-white" 
                          : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-purple-400 to-violet-600 shrink-0" />
                <div>
                  <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold mb-1">Browse</p>
                  <h1 className="text-4xl font-extrabold capitalize leading-none">{label}</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-semibold"
                >
                  <FiFilter /> Filters
                </button>
                <div className="text-sm text-gray-600">
                  Page {pageNum} of {totalPageCount}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 place-items-center mb-4">
              {isFetching[pageNum] || !fetchedMovies[pageNum]
                ? [...Array(15)].map((_, i) => <MovieCardSkeleton key={i} />)
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

            {fetchedMovies[pageNum]?.length === 0 && !isFetching[pageNum] && (
              <div className="py-20 text-center">
                <p className="text-gray-500 text-lg">No movies found with these filters.</p>
                <button onClick={clearFilters} className="mt-4 text-purple-400 font-bold hover:underline">Clear all filters</button>
              </div>
            )}

            <Paginator totalPages={totalPageCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowsList;
