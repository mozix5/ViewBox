import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiBookmark, FiLogOut } from "react-icons/fi";

const MobileMenu = ({ isAuthenticated, user, onSignOut, onNavigate }) => {
  const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`;

  return (
    <div className="sm:hidden px-4 pb-4 border-t border-white/10 mt-1">
      {!isAuthenticated ? (
        <div className="flex flex-col gap-2 pt-3">
          <button
            onClick={() => onNavigate("/login")}
            className="w-full text-sm font-medium text-gray-300 hover:text-white py-2.5 border border-white/10 rounded-xl transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => onNavigate("/signup")}
            className="w-full text-sm font-bold bg-gradient-to-r from-purple-600 to-violet-500 text-white py-2.5 rounded-xl"
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="pt-3">
          {/* User info */}
          <div className="flex items-center gap-3 mb-4 px-1">
            <img src={avatarSrc} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-purple-500/40" />
            <div>
              <p className="text-white font-semibold text-sm">{user?.username}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-1">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/6 rounded-xl transition-colors"
            >
              <FiUser className="text-purple-400" /> My Profile
            </Link>
            <Link
              to="/watchList"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/6 rounded-xl transition-colors"
            >
              <FiBookmark className="text-purple-400" /> My Watchlist
            </Link>
            <button
              onClick={onSignOut}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/8 rounded-xl transition-colors"
            >
              <FiLogOut /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
