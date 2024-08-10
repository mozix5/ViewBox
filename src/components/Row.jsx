import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDoubleRight } from "react-icons/ai";

import MovieCard from "./MovieCard";
import Loader from "./Loader";

import { fetchMovies } from "../redux/features/movies/fetchMoviesSlice";

const Row = ({ fetchURL, title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchedMovies, isFetching, error } = useSelector((state) => state.fetchMovies);

  useEffect(() => {
    dispatch(fetchMovies({ fetchUrl: fetchURL, key: title }));
  }, []);

  return (
    <div className="mx-16 pb-8">
      <div
        className="text-white text-xl capitalize mb-8 flex items-center gap-3 cursor-pointer w-fit"
        onClick={() => navigate(`/${title}`)}
      >
        <div>{title}</div>
        <AiOutlineDoubleRight />
      </div>
      {isFetching[title] ? (
        <Loader />
      ) : (
        <div className=" whitespace-nowrap scroll-smooth scrollbar-hide break-words overflow-x-scroll snap-x snap-mandatory">
          {fetchedMovies[title]?.map((item) => {
            return (
              <div className="last-of-type:mr-0 mr-[33px]   rounded-xl inline-block relative cursor-pointer snap-start shadow-[#3E065F] shadow-lg">
                <MovieCard
                  key={item.id}
                  image={item.poster_path}
                  rating={item.vote_average}
                  id={item.id}
                  genre={title}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Row;
