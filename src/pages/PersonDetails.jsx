import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../services/movieService";
import { FiArrowLeft } from "react-icons/fi";
import { AiTwotoneStar } from "react-icons/ai";

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedBio, setExpandedBio] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    setLoading(true);
    movieService
      .getPersonDetails(id)
      .then(setPerson)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center text-white">
        <p className="text-gray-400">Person not found.</p>
      </div>
    );
  }

  const movies = person.combined_credits?.cast
    ?.filter((m) => m.poster_path)
    ?.sort((a, b) => b.popularity - a.popularity)
    ?.slice(0, 24) || [];

  const totalCredits = person.combined_credits?.cast?.length || 0;
  const bio = person.biography || "";
  const isLongBio = bio.length > 500;
  const displayBio = expandedBio ? bio : bio.slice(0, 500);

  const age = person.birthday
    ? Math.floor((new Date() - new Date(person.birthday)) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden pt-24">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* ── Left Column: Photo & Quick Facts ── */}
          <div className="w-full md:w-72 shrink-0 flex flex-col items-center md:items-start">
            {/* Portrait */}
            <div className="w-48 sm:w-56 md:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-white/5 mb-8">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl font-bold text-gray-700">
                  {person.name?.charAt(0)}
                </div>
              )}
            </div>

            {/* Personal Info */}
            <div className="w-full">
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Personal Info</h3>
              <div className="flex flex-col gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-0.5">Known For</span>
                  <span className="text-white font-medium">{person.known_for_department}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Gender</span>
                  <span className="text-white font-medium">
                    {person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "-"}
                  </span>
                </div>
                {person.birthday && (
                  <div>
                    <span className="text-gray-500 block mb-0.5">Born</span>
                    <span className="text-white font-medium">
                      {person.birthday} {age ? `(Age ${age})` : ""}
                    </span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div>
                    <span className="text-gray-500 block mb-0.5">Place of Birth</span>
                    <span className="text-white font-medium">{person.place_of_birth}</span>
                  </div>
                )}
                {totalCredits > 0 && (
                  <div>
                    <span className="text-gray-500 block mb-0.5">Total Credits</span>
                    <span className="text-white font-medium">{totalCredits}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column: Bio & Movies ── */}
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl sm:text-5xl font-black mb-8 text-center md:text-left">
              {person.name}
            </h1>

            {/* Biography */}
            {bio && (
              <div className="mb-14">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-violet-600 shrink-0" />
                  Biography
                </h2>
                <div className="text-gray-300 leading-relaxed text-[15px] whitespace-pre-line">
                  {displayBio}
                  {!expandedBio && isLongBio && "..."}
                </div>
                {isLongBio && (
                  <button
                    onClick={() => setExpandedBio(!expandedBio)}
                    className="mt-4 text-purple-400 hover:text-purple-300 font-semibold text-sm"
                  >
                    {expandedBio ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            )}

            {/* Filmography Grid */}
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-violet-600 shrink-0" />
                Known For
              </h2>
              {movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} navigate={navigate} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No movies found.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple, clean movie card
const MovieCard = ({ movie, navigate }) => (
  <div
    onClick={() => navigate(`/${movie.media_type === "tv" ? "tv" : "popular"}/${movie.id}`)}
    className="group relative cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] bg-white/5"
  >
    <div className="aspect-[2/3] w-full bg-gray-900">
      <img
        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
        alt={movie.title || movie.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    
    {/* Clean gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
      <p className="text-sm font-bold text-white line-clamp-2 leading-tight">
        {movie.title || movie.name}
      </p>
      {movie.character && (
        <p className="text-xs text-gray-300 mt-1 truncate">
          as {movie.character}
        </p>
      )}
      {movie.vote_average > 0 && (
        <div className="flex items-center gap-1 mt-2">
          <AiTwotoneStar className="text-yellow-400 text-xs" />
          <span className="text-[10px] font-bold text-white">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default PersonDetails;
