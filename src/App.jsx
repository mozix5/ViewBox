import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { MovieDetailsSkeleton } from "./components/Skeleton";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ShowsList = lazy(() => import("./pages/ShowsList"));
const WatchList = lazy(() => import("./pages/WatchList"));
const Profile = lazy(() => import("./pages/Profile"));
const PersonDetails = lazy(() => import("./pages/PersonDetails"));

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
            <Route path="/person/:id" element={<PersonDetails />} />
            <Route path="/" element={<Home />} />
            <Route path="/:genre/:id" element={<MovieDetails />} />
            <Route path="/:genre" element={<ShowsList />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastStyle={{
          background: "rgba(15, 10, 30, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(139, 92, 246, 0.25)",
          borderRadius: "16px",
          color: "#e2e8f0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1)",
          fontSize: "14px",
          fontWeight: "500",
        }}
        progressStyle={{
          background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
          borderRadius: "999px",
        }}
      />
    </div>
  );
};

export default App;
