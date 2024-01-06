import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUserData } from "../context/UserContext";
import MovieCard from "../components/MovieCard";

const MyShows = () => {
  const { token, user } = useUserData();
  const [shows, setShows] = useState([]);
  const [showsFromAPI, setShowsFromAPI] = useState([]);
  const key = "88c8c02e23f2f680648798958aabb276";

  useEffect(() => {
    // console.log(user);
    // console.log(token);
    getUserShows();
  }, []);

  const getUserShows = async () => {
    try {
      const response = await axios.get("https://shows-api.onrender.com/shows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: user._id,
        },
      });
      setShows(response.data);
      // console.log(shows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    shows.forEach((item) => {
      getShowsFromAPI(item.showId);
    });
  }, [shows]);

  const getShowsFromAPI = async (showId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${showId}?api_key=${key}`
      );
      setShowsFromAPI((prev) => [...prev, response.data]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" bg-black pt-20 pb-6 text-white min-h-screen px-16">
      <div className=" flex gap-8 flex-wrap justify-start">
      {showsFromAPI.map((item, index) => (
        <MovieCard
          key={item.id}
          image={item.poster_path}
          rating={item.vote_average}
          id={item.id}
        />
      ))}
      </div>
    </div>
  );
};

export default MyShows;
