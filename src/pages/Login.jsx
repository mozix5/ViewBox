import React, { useEffect, useState } from "react";
import bg from "../assets/bg.jpg";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = (data) => {
    dispatch(login({ body: data }));
  };
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <div
          className="border-2  rounded-xl "
          style={{ backgroundColor: "rgba(0,0,0,.5)" }}
        >
          <div className=" mx-auto relative  my-auto">
            <div className=" text-white p-7 rounded-xl">
              <form onSubmit={handleSubmit(formSubmit)}>
                <div className="flex flex-col gap-2">
                  <span>Signin</span>
                  <span>Email address</span>
                  <input
                    type="email"
                    placeholder="email..."
                    name="email"
                    className="active:outline-none focus:outline-none text-black rounded-lg px-4 h-8 bg-[#F5F5F5] focus:bg-[#EAEAEA]"
                    {...register("email", {
                      required: true,
                      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    })}
                  />
                  {errors.email && errors.email.type === "required" && (
                    <p>Email is required</p>
                  )}
                  {errors.email && errors.email.type === "pattern" && (
                    <p>Invalid Email</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 my-6">
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="password..."
                    name="password"
                    className="active:outline-none text-black focus:outline-none rounded-lg px-4 h-8 bg-[#F5F5F5] focus:bg-[#EAEAEA]"
                    {...register("password", { required: true })}
                  />
                  {errors.password && errors.password.type === "required" && (
                    <p>Password is required</p>
                  )}
                </div>
                <div className="text-[#346BD4]">Forgot Password?</div>
                <button
                  className="bg-purple-700 text-white mt-6 h-8 rounded-lg w-[100%] font-bold"
                  type="submit"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
