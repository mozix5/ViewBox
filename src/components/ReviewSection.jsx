import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../redux/features/reviews/fetchReviewsSlice";
import { addReview } from "../redux/features/reviews/addReviewSlice";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { setHeaders } from "../utils/constants";
import { toast } from "react-toastify";

const ReviewSection = ({ movieId }) => {
  const dispatch = useDispatch();
  const { reviews, isFetching } = useSelector((state) => state.fetchReviews);
  const { isAdding } = useSelector((state) => state.addReview);
  const { user, userToken, isAuthenticated } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (movieId) {
      dispatch(fetchReviews({ movieId }));
    }
  }, [movieId, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("You need to login to post a review.");
      return;
    }
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }
    if (reviewText.trim().length === 0) {
      toast.error("Please write a review.");
      return;
    }

    const headers = setHeaders(userToken);
    const body = { movieId, rating, reviewText };

    const result = await dispatch(addReview({ body, headers }));
    
    if (addReview.fulfilled.match(result)) {
      setRating(0);
      setReviewText("");
      toast.success("Review posted!");
      // Refetch reviews to show the newly added one
      dispatch(fetchReviews({ movieId }));
    } else {
      toast.error(result.payload || "Failed to post review");
    }
  };

  const averageRating = reviews?.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6 border-t border-white/10 mt-12 bg-black text-white relative z-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold">Ratings & Reviews</h2>
        {reviews?.length > 0 && (
          <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 shadow-lg">
            <div className="text-3xl font-bold text-white">{averageRating}</div>
            <div className="flex flex-col">
              <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  i < Math.round(averageRating) ? <AiFillStar key={i} /> : <AiOutlineStar key={i} className="text-gray-600" />
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-1">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</div>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-10 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-3xl focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                {star <= (hoverRating || rating) ? (
                  <AiFillStar className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                ) : (
                  <AiOutlineStar className="text-gray-500 hover:text-yellow-400 transition-colors" />
                )}
              </button>
            ))}
            <span className="ml-3 text-gray-400 text-sm">
              {rating > 0 ? `${rating} out of 5` : "Select a rating"}
            </span>
          </div>
          <textarea
            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
            rows="4"
            placeholder="What did you think of this movie?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isAdding}
              className={`bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-full font-semibold transition-colors shadow-lg shadow-purple-500/30 ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAdding ? "Posting..." : "Post Review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-10 text-center">
          <p className="text-gray-400 mb-4">You must be logged in to write a review.</p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {isFetching ? (
          <div className="text-center text-gray-400">Loading reviews...</div>
        ) : reviews?.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex gap-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.username || 'User'}&backgroundColor=c0aede`}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-white/10"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-purple-300">{review.user?.username || "Unknown"}</h4>
                    <div className="flex items-center gap-1 text-sm text-yellow-400 my-1">
                      {[...Array(5)].map((_, i) => (
                        i < review.rating ? <AiFillStar key={i} /> : <AiOutlineStar key={i} className="text-gray-600" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <p className="text-gray-300 mt-2 text-sm leading-relaxed whitespace-pre-wrap">{review.reviewText}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No reviews yet. Be the first to review!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
