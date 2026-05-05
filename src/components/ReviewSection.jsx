import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, toggleReviewLike } from "../redux/features/reviews/fetchReviewsSlice";
import { addReview } from "../redux/features/reviews/addReviewSlice";
import { toggleLike } from "../redux/features/reviews/likeReviewSlice";
import { AiFillStar, AiOutlineStar, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { setHeaders } from "../utils/constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ReviewSkeleton } from "./Skeleton";

const ratingLabels = ["", "Terrible", "Bad", "Okay", "Good", "Excellent"];

const StarBar = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-400 w-3 text-right">{star}</span>
      <AiFillStar className="text-yellow-400 text-xs shrink-0" />
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-500 w-6 text-right text-xs">{count}</span>
    </div>
  );
};

const ReviewSection = ({ movieId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviews, isFetching } = useSelector((state) => state.fetchReviews);
  const { isAdding } = useSelector((state) => state.addReview);
  const { user, userToken, isAuthenticated } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (movieId) dispatch(fetchReviews({ movieId }));
  }, [movieId, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("You need to login to post a review."); return; }
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    if (reviewText.trim().length < 5) { toast.error("Please write at least a few words."); return; }

    const headers = setHeaders(userToken);
    const body = { movieId, rating, reviewText };
    const result = await dispatch(addReview({ body, headers }));

    if (addReview.fulfilled.match(result)) {
      setRating(0);
      setReviewText("");
      toast.success("✨ Review posted!");
      dispatch(fetchReviews({ movieId }));
    } else {
      toast.error(result.payload || "Failed to post review");
    }
  };

  const handleToggleLike = async (reviewId) => {
    if (!isAuthenticated) { toast.error("Login to like reviews!"); return; }
    
    // Optimistic update
    dispatch(toggleReviewLike({ reviewId, userId: user._id }));
    
    const headers = setHeaders(userToken);
    const result = await dispatch(toggleLike({ reviewId, headers }));
    
    if (toggleLike.rejected.match(result)) {
      // Revert on error
      dispatch(toggleReviewLike({ reviewId, userId: user._id }));
      toast.error("Failed to update like");
    }
  };

  const averageRating = reviews?.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews?.filter((r) => r.rating === star).length || 0,
  }));

  const activeRating = hoverRating || rating;

  return (
    <div className="w-full bg-black text-white relative z-20 pb-20">
      {/* Gradient separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-0" />

      <div className="max-w-5xl mx-auto px-6 pt-14">

        {/* ── Header & Aggregate Score ── */}
        <div className="flex flex-col lg:flex-row gap-10 mb-12">
          {/* Left: Title */}
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-2">Community</p>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Ratings & Reviews
            </h2>
          </div>

          {/* Right: Score card */}
          {reviews?.length > 0 && (
            <div className="flex items-start gap-8 bg-white/5 border border-white/10 rounded-3xl px-8 py-6 shadow-xl backdrop-blur-md">
              {/* Big number */}
              <div className="flex flex-col items-center">
                <span className="text-7xl font-black leading-none bg-gradient-to-b from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                  {averageRating}
                </span>
                <div className="flex gap-0.5 mt-2">
                  {[...Array(5)].map((_, i) =>
                    i < Math.round(averageRating)
                      ? <AiFillStar key={i} className="text-yellow-400 text-lg" />
                      : <AiOutlineStar key={i} className="text-gray-600 text-lg" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</p>
              </div>

              {/* Distribution bars */}
              <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                {ratingCounts.map(({ star, count }) => (
                  <StarBar key={star} star={star} count={count} total={reviews.length} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Write a Review ── */}
        {isAuthenticated ? (
          <form
            onSubmit={handleSubmit}
            className="relative bg-gradient-to-br from-white/8 to-white/3 border border-white/10 rounded-3xl p-7 mb-12 shadow-2xl overflow-hidden"
          >
            {/* Glow accent */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 rounded-full blur-[80px] opacity-20 pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}&backgroundColor=c0aede`}
                alt="Your avatar"
                className="w-10 h-10 rounded-full border-2 border-purple-500/40"
              />
              <div>
                <p className="font-semibold text-white text-sm">{user?.username}</p>
                <p className="text-xs text-gray-500">Write your review</p>
              </div>
            </div>

            {/* Star picker */}
            <div className="flex items-center gap-1 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="text-4xl transition-transform hover:scale-125 focus:outline-none"
                >
                  {star <= activeRating ? (
                    <AiFillStar className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" />
                  ) : (
                    <AiOutlineStar className="text-gray-600 hover:text-yellow-400 transition-colors" />
                  )}
                </button>
              ))}
              {activeRating > 0 && (
                <span className="ml-3 text-sm font-medium text-yellow-400 animate-pulse">
                  {ratingLabels[activeRating]}
                </span>
              )}
            </div>

            {/* Textarea */}
            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition-all resize-none text-sm leading-relaxed"
              rows="4"
              placeholder="What did you think? Share your honest thoughts…"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-600">{reviewText.length} characters</p>
              <button
                type="submit"
                disabled={isAdding}
                className={`relative flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white px-8 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg shadow-purple-500/40 ${isAdding ? "opacity-60 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
              >
                {isAdding ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Posting…
                  </>
                ) : "Post Review"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-10 mb-12 text-center">
            <AiOutlineStar className="text-5xl text-gray-600" />
            <p className="text-gray-400 text-lg font-medium">Sign in to leave a review</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-2 rounded-full font-semibold text-sm transition-colors"
            >
              Log In
            </button>
          </div>
        )}

        {/* ── Reviews List ── */}
        <div className="flex flex-col gap-5">
          {isFetching ? (
            <ReviewSkeleton />
          ) : reviews?.length > 0 ? (
            reviews.map((review) => {
              const liked = review.likes?.includes(user?._id);
              return (
                <div
                  key={review._id}
                  className="group bg-white/5 hover:bg-white/8 border border-white/5 hover:border-white/15 rounded-2xl p-6 flex gap-5 transition-all duration-300"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.username || "User"}&backgroundColor=c0aede`}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full border-2 border-purple-500/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-white">{review.user?.username || "Unknown"}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) =>
                            i < review.rating
                              ? <AiFillStar key={i} className="text-yellow-400 text-sm" />
                              : <AiOutlineStar key={i} className="text-gray-700 text-sm" />
                          )}
                          <span className="ml-1 text-xs text-yellow-400 font-medium">{review.rating}/5</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 shrink-0 pt-1">
                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">{review.reviewText}</p>
                    
                    {/* Like button */}
                    <button
                      onClick={() => handleToggleLike(review._id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold ${
                        liked 
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                          : "bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10 hover:text-gray-300"
                      }`}
                    >
                      {liked ? <AiFillHeart className="text-sm" /> : <AiOutlineHeart className="text-sm" />}
                      <span>{review.likes?.length || 0} Helpful</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="flex gap-1 text-4xl">
                {[...Array(5)].map((_, i) => <AiOutlineStar key={i} className="text-gray-700" />)}
              </div>
              <p className="text-gray-500 text-lg font-medium">No reviews yet</p>
              <p className="text-gray-700 text-sm">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
