import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/features/auth/authSlice";
import { fetchWatchList } from "../redux/features/movies/watchlistSlice";
import { ProfileSkeleton } from "../components/Skeleton";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { MdOutlineBookmarkBorder, MdLogout, MdEmail } from "react-icons/md";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { watchList } = useSelector((state) => state.watchlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWatchList({ userId: user._id, page: 1 }));
    }
  }, [user, dispatch]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) return <div className="bg-black min-h-screen"><ProfileSkeleton /></div>;

  const watchListCount = watchList[1]?.length || 0;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "Valued Member";

  return (
    <div className="bg-black min-h-screen text-white">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-700 rounded-full blur-[160px] opacity-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[140px] opacity-8" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* ── Profile Hero Card ── */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/4 backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-8 overflow-hidden shadow-2xl">
          {/* Decorative corner glow */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-purple-500 rounded-full blur-[100px] opacity-25 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-600 rounded-full blur-[80px] opacity-15 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">

            {/* Avatar with ring */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-violet-400 blur-md opacity-60 scale-110" />
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`}
                alt="User Avatar"
                className="relative w-36 h-36 rounded-full border-4 border-white/15 shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-3 text-center md:text-left">
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight">
                  {user?.username}
                </h1>
                <p className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm mt-2">
                  <MdEmail className="text-purple-400" />
                  {user?.email}
                </p>
              </div>

              <p className="text-xs text-gray-600 uppercase tracking-widest">Member since {memberSince}</p>

              {/* Stat chips */}
              <div className="flex flex-wrap gap-3 mt-1 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-2xl px-5 py-3">
                  <MdOutlineBookmarkBorder className="text-purple-400 text-xl" />
                  <div>
                    <div className="text-2xl font-bold text-white leading-none">{watchListCount}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Saved</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2 justify-center md:justify-start flex-wrap">
                <button
                  onClick={() => navigate("/watchList")}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white px-7 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30"
                >
                  <MdOutlineBookmarkBorder />
                  View Watchlist
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 bg-transparent border border-red-500/40 hover:bg-red-500/10 text-red-400 hover:text-red-300 px-7 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                >
                  <MdLogout />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Watchlist Preview ── */}
        {watchListCount > 0 && (
          <div className="bg-white/5 border border-white/8 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-white">Your Watchlist</h2>
              <button
                onClick={() => navigate("/watchList")}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                See all →
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {watchList[1].slice(0, 8).map(({ movie }) => (
                <div
                  key={movie._id}
                  onClick={() => navigate(`/movie/${movie.movieId}`)}
                  className="shrink-0 cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.posterUrl}`}
                      alt={movie.title}
                      className="w-24 h-36 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-white text-[10px] font-medium leading-tight line-clamp-2">{movie.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 justify-center">
                    <AiFillStar className="text-yellow-400 text-xs" />
                    <span className="text-gray-400 text-xs">{movie.rating?.toFixed(1)}</span>
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
