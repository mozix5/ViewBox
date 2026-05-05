import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/features/auth/authSlice";
import { fetchWatchList } from "../redux/features/movies/fetchWatchListSlice";
import { setHeaders } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
  const { user, userToken, isAuthenticated } = useSelector((state) => state.auth);
  const { watchList } = useSelector((state) => state.fetchWatchList);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?._id) {
      const headers = setHeaders(userToken);
      dispatch(fetchWatchList({ endpoint: `${user._id}`, headers, key: 1 }));
    }
  }, [user, dispatch, userToken]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="bg-black min-h-screen text-white pt-24 px-8 flex justify-center">
      <div className="max-w-4xl w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
          
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}&backgroundColor=c0aede`}
            alt="User Avatar"
            className="w-40 h-40 rounded-full bg-white/5 border-4 border-white/10 shadow-xl"
          />
          
          <div className="flex-1 flex flex-col gap-4 text-center md:text-left z-10">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
                {user?.username}
              </h1>
              <p className="text-gray-400 mt-1">{user?.email}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
              <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-center">
                <div className="text-3xl font-bold text-white">
                  {watchList[1] ? watchList[1].length : 0}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Watchlist Items</div>
              </div>
            </div>

            <div className="mt-4 flex gap-4 justify-center md:justify-start">
               <button 
                 onClick={() => navigate('/watchList')}
                 className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-full font-semibold transition-colors shadow-lg shadow-purple-500/30"
               >
                 View Watchlist
               </button>
               <button 
                 onClick={handleSignOut}
                 className="bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-400 px-8 py-2 rounded-full font-semibold transition-colors"
               >
                 Sign Out
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
