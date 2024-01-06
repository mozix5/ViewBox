import React, { useState } from "react";
import bg from "../assets/bg.jpg";
import axios from "axios";
import { useUserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
const Login = () => {
  const { handleUser, handleToken, user, token } = useUserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(email);
    console.log(password);
    axios
      .post("https://shows-api.onrender.com/users/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        handleUser(res.data.user);
        handleToken(res.data.token);
        setIsLoading(false);
        navigate("/");
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
  console.log(user);
  // console.log(token);
  const [isLoading, setIsLoading] = useState(false);
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
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="border-2  rounded-xl "
          style={{ backgroundColor: "rgba(0,0,0,.5)" }}
        >
          <div className=" mx-auto relative  my-auto">
            <div className=" text-white p-7 rounded-xl">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <span>Signin</span>
                  <span>Email address</span>
                  <input
                    type="email"
                    placeholder="email..."
                    className="active:outline-none focus:outline-none text-black rounded-lg px-4 h-8 bg-[#F5F5F5] focus:bg-[#EAEAEA]"
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="flex flex-col gap-2 my-6">
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="password..."
                    className="active:outline-none text-black focus:outline-none rounded-lg px-4 h-8 bg-[#F5F5F5] focus:bg-[#EAEAEA]"
                    onChange={handlePasswordChange}
                  />
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
