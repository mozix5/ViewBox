import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { MovieDetailsSkeleton } from "./components/Skeleton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ShowsList = lazy(() => import("./pages/ShowsList"));
const WatchList = lazy(() => import("./pages/WatchList"));
const Profile = lazy(() => import("./pages/Profile"));

const App = () => {
  return (
    <div className="font-montserrat">
      <ErrorBoundary>
        <Navbar />
        <Suspense fallback={<MovieDetailsSkeleton />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/watchList" element={<WatchList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/:genre/:id" element={<MovieDetails />} />
            <Route path="/:genre" element={<ShowsList />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
