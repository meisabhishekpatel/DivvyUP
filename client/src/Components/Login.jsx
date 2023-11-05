import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const data = {
            email: email,
            password: password
        }
        console.log(data);
        try {
            await axios.post("http://localhost:4000/user/login", data)
                .then((res) => {
                    localStorage.clear()
                    localStorage.setItem("token", JSON.stringify(res.data.token))
                    navigate("/")
                })

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6  m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-blue-700 uppercase">
                    Sign in
                </h1>
                <form className="mt-6">
                    <div className="mb-2">
                        <label
                            for="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            placeholder='Email'
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            for="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            placeholder='Password'
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <a
                        href="#"
                        className="text-xs text-blue-700 hover:underline"
                    >
                        Forget Password?
                    </a>
                    <div className="mt-6">
                        <button onClick={(e) => handleSubmit(e)} className="w-full px-4 py-2 text-decoration-none tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-600">
                            Login
                        </button>
                    </div>
                </form>
                <div className="relative flex items-center justify-center w-full mt-6 border border-t">
                    <div className="absolute px-5 bg-white">Or</div>
                </div>
                <div className="flex mt-4 gap-x-2">
                    <button
                        class="px-4 py-2 border flex w-full gap-2 items-center justify-center border-slate-700 rounded-lg text-black-200 hover:border-slate-500 hover:text-slate-300 hover:shadow transition duration-150">
                        <img class="w-6 h-6" src="/assets/google.svg" loading="lazy"
                            alt="google logo" />
                        <span>Sign in with Google</span>
                    </button>
                </div>

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    Don't have an account?{" "}
                    <Link
                        button="/signup"
                        className="font-medium text-blue-700 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>

    );
}