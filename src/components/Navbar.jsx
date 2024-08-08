import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, validate } from "../redux/features/auth/authSlice";

const Navbar = () => {
  const { loading, user, isAuthenticated, userToken } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      dispatch(validate(currentUser));
    }
  }, [userToken, dispatch]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="text-white absolute right-0 left-0 z-20 p-4 flex items-center justify-between">
      <div
        className=" font-sans  bg-clip-text text-4xl font-bold text-transparent uppercase"
        style={{
          backgroundImage:
            "linear-gradient(45deg, hsl(240deg 33% 99%), hsl(263deg 38% 53%))",
          padding: "4px",
        }}
      >
        viewbox
      </div>
      {!isAuthenticated ? (
        <div className="flex gap-6">
          <button className="" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button
            type="button"
            className="border-2 px-2 py-2"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="flex gap-6">
          <div>{user?.username}</div>
          <button onClick={() => navigate("/myShows")}>Watchlist</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
