import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUserData();

  // console.log(user);
  return (
    <div className="text-white absolute right-0 left-0 z-20 p-4 flex items-center justify-between">
      <div
        className=" font-sans  bg-clip-text text-4xl font-bold text-transparent uppercase"
        style={{
          backgroundImage:
            " linear-gradient(45deg, hsl(240deg 33% 99%), hsl(263deg 38% 53%)",
          padding: "4px",
        }}
      >
        viewbox
      </div>
      {!user ? (
        <div className="flex gap-6">
          <button className="" onClick={() => navigate("/login")}>
            Login in
          </button>
          <button
            type="button"
            className="border-2 px-2 py-2"
            onClick={() => navigate("/signup")}
          >
            sign up
          </button>
        </div>
      ) : (
        <div className="flex gap-6">
          <div>{user.username}</div>
          <button onClick={()=>navigate('/myShows')}>Watchlist</button>
          <button>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
