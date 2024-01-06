import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const ShowsList = () => {
  const params = useParams();
  const key = "88c8c02e23f2f680648798958aabb276";
  const [pageNum, setPageNum] = useState(1);
  const [movies, setMovies] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${params.genre}?api_key=${key}&language=en-US&page=${pageNum}`
      );
      const data = response.data.results;
      setMovies((prev) => [...prev, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(movies);
    console.log(pageNum);
  }, [pageNum]);

  return (
    <div className="min-h-screen  bg-black pt-24 px-16 text-white">
      <div className=" grid grid-cols-5 gap-6 place-items-center border-red-600">
        {movies.map((item, index) => {
          return (
            <MovieCard
              key={item.id}
              image={item.poster_path}
              rating={item.vote_average}
              id={item.id}
              // genre={title}
            />
          );
        })}
      </div>
      <div className=" flex justify-center p-6">
        <button onClick={() => setPageNum((prev) => prev + 1)}>Load More</button>
      </div>
    </div>
  );
};

export default ShowsList;
