import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    HomeIcon,
    XIcon,
    UserGroupIcon,

} from "@heroicons/react/outline";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const [navigation, setNavigation] = useState([
        { name: "Home", href: "/home", icon: HomeIcon, current: false },
        { name: "Groups", href: "/groups", icon: UserGroupIcon, current: false },
        { name: "Friends", href: "/friends", icon: UserGroupIcon, current: false },
        { name: "Individual", href: "/individual", icon: UserGroupIcon, current: false },
    ]);
    const { pathname } = useLocation();
    useEffect(() => {
        const updatePathName = pathname.split("/")[1].toLowerCase();

        setNavigation(
            navigation.map((item) => {
                if (
                    item.name.toLowerCase() === updatePathName ||
                    (pathname === "/" && item.name.toLowerCase() === "home") ||
                    ((updatePathName === "group" || updatePathName === "addgroup") &&
                        item.name.toLowerCase() === "groups")
                ) {
                    item.current = true;
                } else {
                    item.current = false;
                }
                return item;
            })
        );
    }, [pathname]);
    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="dark:bg-gray-900 dark:text-white fixed inset-0 z-40 flex lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="dark:bg-gray-900 dark:text-white fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div className="dark:bg-gray-900 dark:text-white relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4 dark:bg-black">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="dark:bg-gray-900 dark:text:white absolute top-0 right-0 -mr-12 pt-2">
                                    <Button
                                        type="button"
                                        className="dark:bg-gray-900 dark:text-white ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="dark:bg-gray-900 dark:text-white sr-only">Close sidebar</span>
                                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </Button>
                                </div>
                            </Transition.Child>
                            <div className="dark:bg-gray-900 dark:text-white flex flex-shrink-0 items-center px-4">
                                <Link to="/">
                                    <span className="dark:bg-gray-900 dark:text-white sr-only">Divvy UP</span>
                                    <p className="dark:bg-gray-900 dark:text-white text-2xl font-bold">
                                        Divvy <span className="dark:bg-gray-900 dark:text-white text-blue-600">UP</span>
                                    </p>
                                </Link>
                            </div>
                            <nav
                                className="dark:bg-gray-900 dark:text-white mt-20 flex-1 flex-shrink-0 divide-y divide-gray-300 overflow-y-auto"
                                aria-label="Sidebar"
                            >
                                <div className="dark:bg-gray-900 dark:text-white space-y-1 px-2">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={(
                                                item.current
                                                    ? "dark:bg-gray-900 dark:text-white bg-blue-600 text-white"
                                                    : " dark:bg-gray-900 dark:text-white text-gray-800 hover:bg-gray-200",
                                                "dark:bg-gray-900 dark:text-white group flex items-center rounded-md px-2 py-2 text-base font-medium"
                                            )}
                                            aria-current={item.current ? "page" : undefined}
                                        >
                                            <item.icon
                                                className={(
                                                    item.current
                                                        ? "dark:bg-gray-900 dark:text-white mr-4 h-6 w-6 flex-shrink-0 text-blue-600"
                                                        : "dark:bg-gray-900 dark:text-white mr-4 h-6 w-6 flex-shrink-0"
                                                )}
                                                aria-hidden="true"
                                            />
                                            <p
                                                className={(
                                                    item.current
                                                        ? "dark:bg-gray-900 dark:text-white mr-4 h-6 w-6 flex-shrink-0 text-blue-600"
                                                        : "dark:bg-gray-900 dark:text-white mr-4 h-6 w-6 flex-shrink-0"
                                                )}
                                                aria-hidden="true"
                                            >
                                                {item.name}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </nav>
                        </div>
                    </Transition.Child>
                    <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="dark:bg-gray-900 dark:text-white hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="dark:bg-gray-900 dark:text-white flex flex-grow flex-col overflow-y-auto border-r border-gray-300 bg-white pt-5 pb-4">
                    <div className="dark:bg-gray-900 dark:text-white flex flex-shrink-0 items-center px-4">
                        <Link to="/">
                            <span className="dark:bg-gray-900 dark:text-white sr-only">Divvy UP</span>
                            <p className="text-2xl font-bold">
                                Divvy<span className="dark:bg-gray-900 dark:text-white text-blue-600">UP</span>
                            </p>
                        </Link>
                    </div>
                    <nav
                        className="dark:bg-gray-900 dark:text-white mt-20 flex flex-1 flex-col divide-y divide-blue-800 overflow-y-auto"
                        aria-label="Sidebar"
                    >
                        <div className="space-y-1 px-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={(
                                        item.current
                                            ? "dark:bg-gray-900 dark:text-white bg-blue-600 text-white"
                                            : "dark:bg-gray-900 dark:text-white text-gray-800 hover:bg-gray-200",
                                        "dark:bg-gray-900 dark:text-white group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6"
                                    )}
                                    aria-current={item.current ? "page" : undefined}
                                >
                                    <item.icon
                                        className={(
                                            item.current
                                                ? "dark:bg-gray-900 dark:text-white mr-4 h-6 w-6 flex-shrink-0 text-blue-600"
                                                : "dark:bg-gray-900 dark:text-white mr-4 h-6 w-6 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                    />
                                    <p
                                        className={(
                                            item.current
                                                ? "dark:bg-gray-900 dark:text-white mr-4 h-6 w-6 flex-shrink-0 text-blue-600"
                                                : "dark:bg-gray-900 dark:text-white mr-4 h-6 w-6 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                    >
                                        {item.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
