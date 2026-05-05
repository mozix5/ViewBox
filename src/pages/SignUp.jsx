import React, { useEffect } from "react";
import bg from "../assets/bg.jpg";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/features/auth/authSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [user, navigate, isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = (data) => {
    dispatch(signup({ body: data }));
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
          className="border-2 rounded-xl"
          style={{ backgroundColor: "rgba(0,0,0,.5)" }}
        >
          <div className="mx-auto relative my-auto">
            <div className="text-white p-7 rounded-xl min-w-[350px]">
              <form onSubmit={handleSubmit(formSubmit)}>
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-2xl font-bold mb-2">Sign Up</span>
                  <span>Username</span>
                  <input
                    type="text"
                    placeholder="username..."
                    className="active:outline-none focus:outline-none text-black rounded-lg px-4 h-10 bg-[#F5F5F5] focus:bg-[#EAEAEA]"
                    {...register("username", { required: true })}
                  />
                  {errors.username && <p className="text-red-400 text-xs">Username is required</p>}
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <span>Email address</span>
                  <input
                    type="email"
                    placeholder="email..."
                    className="active:outline-none focus:outline-none text-black rounded-lg px-4 h-10 bg-[#F5F5F5] focus:bg-[#EAEAEA]"
                    {...register("email", {
                      required: true,
                      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    })}
                  />
                  {errors.email && errors.email.type === "required" && (
                    <p className="text-red-400 text-xs">Email is required</p>
                  )}
                  {errors.email && errors.email.type === "pattern" && (
                    <p className="text-red-400 text-xs">Invalid Email</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="password..."
                    className="active:outline-none text-black focus:outline-none rounded-lg px-4 h-10 bg-[#F5F5F5] focus:bg-[#EAEAEA]"
                    {...register("password", { required: true, minLength: 6 })}
                  />
                  {errors.password && errors.password.type === "required" && (
                    <p className="text-red-400 text-xs">Password is required</p>
                  )}
                  {errors.password && errors.password.type === "minLength" && (
                    <p className="text-red-400 text-xs">Password must be at least 6 characters</p>
                  )}
                </div>

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <button
                  className="bg-purple-700 hover:bg-purple-800 transition-colors text-white h-10 rounded-lg w-full font-bold uppercase tracking-wider"
                  type="submit"
                >
                  Create Account
                </button>

                <div className="mt-6 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-purple-400 hover:underline">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;