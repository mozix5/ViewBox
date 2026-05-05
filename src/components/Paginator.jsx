import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Paginator = ({ onPageChange }) => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const currentPage = parseInt(params.get("page")) || 1;

  const handlePageChange = (pageNo) => {
    if (pageNo < 1) return;
    params.set("page", pageNo);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, "", newUrl);
    navigate(0);
  };

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = start + 4;
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 py-10">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-purple-500/50"
      >
        <FiChevronLeft />
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
            p === currentPage
              ? "bg-gradient-to-br from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-500/40 scale-110"
              : "border border-white/10 bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white hover:border-purple-500/50"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white transition-all hover:border-purple-500/50"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Paginator;
