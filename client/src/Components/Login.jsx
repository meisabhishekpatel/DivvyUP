import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(true); // New state for email validation
  const navigate = useNavigate();
  let name, value;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const slideIn = useSpring({
    from: { transform: "translateX(-100%)" },
    to: { transform: "translateX(0%)" },
    config: { duration: 500 },
  });

  const handleInputs = (e) => {
    try {
      name = e.target.name;
      value = e.target.value;
      setUser({ ...user, [name]: value });

      // Email validation check
      if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = user;

    // Check email validation before making the API request
    if (!isEmailValid) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
      });
      if (!res.data.error) {
        // alert(res.data.message);
        navigate("/home");
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  const handleSuccess = async (res) => {
    var data = jwtDecode(res.credential);
    const email = data.email;
    try {
      const res = await axios.post("http://localhost:3000/user/googlelogin", {
        email,
      });
      if (!res.data.error) {
        // alert(res.data.message);
        navigate("/home");
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      alert(err.response.data.error);
    }
    console.log(email);
  };

  return (
    <animated.div
      style={slideIn}
      className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50"
    >
      <animated.div
        style={fadeIn}
        className="w-full px-6 py-4 mt-6 overflow-hidden bg-gray-50 sm:max-w-lg sm:rounded-lg"
      >
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
          <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
            <h1 className="text-3xl font-semibold text-center text-blue-700 uppercase">
              Sign in
            </h1>
            <form className="mt-6">
              <div className="mb-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Email
                </label>
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputs}
                  className={`block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 ${
                    !isEmailValid ? "border-red-500" : ""
                  }`}
                />
                {!isEmailValid && (
                  <p className="text-red-500 text-sm">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleInputs}
                    className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute top-1/2 text-blue-700 right-3 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!isEmailValid} // Disable button if email is not valid
                  className="w-full px-4 py-2 text-decoration-none tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-600"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="relative flex items-center justify-center w-full mt-6 border border-t">
              <div className="absolute px-5 bg-white">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => {
                    console.log("error");
                  }}
                />
              </div>
            </div>
            <div className="flex mt-4 gap-x-2"></div>
            <p className="mt-8 text-xs font-light text-center text-gray-700">
              {" "}
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
}
