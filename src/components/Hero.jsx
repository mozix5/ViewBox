import axios from "axios";
import React, { useEffect, useState } from "react";
import { requests } from "../assets/requests";
import { BsPlayCircle } from "react-icons/bs";
import { HeroSkeleton } from "./Skeleton";

const Hero = () => {
  const [data, setData] = useState([]);
  const movie = data[Math.floor(Math.random() * data.length)];

  useEffect(() => {
    axios
      .get(requests.requestNowPlaying)
      .then((res) => setData(res.data.results));
  }, []);

  if (!movie) return <HeroSkeleton />;

  return (
    <div className=" h-[80vh] text-white relative bg-black">
      <div className="z-10 h-[80vh] w-screen bg-gradient-to-t from-[#000000] absolute">
        {" "}
      </div>
      <div
        className="absolute inset-0 z-0 bg-black"
        style={{
          backgroundImage: movie?.backdrop_path ? `url(https://image.tmdb.org/t/p/w300${movie.backdrop_path})` : 'none',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          filter: "blur(20px)",
          opacity: 0.3,
        }}
      ></div>
      <div
        className="absolute inset-0 z-0 transition-opacity duration-1000 opacity-50"
        style={{
          backgroundImage: movie?.backdrop_path ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` : 'none',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
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
