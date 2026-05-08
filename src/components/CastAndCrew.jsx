import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CastAndCrew = ({ credits }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  if (!credits || (!credits.cast?.length && !credits.crew?.length)) return null;

  // Show top cast
  const topCast = credits.cast?.slice(0, 15) || [];
  
  // Find director
  const director = credits.crew?.find((member) => member.job === "Director");

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-black text-white relative z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-violet-600 shrink-0" />
          <h3 className="text-xl sm:text-2xl font-bold">Cast & Crew</h3>
        </div>

        {director && (
          <div className="mb-6">
            <span className="text-sm text-purple-400 font-semibold uppercase tracking-wider">Directed By</span>
            <div className="text-lg font-medium mt-1">{director.name}</div>
          </div>
        )}

        {topCast.length > 0 && (
          <div className="relative group/slider">
            {/* Left arrow */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 w-10 h-10 rounded-full bg-black/70 backdrop-blur border border-white/10 text-white hidden sm:flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-purple-600/80 shadow-xl"
            >
              <FiChevronLeft className="text-lg" />
            </button>

            {/* Scroll Container */}
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide py-4 snap-x"
            >
              {topCast.map((actor) => (
                <div 
                  key={actor.cast_id} 
                  onClick={() => navigate(`/person/${actor.id}`)}
                  className="flex flex-col items-center gap-2 shrink-0 snap-start w-24 sm:w-28 cursor-pointer group/actor"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-lg bg-gray-900 shrink-0 group-hover/actor:border-purple-400/60 transition-all duration-300">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover group-hover/actor:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 bg-white/5">
                        <span className="text-xl font-bold">{actor.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full">
                    <div className="text-sm font-bold truncate w-full group-hover/actor:text-purple-300 transition-colors" title={actor.name}>{actor.name}</div>
                    <div className="text-xs text-gray-400 truncate w-full" title={actor.character}>{actor.character}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 w-10 h-10 rounded-full bg-black/70 backdrop-blur border border-white/10 text-white hidden sm:flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-purple-600/80 shadow-xl"
            >
              <FiChevronRight className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CastAndCrew;
