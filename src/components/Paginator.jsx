import React from "react";
import { useNavigate } from "react-router-dom";

const Paginator = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const currentPage = parseInt(params.get("page")) || 1;

  const handlePageChange = (pageNo) => {
    params.set("page", pageNo);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, "", newUrl);
    navigate(0);
  };
  return (
    <div>
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
      >
        Previous
      </button>
      <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
    </div>
  );
};

export default Paginator;
