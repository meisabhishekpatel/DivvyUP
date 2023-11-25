import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import Sidebar from "../Components/SideBar";
import Profile from "../Components/Profile";
import NavBar from "../Components/NavBar";
import ThemeBtn from "../Components/ThemeBtn";

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        document.title = "DivvyUp - Dashboard";
    }, []);

    return (
        <>
            <div className="dark:bg-gray-800">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className=" dark:text-white lg:pl-64 flex flex-col flex-1 h-full dark:bg-gray-800">
                    <div className="dark:bg-gray-900 dark:text-white last:relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
                        <button
                            type="button"
                            className="dark:bg-gray-900 dark:text-white px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="dark:bg-gray-900 dark:text-white sr-only">Open sidebar</span>
                            <MenuIcon className="dark:bg-gray-900 dark:text-white h-6 w-6" aria-hidden="true" />
                        </button>

                        <div className="dark:bg-gray-900 dark:text-white flex-1 px-4 flex justify-end sm:px-6 xl:max-w-6xl lg:mx-auto lg:px-8">
                            <div className="dark:bg-gray-900 dark:text-white ml-4 flex items-center md:ml-6">
                                <button
                                    type="button"
                                    className="dark:bg-gray-900 dark:text-white bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <span className="dark:bg-gray-900 dark:text-white sr-only">View notifications</span>
                                </button>
                                <ThemeBtn />
                                <Profile />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
}
