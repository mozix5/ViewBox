import React, { useEffect, useState } from "react";
import { movieService } from "../services/movieService";

const SOURCE_META = {
  "Internet Movie Database": { label: "IMDb",           emoji: "⭐" },
  "Rotten Tomatoes":         { label: "Rotten Tomatoes", emoji: "🍅" },
  Metacritic:                { label: "Metacritic",      emoji: "🎯" },
};

const MovieAwards = ({ imdbId }) => {
  const [omdbData, setOmdbData] = useState(null);

  useEffect(() => {
    if (!imdbId) return;
    movieService
      .getOmdbDetails(imdbId)
      .then((d) => d?.Response === "True" ? setOmdbData(d) : null)
      .catch(() => null);
  }, [imdbId]);

  if (!omdbData) return null;

  const hasAwards = omdbData.Awards && omdbData.Awards !== "N/A";
  const ratings   = (omdbData.Ratings || []).filter((r) => SOURCE_META[r.Source]);

  if (!hasAwards && ratings.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
        {/* Awards text */}
        {hasAwards && (
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl leading-none mt-0.5">🏆</span>
            <p className="text-gray-300 text-sm leading-relaxed">{omdbData.Awards}</p>
          </div>
        )}

        {/* Ratings */}
        {ratings.length > 0 && (
          <div className="flex gap-5 sm:gap-6 shrink-0">
            {ratings.map((r) => {
              const meta = SOURCE_META[r.Source];
              return (
                <div key={r.Source} className="flex flex-col items-center gap-1">
                  <span className="text-base leading-none">{meta.emoji}</span>
                  <span className="text-white font-bold text-sm">{r.Value}</span>
                  <span className="text-gray-600 text-[10px] uppercase tracking-wider">{meta.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieAwards;
