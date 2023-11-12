import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"


export default function Login() {
    const [user, setUser] = useState({
        email: "", password: ""
    });
    const navigate = useNavigate();
    let name, value;
    const handleInputs = (e) => {
        try {
            name = e.target.name;
            value = e.target.value;
            setUser({ ...user, [name]: value, })
        } catch (e) {
            console.log(e);
        }

    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = user;
        const res = await fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        });
        const data = await res.json()

        if (data.status === 422 || !data) {
            alert("invalid details");
            console.log("invalid details");
        }
        else {
            alert("Login successfull");
            navigate("/home");
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
                            name="email"
                            value={user.email}
                            onChange={handleInputs}
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
                            name="password"
                            value={user.password}
                            onChange={handleInputs}
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
                        <button onClick={handleSubmit} className="w-full px-4 py-2 text-decoration-none tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-600">
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
                        to="/signup"
                        className="font-medium text-blue-700 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>

    );
}