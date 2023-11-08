import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"

export default function SignUp() {
    const [user, setUser] = useState({
        name: "", email: "", password: "", confirmpassword: ""
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
        const { name, email, password, confirmpassword } = user;
        const res = await fetch("/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name, email, password, confirmpassword
            })
        });

        const data = await res.json()

        if (data.status === 422 || !data) {
            alert("invalid details");
            console.log("invalid details");
        }
        else {
            alert("signup successfull");
            console.log("sign up successfull");
            navigate("/login");
        }

    }

    // async function handleSubmit(e) {
    //     e.preventDefault();
    //     const data = {
    //         username: userName,
    //         email: email,
    //         password: password
    //     }
    //     try {
    //         await axios.post("http://localhost:4000/user/signup", data)
    //             .then((res) => {
    //                 localStorage.clear()
    //                 localStorage.setItem("token", JSON.stringify(res.data.token))
    //                 navigate("/login")
    //             })

    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    return (
        <div>
            <div className="flex flex-col  items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
                <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
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
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Password
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleInputs}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="confirmpassword"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Confirm Password
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name="confirmpassword"
                                    onChange={handleInputs}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        {/* <a
                            href="#"
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Forget Password?
                        </a> */}
                        <div className="flex items-center mt-4">
                            <button onClick={handleSubmit} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
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
                        <button
                            class="px-4 py-2 border flex w-full gap-2 items-center justify-center border-slate-700 rounded-lg text-black-200 hover:border-slate-500 hover:text-slate-300 hover:shadow transition duration-150">
                            <img class="w-6 h-6" src="/assets/google.svg" loading="lazy"
                                alt="google logo" />
                            <span>Sign in with Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}