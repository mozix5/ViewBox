import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiBookmark, FiLogOut, FiChevronRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const UserMenu = ({ user, onSignOut }) => {
  const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`;

  const navLinks = [
    { to: "/profile",   Icon: FiUser,     label: "My Profile",   badge: null },
    { to: "/watchList", Icon: FiBookmark,  label: "My Watchlist", badge: null },
  ];

  return (
    <div className="absolute right-0 top-[calc(100%+12px)] w-64 z-50 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_0_1px_rgba(139,92,246,0.15)] bg-[#0d0d1a]/95 backdrop-blur-2xl border border-white/8">

      {/* ── Header ── */}
      <div className="relative px-4 pt-5 pb-4 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center gap-3">
          {/* Avatar with ring + online dot */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-purple-500 to-violet-700">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover bg-[#0d0d1a]"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d0d1a]" />
          </div>

          {/* Name + email */}
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate leading-tight">{user?.username}</p>
            <p className="text-gray-500 text-xs truncate mt-0.5">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              <HiSparkles className="text-[9px]" />
              Member
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-2" />

      {/* ── Nav Links ── */}
      <div className="px-2 py-2">
        {navLinks.map(({ to, Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/6 transition-all duration-200"
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-purple-500/15 transition-colors">
              <Icon className="text-purple-400 text-sm" />
            </span>
            <span className="flex-1 font-medium">{label}</span>
            <FiChevronRight className="text-gray-700 text-xs group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mx-2" />

      {/* ── Sign Out ── */}
      <div className="px-2 py-2">
        <button
          onClick={onSignOut}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200"
        >
          <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-red-500/15 transition-colors">
            <FiLogOut className="text-red-400/70 group-hover:text-red-400 text-sm" />
          </span>
          <span className="flex-1 font-medium text-left">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
