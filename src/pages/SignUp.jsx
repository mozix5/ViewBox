import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/features/auth/authSlice";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";

const InputField = React.forwardRef(({ label, icon: Icon, error, type = "text", hint, ...rest }, ref) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className={`flex items-center gap-3 bg-white/6 border rounded-xl px-4 py-3 transition-all ${error ? "border-red-500/60" : "border-white/10 focus-within:border-purple-500/70 focus-within:bg-white/10"}`}>
        <Icon className="text-gray-500 shrink-0" />
        <input
          ref={ref}
          type={isPassword ? (show ? "text" : "password") : type}
          className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-gray-600"
          {...rest}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow((s) => !s)} className="text-gray-500 hover:text-gray-300 transition-colors">
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {!error && hint && <p className="text-gray-600 text-xs">{hint}</p>}
    </div>
  );
});

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [user, navigate, isAuthenticated]);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const formSubmit = (data) => dispatch(signup({ body: data }));

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-violet-700 rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full blur-[130px] opacity-15 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-3xl font-black uppercase tracking-tight select-none"
            style={{
              background: "linear-gradient(120deg, #fff 20%, hsl(270, 60%, 70%) 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ViewBox
          </button>
          <p className="text-gray-500 text-sm mt-2">Create your account and start exploring.</p>
        </div>

        {/* Card */}
        <div className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(formSubmit)} className="flex flex-col gap-5">
            <InputField
              label="Username"
              icon={FiUser}
              placeholder="coolmovielover"
              error={errors.username?.type === "required" ? "Username is required" : null}
              {...register("username", { required: true })}
            />

            <InputField
              label="Email Address"
              icon={FiMail}
              type="email"
              placeholder="you@example.com"
              error={
                errors.email?.type === "required" ? "Email is required"
                  : errors.email?.type === "pattern" ? "Invalid email address"
                  : null
              }
              {...register("email", { required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ })}
            />

            <InputField
              label="Password"
              icon={FiLock}
              type="password"
              placeholder="At least 6 characters"
              hint="Must be at least 6 characters long"
              error={
                errors.password?.type === "required" ? "Password is required"
                  : errors.password?.type === "minLength" ? "At least 6 characters required"
                  : null
              }
              {...register("password", { required: true, minLength: 6 })}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account…</>
              ) : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;