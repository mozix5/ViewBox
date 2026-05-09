import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiBookmark, FiLogOut, FiChevronRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const UserMenu = ({ user, onSignOut }) => {
  const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`;

  const navLinks = [
    { to: "/profile", Icon: FiUser, label: "My Profile" },
    { to: "/watchList", Icon: FiBookmark, label: "My Watchlist" },
  ];

  return (
    <div className="absolute right-0 top-[calc(100%+15px)] w-64 z-50 rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] bg-[#0a0a12]/90 backdrop-blur-3xl transition-all duration-300">
      {/* ── Top Ambient Glow ── */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-purple-600/20 to-transparent pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative px-5 pt-6 pb-4">
        <div className="flex flex-col items-center">
          {/* Avatar with cinematic ring */}
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-purple-500 via-violet-500 to-purple-800 shadow-lg shadow-purple-500/20">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover bg-[#0a0a12]"
              />
            </div>
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0a0a12]" />
          </div>

          {/* User Details */}
          <div className="text-center w-full px-2">
            <h3 className="text-white font-bold text-base truncate tracking-tight">{user?.username}</h3>
            <p className="text-gray-500 text-[11px] truncate mt-0.5 mb-2">{user?.email}</p>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
              <HiSparkles className="text-purple-400 text-[10px]" />
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-tighter">Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mx-4" />

      {/* ── Navigation ── */}
      <div className="px-3 py-3">
        {navLinks.map(({ to, Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm text-gray-400 hover:text-white transition-all duration-300 relative overflow-hidden"
          >
            {/* Hover Background Accent */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <span className="relative z-10 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
              <Icon className="text-purple-400 text-sm group-hover:rotate-12 transition-transform" />
            </span>
            <span className="relative z-10 flex-1 font-semibold tracking-tight">{label}</span>
            <FiChevronRight className="relative z-10 text-gray-700 text-xs group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mx-4" />

      {/* ── Footer / Logout ── */}
      <div className="px-3 py-3">
        <button
          onClick={onSignOut}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm text-gray-500 hover:text-red-400 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <span className="relative z-10 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300">
            <FiLogOut className="text-gray-600 group-hover:text-red-400 text-sm transition-colors" />
          </span>
          <span className="relative z-10 flex-1 font-semibold text-left tracking-tight">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
