import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import getUserDeatils from "../GetData/UserDetails";
import { useCookies } from 'react-cookie';
import cookie from "js-cookie"

const Profile = () => {
    const navigate = useNavigate();
    // const [cookie, setCookie, removeCookie] = useCookies(['jwttoken']);
    const [currentUser, setUser] = useState({});
    useEffect(() => {
        getUserDeatils(setUser);
    }, [])
    return (
        <Menu as="div" className="dark:bg-gray-700 dark:text-white relative ml-3">
            <div>
                <Menu.Button className="dark:bg-gray-700 dark:text-white flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                    <img
                        className="dark:bg-gray-700 dark:text-white h-8 w-8 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${currentUser.name}&background=2463EB&color=fff`}
                        alt=""
                    />
                    <span className="dark:bg-gray-700 dark:text-white ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="dark:bg-gray-700 dark:text-white sr-only">Open user menu for </span>
                        {currentUser.name}
                    </span>
                    <ChevronDownIcon
                        className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block"
                        aria-hidden="true"
                    />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                onClick={() => { navigate('/'); cookie.remove('jwttoken') }}
                                className={(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                )}
                            >
                                Logout
                            </a>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu >
    );
};

export default Profile;
