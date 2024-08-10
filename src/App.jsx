import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ShowsList from "./pages/ShowsList";
import WatchList from "./pages/WatchList";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className=" font-montserrat">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/watchList" element={<WatchList />} />
        <Route path="/" element={<Home />} />
        <Route path="/:genre/:id" element={<MovieDetails />} />
        <Route path="/:genre" element={<ShowsList />} />
      </Routes>
    </div>
  );
};

export default App;
