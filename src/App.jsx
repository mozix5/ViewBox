import React from "react";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MyShows from "./pages/Myshows";
import { UserContext } from "./context/UserContext";
import Navbar from "./components/Navbar";
import ShowsList from "./pages/ShowsList";

const App = () => {
  return (
    <UserContext>
      <div className=" font-montserrat">
      <Navbar/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/myShows" element={<MyShows />} />
          <Route path="/" element={<Home />} />
          <Route path="/:id/:genre" element={<MovieDetails />} />
          <Route path="/:genre" element={<ShowsList/>}/>
        </Routes>
      </div>
    </UserContext>
  );
};

export default App;
