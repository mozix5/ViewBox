import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiTwotoneStar } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Youtube from "react-youtube";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";

import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

import { fetchMovieById } from "../redux/features/movies/fetchMovieByIdSlice";
import { checkMovie } from "../redux/features/movies/checkMovieSlice";
import { addMovie } from "../redux/features/movies/addMovieSlice";
import { removeMovie } from "../redux/features/movies/removeMovieSlice";

import { setHeaders } from "../utils/constants";

const MovieDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const { fetchedMovie, loading, error } = useSelector((state) => state.fetchMovieById);
  const { user, userToken } = useSelector((state) => state.auth);
  const { isMovieInWatchList, isChecking } = useSelector(
    (state) => state.checkMovie
  );
  const { isAdding } = useSelector((state) => state.addMovie);
  const headers = setHeaders(userToken);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById({ id: id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (user?._id && id) {
      const endpoint = `${user._id}/${id}`;
      dispatch(checkMovie({ endpoint, headers }));
    }
  }, [user._id, id, dispatch]);

  const addToDb = async () => {
    if (user?._id) {
      const body = {
        movieId: id,
        userId: user._id,
        title: fetchedMovie.title,
        rating: fetchedMovie.vote_average,
        genre: fetchedMovie.genres,
        posterUrl: fetchedMovie.poster_path,
      };
      await dispatch(addMovie({ body: body, headers: headers }));
      dispatch(checkMovie({ endpoint: `${user._id}/${id}`, headers }));
    } else {
      toast.error("You need to login first");
    }
  };

  const deleteFromDb = async () => {
    if (user?._id) {
      const endpoint = `${user._id}/${id}`;
      await dispatch(removeMovie({ endpoint, headers }));
      dispatch(checkMovie({ endpoint, headers }));
    }
  };

  const trailerId =
    fetchedMovie?.videos?.results?.find((vid) => vid.name === "Official Trailer") ||
    fetchedMovie?.videos?.results[0];

  return (
    <div className="bg-gradient-to-t from-black h-screen w-screen flex items-center justify-center text-white overflow-x-hidden">
      {showModal && (
        <Modal setIsOpen={setShowModal}>
          <div className="relative">
            <Youtube
              videoId={trailerId?.key}
              className="w-[50vh] h-[50vh] md:w-[100vh] md:h-[60vh]"
              opts={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </Modal>
      )}
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
      <div className=" z-10 absolute bg-black opacity-50 top-0 left-0 right-0 bottom-0"></div>
      <div
        className="absolute top-0 left-0 bottom-0 right-0 "
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            fetchedMovie.backdrop_path || fetchedMovie.poster_path
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
            src={`https://image.tmdb.org/t/p/w500${fetchedMovie.poster_path}`}
            alt={fetchedMovie.title}
          />
        </div>
        <div className="flex-1 px-4">
          <div className="text-4xl font-bold">{fetchedMovie?.title}</div>
          <div className="flex items-center gap-4 py-3">
            <div className="flex items-center gap-3 text-3xl">
              <AiTwotoneStar className="text-yellow-400" />
              {fetchedMovie?.vote_average?.toFixed(1)}
            </div>
            <div>
              <div className="flex gap-6 text-sm">
                <div>Released: {fetchedMovie?.release_date}</div>
                <div>{fetchedMovie?.runtime} min</div>
              </div>
              <div className="flex gap-4">
                {fetchedMovie?.genres?.map((item, index) => (
                  <div className="text-sm" key={index}>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pb-3 text-sm">{fetchedMovie?.overview}</div>
          <div className="py-2 flex gap-4 items-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-transparent border-2 cursor-pointer border-white rounded-3xl px-10 py-1"
            >
              Trailer
            </button>
            {isAdding || isChecking ? (
              <LoadingSpinner />
            ) : isMovieInWatchList ? (
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
