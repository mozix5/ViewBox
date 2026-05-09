import React from "react";
import { FiSearch } from "react-icons/fi";
import SearchResultItem from "./SearchResultItem";

const SearchDropdown = ({ isSearching, searchResults, searchQuery, onResultClick, headerLabel }) => (
  <div className="bg-[#0a0a12]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
    {isSearching ? (
      <div className="p-8 flex flex-col items-center gap-3">
        <span className="w-7 h-7 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Searching…</span>
      </div>
    ) : searchResults?.length > 0 ? (
      <>
        {/* Header */}
        <div className="px-4 pt-3 pb-2.5 flex items-center justify-between border-b border-white/5">
          <span className="text-xs uppercase tracking-widest text-gray-600 font-semibold">
            {headerLabel ?? (
              <>Results for <span className="text-purple-400">"{searchQuery}"</span></>
            )}
          </span>
          <span className="text-xs text-gray-700">{searchResults.length} found</span>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-hide divide-y divide-white/[0.04]">
          {searchResults.map((movie) => (
            <SearchResultItem key={movie.id} movie={movie} onClick={onResultClick} />
          ))}
        </div>
      </>
    ) : (
      <div className="py-10 flex flex-col items-center gap-3 text-center px-6">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <FiSearch className="text-gray-600 text-xl" />
        </div>
        <p className="text-gray-500 text-sm">
          No results for <span className="text-gray-400 font-medium">"{searchQuery}"</span>
        </p>
        <p className="text-gray-700 text-xs">Try a different title or keyword</p>
      </div>
    )}
  </div>
);

export default SearchDropdown;
