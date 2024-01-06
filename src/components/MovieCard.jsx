import React from "react";
import { AiTwotoneStar } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const MovieCard = ({ image, rating, id, genre }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${id}/${genre}`);
  };
  return (
    <div className="h-80 w-56 relative" onClick={handleClick}>
      <img
        className="h-full w-full rounded-xl object-cover"
        src={`https://image.tmdb.org/t/p/w500${image}`}
      />
      <div className="h-full w-full absolute top-0 left-0 right-0 hover:bg-black/40 opacity-0 hover:opacity-100 text-white px-5 py-3 rounded-xl transition-opacity ease-in-out duration-300">
        <div className="flex items-center justify-end gap-3">
          <AiTwotoneStar className=" text-yellow-400 text-lg" />
          <div className=" font-semibold"> {rating}</div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
