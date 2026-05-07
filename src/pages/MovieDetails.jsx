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
import { MovieDetailsSkeleton } from "../components/Skeleton";
import ReviewSection from "../components/ReviewSection";


import { fetchMovieById } from "../redux/features/movies/fetchMovieByIdSlice";
import { 
  checkWatchlist, 
  addToWatchlist, 
  removeFromWatchlist 
} from "../redux/features/user/watchlistSlice";

const MovieDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const { fetchedMovie, loading, error } = useSelector((state) => state.fetchMovieById);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const inWatchlist = useSelector((state) => state.watchlist.inWatchlist[id]);
  const isUpdating = useSelector((state) => state.watchlist.isUpdating[id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById({ id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (user?._id && id) {
      dispatch(checkWatchlist({ userId: user._id, movieId: id }));
    }
  }, [user?._id, id, dispatch]);

  const addToDb = async () => {
    if (!isAuthenticated) {
      toast.error("You need to login first");
      return;
    }
    
    const body = {
      movieId: id,
      userId: user._id,
      title: fetchedMovie.title,
      rating: fetchedMovie.vote_average,
      genre: fetchedMovie.genres || [],
      posterUrl: fetchedMovie.poster_path,
    };
    await dispatch(addToWatchlist({ body }));
  };

  const deleteFromDb = async () => {
    if (user?._id) {
      await dispatch(removeFromWatchlist({ userId: user._id, movieId: id }));
    }
  };

  const trailerId =
    fetchedMovie?.videos?.results?.find((vid) => vid.name === "Official Trailer") ||
    fetchedMovie?.videos?.results?.[0];

  if (loading || !fetchedMovie || Object.keys(fetchedMovie).length === 0) return <MovieDetailsSkeleton />;

  if (error) return <div className="h-screen w-screen flex items-center justify-center text-white bg-black">Error: {error}</div>;

  return (

    <div className="bg-gradient-to-t from-black min-h-screen w-screen flex flex-col items-center text-white overflow-x-hidden bg-black">
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
      
      <div className="relative w-full min-h-screen flex items-end sm:items-center justify-center shrink-0 pb-8 sm:pb-0">
        <div className=" z-10 absolute bg-black opacity-50 top-0 left-0 right-0 bottom-0"></div>
        <div
          className="absolute top-0 left-0 bottom-0 right-0 bg-black"
          style={{
            backgroundImage: fetchedMovie?.backdrop_path || fetchedMovie?.poster_path ? `url(https://image.tmdb.org/t/p/w300${
              fetchedMovie.backdrop_path || fetchedMovie.poster_path
            })` : 'none',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "blur(20px)",
          }}
        ></div>
        <div
          className="absolute top-0 left-0 bottom-0 right-0 transition-opacity duration-1000"
          style={{
            backgroundImage: fetchedMovie?.backdrop_path || fetchedMovie?.poster_path ? `url(https://image.tmdb.org/t/p/w1280${
              fetchedMovie.backdrop_path || fetchedMovie.poster_path
            })` : 'none',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start w-[92%] lg:w-[60%] z-20 pt-24 sm:pt-0">
          <div className="shrink-0">
            <img
              className="h-56 w-40 sm:h-[360px] sm:w-64 shadow-2xl rounded-xl object-cover"
              src={fetchedMovie?.poster_path ? `https://image.tmdb.org/t/p/w500${fetchedMovie.poster_path}` : ""}
              alt={fetchedMovie?.title || "Movie Poster"}
              loading="lazy"
            />
          </div>
          <div className="flex-1 px-2 sm:px-4 text-center sm:text-left">
            <div className="text-2xl sm:text-4xl font-bold">{fetchedMovie?.title}</div>
            <div className="flex items-center gap-4 py-2 sm:py-3 justify-center sm:justify-start">
              <div className="flex items-center gap-3 text-2xl sm:text-3xl">
                <AiTwotoneStar className="text-yellow-400" />
                {fetchedMovie?.vote_average?.toFixed(1)}
              </div>
              <div>
                <div className="flex gap-3 sm:gap-6 text-sm flex-wrap justify-center sm:justify-start">
                  <div>Released: {fetchedMovie?.release_date}</div>
                  <div>{fetchedMovie?.runtime} min</div>
                </div>
                <div className="flex gap-2 sm:gap-4 flex-wrap justify-center sm:justify-start">
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
              {isUpdating ? (
                <LoadingSpinner />
              ) : inWatchlist ? (
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
      <ReviewSection movieId={id} />
    </div>
  );
};

export default MovieDetails;
