import axios from "axios";
import React, { useEffect, useState } from "react";
import { requests } from "../assets/requests";
import { BsPlayCircle } from "react-icons/bs";
const Hero = () => {
  const [data, setData] = useState([]);
  const movie = data[Math.floor(Math.random() * data.length)];
  useEffect(() => {
    axios
      .get(requests.requestNowPlaying)
      .then((res) => setData(res.data.results));
  }, []);
  console.log(data[0]);
  return (
    <div className=" h-[80vh] text-white relative">
      <div className="z-10 h-[80vh] w-screen bg-gradient-to-t from-[#000000] absolute">
        {" "}
      </div>
      <img
        className="h-[80vh] w-screen object-cover z-0 opacity-50"
        src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
      ></img>
      <div className="absolute top-[30%] w-[35%] left-16 z-20">
        <div className=" text-4xl font-extrabold text-[#999999]">
          {movie?.original_title}
        </div>
        
        <div className="my-6">{movie?.overview}</div>
        <div>
          <BsPlayCircle className=" text-7xl cursor-pointer hover:text-[#3E065F]"/>
        </div>
      </div>
    </div>
  );
};

export default Hero;
