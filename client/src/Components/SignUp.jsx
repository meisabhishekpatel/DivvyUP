import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";

export default function SignUp() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [isEmailValid, setIsEmailValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const navigate = useNavigate();
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

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
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setIsEmailValid(emailRegex.test(value));
            setEmailErrorMessage(emailRegex.test(value) ? "" : "Please enter a valid email address.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = user;

        if (!isEmailValid) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const res = await fetch("/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword,
                }),
            });

            const data = await res.json();

            if (!data.message || !data) {
                alert(data.error);
            } else {
                alert("Signup successful");
                navigate("/login");
            }
        } catch (err) {
            alert(err.response ? err.response.data.error : "An error occurred");
        }
    };

    return (
        <animated.div style={slideIn} className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
            <animated.div style={fadeIn} className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
                <h1 className="text-3xl font-semibold text-center text-blue-700 uppercase">
                    Sign Up
                </h1>
                <form>
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 undefined"
                        >
                            Name
                        </label>
                        <div className="flex flex-col items-start">
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleInputs}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 undefined"
                        >
                            Email
                        </label>
                        <div className="flex flex-col items-start">
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputs}
                                className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${isEmailValid ? "" : "border-red-500"
                                    }`}
                            />
                            {emailErrorMessage && (
                                <p className="text-xs text-red-500 mt-1">{emailErrorMessage}</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 relative">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 undefined"
                        >
                            Password
                        </label>
                        <div className="flex flex-col items-start">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={user.password}
                                onChange={handleInputs}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <button
                                type="button"
                                className="absolute  right-0 px-3 py-3 text-blue-700 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 relative">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 undefined"
                        >
                            Confirm Password
                        </label>
                        <div className="flex flex-col items-start">
                            <input
                                type={showCPassword ? "text" : "password"}
                                name="confirmPassword"
                                onChange={handleInputs}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <button
                                type="button"
                                className="absolute  right-0 px-3 py-3 text-blue-700 cursor-pointer"
                                onClick={() => setShowCPassword(!showCPassword)}
                            >
                                {showCPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <button
                            onClick={handleSubmit}
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="mt-4 text-grey-600">
                    Already have an account?{" "}
                    <span>
                        <Link className="text-blue-600 hover:underline" to="/login">
                            Log in
                        </Link>
                    </span>
                </div>
                <div className="flex items-center w-full my-4">
                    <hr className="w-full" />
                    <p className="px-3 ">OR</p>
                    <hr className="w-full" />
                </div>
                <div className="my-6 space-y-2">
                    <button className="px-4 py-2 border flex w-full gap-2 items-center justify-center border-slate-700 rounded-lg text-black-200 hover:border-slate-500 hover:text-slate-300 hover:shadow transition duration-150">
                        <img
                            className="w-6 h-6"
                            src="/assets/google.svg"
                            loading="lazy"
                            alt="Google logo"
                        />
                        <span>Sign in with Google</span>
                    </button>
                </div>
            </animated.div>
        </animated.div>
    );
}
