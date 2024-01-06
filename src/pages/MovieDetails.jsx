import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiTwotoneStar } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useUserData } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

const MovieDetails = () => {
  const { id } = useParams();
  const [movieData, setMovieData] = useState({});
  const [trailer, setTrailer] = useState(null);
  const [flag, setFlag] = useState(false);
  const { token, user } = useUserData();
  const [isInCollection, setIsInCollection] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const key = "88c8c02e23f2f680648798958aabb276";
  const [isLoading, setIsLoading] = useState(false);
  // const userId = user?.userId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${key}&append_to_response=videos`
        );
        const data = response.data;
        setMovieData(data);
        setIsLoading(false);

        if (user) {
          checkIfShowInCollection();
          console.log("excecuted");
        }

        const trailerId = data.videos.results.find(
          (vid) => vid.name === "Official Trailer"
        );
        setTrailer(trailerId || data.videos.results[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const checkIfShowInCollection = async () => {
    try {
      const response = await axios.get(
        `https://shows-api.onrender.com/shows/${user?._id}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setIsInCollection(response.data.isShowPresent);
    } catch (error) {
      console.log(error);
    }
  };

  const addToDb = async () => {
    if (user) {
      try {
        setFlag((prevFlag) => !prevFlag);
        setIsInCollection((prevFlag) => !prevFlag);
        const data = { showId: id };

        const response = await axios.post(
          "https://shows-api.onrender.com/shows",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    } else {
      setShowToast(true);
      displayLoginNotification();
    }
  };

  const deleteFromDb = async () => {
    try {
      setIsInCollection((prevFlag) => !prevFlag);

      const response = await axios.delete(
        `https://shows-api.onrender.com/shows/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const displayLoginNotification = () => {
    toast.warn("Login First");
  };
  // console.log(user._id);
  return (
    <div className="bg-gradient-to-t from-black h-screen w-screen flex items-center justify-center text-white">

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* {showToast && displayLoginNotification()} */}
      <div className=" z-10 absolute bg-black opacity-50 top-0 left-0 right-0 bottom-0"></div>
      <div
        className="absolute top-0 left-0 bottom-0 right-0 "
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            movieData.backdrop_path || movieData.poster_path
          })`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="flex gap-6 items-center w-[90%] lg:w-[58%] z-20">
        <div>
          <img
            className="h-[360px] w-64 shadow-2xl rounded-xl object-cover"
            src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
            alt={movieData.title}
          />
        </div>
        <div className="flex-1 px-4">
          <div className="text-4xl font-bold">{movieData?.title}</div>
          <div className="flex items-center gap-4 py-3">
            <div className="flex items-center gap-3 text-3xl">
              <AiTwotoneStar className="text-yellow-400" />
              {movieData?.vote_average?.toFixed(1)}
            </div>
            <div>
              <div className="flex gap-6 text-sm">
                <div>Released: {movieData?.release_date}</div>
                <div>{movieData.runtime} min</div>
              </div>
              <div className="flex gap-4">
                {movieData?.genres?.map((item, index) => (
                  <div className="text-sm" key={index}>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pb-3 text-sm">{movieData?.overview}</div>
          <div className="py-2 flex gap-4 items-center">
            <button className="bg-transparent border-2 border-white rounded-3xl px-10 py-1">
              Trailer
            </button>
            {isInCollection ? (
              <FaHeart
                className="text-red-500 text-2xl cursor-pointer"
                onClick={deleteFromDb}
              />
            ) : (
              <FaRegHeart
                className="text-2xl cursor-pointer"
                onClick={addToDb}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
