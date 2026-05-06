import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requests } from "../assets/requests";
import { AiFillStar } from "react-icons/ai";
import { BsPlayCircleFill, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { HeroSkeleton } from "./Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { 
  checkWatchlist, 
  addToWatchlist, 
  removeFromWatchlist 
} from "../redux/features/movies/watchlistSlice";
import { toast } from "react-toastify";

const Hero = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const movie = data[index];
  const isMovieInWatchList = useSelector((state) => state.watchlist.inWatchlist[movie?.id]);

  useEffect(() => {
    axios.get(requests.requestNowPlaying).then((res) => {
      setData(res.data.results);
      setIndex(Math.floor(Math.random() * res.data.results.length));
    });
  }, []);

  useEffect(() => {
    if (user?._id && movie?.id) {
      dispatch(checkWatchlist({ userId: user._id, movieId: movie.id }));
    }
  }, [user?._id, movie?.id, dispatch]);

  if (!movie) return <HeroSkeleton />;

  const genres = movie.genre_ids?.slice(0, 3) || [];

  const handleWatchlist = async () => {
    if (!user?._id) { toast.error("Login to save to Watchlist"); return; }
    
    if (isMovieInWatchList) {
      await dispatch(removeFromWatchlist({ userId: user._id, movieId: movie.id }));
    } else {
      await dispatch(addToWatchlist({
        body: { 
          movieId: movie.id, 
          userId: user._id, 
          title: movie.title, 
          rating: movie.vote_average, 
          genre: [], 
          posterUrl: movie.poster_path 
        }
      }));
    }
  };

  return (
    <div className="relative h-[92vh] w-full overflow-hidden bg-black text-white">

      {/* Blurred low-res background */}
      <div
        className="absolute inset-0 z-0 scale-110"
        style={{
          backgroundImage: movie.backdrop_path ? `url(https://image.tmdb.org/t/p/w300${movie.backdrop_path})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(28px)",
          opacity: 0.25,
        }}
      />

      {/* High-res image */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        style={{
          backgroundImage: movie.backdrop_path ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.55,
        }}
      />

      {/* Bottom gradient fade into black */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/30 to-transparent" />
      {/* Left gradient vignette */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 z-20 px-10 md:px-16 pb-16 max-w-2xl">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Now Playing
          </span>
          <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
            <AiFillStar />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4 drop-shadow-2xl">
          {movie.title || movie.original_title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-300 mb-4 flex-wrap">
          <span>{movie.release_date?.split("-")[0]}</span>
          {genres.length > 0 && <span className="w-1 h-1 bg-gray-500 rounded-full" />}
          <span>{movie.original_language?.toUpperCase()}</span>
        </div>

        {/* Overview */}
        <p className="text-gray-300 text-sm leading-relaxed mb-8 line-clamp-3 max-w-lg">
          {movie.overview}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate(`/upcoming/${movie.id}`)}
            className="flex items-center gap-2 bg-white text-black font-bold px-7 py-3 rounded-full hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg text-sm"
          >
            <BsPlayCircleFill className="text-lg" />
            Watch Now
          </button>

          <button
            onClick={handleWatchlist}
            className={`flex items-center gap-2 font-semibold px-7 py-3 rounded-full border transition-all hover:scale-105 active:scale-95 text-sm backdrop-blur-sm ${
              isMovieInWatchList
                ? "bg-purple-600/80 border-purple-500 text-white shadow-purple-500/30 shadow-lg"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }`}
          >
            {isMovieInWatchList ? <BsBookmarkFill /> : <BsBookmark />}
            {isMovieInWatchList ? "Saved" : "Watchlist"}
          </button>

          <button
            onClick={() => navigate(`/upcoming/${movie.id}`)}
            className="flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-sm text-white font-semibold px-5 py-3 rounded-full hover:bg-white/20 transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <HiOutlineInformationCircle className="text-lg" />
            More Info
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 right-10 z-20 flex gap-2">
        {data.slice(0, 6).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === index ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
