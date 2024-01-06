import axios from "axios";
import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Row = ({ fetchURL, title }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(fetchURL).then((res) => setData(res.data.results));
  }, []);
  const navigate=useNavigate()
  return (
    <div className="mx-16 pb-8">
      <div className="text-white text-xl capitalize mb-8 flex items-center gap-3 cursor-pointer w-fit" onClick={()=>navigate(`/${title}`)}>
        <div>{title}</div>
        <AiOutlineDoubleRight />
      </div>
      <div className=" whitespace-nowrap scroll-smooth scrollbar-hide break-words overflow-x-scroll snap-x snap-mandatory">
        {data.map((item) => {
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
    </div>
  );
};

export default Row;
