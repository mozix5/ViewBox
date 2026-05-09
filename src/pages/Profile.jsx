import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/features/user/authSlice";
import { fetchWatchList } from "../redux/features/user/watchlistSlice";
import { ProfileSkeleton } from "../components/Skeleton";
import { AiFillStar } from "react-icons/ai";
import { FiBookmark, FiLogOut, FiSettings, FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { watchList } = useSelector((state) => state.watchlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?._id) dispatch(fetchWatchList({ userId: user._id, page: 1 }));
  }, [user, dispatch]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) return <div className="bg-[#050505] min-h-screen"><ProfileSkeleton /></div>;

  const watchListCount = watchList[1]?.length || 0;
  const recentMovie = watchListCount > 0 ? watchList[1][0].movie : null;
  
  // Create a cinematic backdrop from the user's most recently saved movie
  const backdropImage = recentMovie?.posterUrl 
    ? `https://image.tmdb.org/t/p/w500${recentMovie.posterUrl}` 
    : null;

  const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`;

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-hidden relative">
      
      {/* ── Cinematic Backdrop ── */}
      <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none">
        {backdropImage ? (
          <>
            <img 
              src={backdropImage} 
              alt="Backdrop" 
              className="w-full h-full object-cover opacity-30 blur-2xl transform scale-110"
            />
            {/* Gradient masks to fade the image perfectly into the dark background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/10 via-[#050505]/60 to-[#050505]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-violet-900/10" />
        )}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24">
        
        {/* ── Profile Header ── */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16">
          
          {/* Avatar */}
          <div className="relative shrink-0 group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-b from-purple-500 to-transparent shadow-[0_0_60px_rgba(139,92,246,0.3)]">
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-full h-full rounded-full object-cover bg-black"
              />
            </div>
            <span className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-4 h-4 bg-emerald-400 rounded-full border-[3px] border-[#050505]" />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md mb-3">
              <HiSparkles className="text-purple-400 text-sm" />
              <span className="text-xs font-semibold tracking-wider uppercase text-purple-200">Premium Member</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl mb-1">
              {user?.username}
            </h1>
            <p className="text-gray-400 text-sm md:text-base mb-6">
              {user?.email}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button
                onClick={() => navigate("/watchList")}
                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95"
              >
                <FiBookmark className="text-lg" />
                Watchlist
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
              >
                <FiLogOut className="text-lg" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats Glass Panel */}
          <div className="hidden lg:flex gap-8 bg-white/5 backdrop-blur-2xl px-8 py-6 rounded-3xl shadow-2xl">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-white">{watchListCount}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Saved</span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-4xl font-black text-white">0</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Reviews</span>
            </div>
          </div>
        </div>

        {/* Mobile Stats (Only visible on small screens) */}
        <div className="flex lg:hidden justify-center gap-8 mb-12">
           <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">{watchListCount}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Saved</span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">0</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Reviews</span>
            </div>
        </div>

        {/* ── Watchlist Showcase ── */}
        {watchListCount > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                Recently Saved
                <span className="text-sm font-normal text-gray-500 bg-white/10 px-3 py-1 rounded-full">{watchListCount}</span>
              </h2>
              <button
                onClick={() => navigate("/watchList")}
                className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                View all
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
              {watchList[1].slice(0, 6).map(({ movie }) => (
                <div
                  key={movie._id}
                  onClick={() => navigate(`/movie/${movie.movieId}`)}
                  className="group cursor-pointer relative"
                >
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#111] transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                    <img
                      src={`https://image.tmdb.org/t/p/w342${movie.posterUrl}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p className="text-white text-sm font-bold leading-tight line-clamp-2 mb-1">
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <AiFillStar className="text-yellow-400 text-xs" />
                        <span className="text-gray-300 text-xs font-semibold">{movie.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
