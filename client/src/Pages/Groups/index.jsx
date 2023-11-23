import { PlusCircleIcon, UserGroupIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import getGroupDetails from "../../GetData/GroupDetails";
import getUserDetails from "../../GetData/UserDetails";
import Button from "../../Components/Button";

const Groups = () => {
    const [groupList, setGroup] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUserDetails(setCurrentUser)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        getGroupDetails(setGroup, currentUser._id)
            .finally(() => setLoading(false));
    }, [currentUser]);

    return (
        <div className="md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%]">
            <div className="mt-4 flex flex-1 flex-col justify-end px-4 sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl">
                <div>
                    <nav className="sm:hidden" aria-label="Back">
                        <Link
                            to="/"
                            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                            <ChevronLeftIcon
                                className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                            />
                            Back
                        </Link>
                    </nav>
                    <nav className="hidden sm:flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-4">
                            <li>
                                <div className="flex">
                                    <Link
                                        to="/home"
                                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        Home
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <ChevronRightIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <p className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                        Groups
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                            Your Groups
                        </h2>
                    </div>
                    <div className="mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
                        <Link to="/addgroup">
                            <button className="flex bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700" width="w-full">
                                <PlusCircleIcon className="w-5" />
                                <span>ㅤ</span>Add Group
                            </button>
                        </Link>
                    </div>
                    <div className="flex flex-shrink-0 md:mt-0 md:ml-4 md:hidden">
                        <Link to="/addgroup">
                            <button className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700" width="w-full">
                                <PlusCircleIcon className="w-5" />
                            </button>
                        </Link>
                    </div>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        {/* React-Spinners BeatLoader */}
                        {/* <BeatLoader color="#4F46E5" size={10} /> */}
                        <BeatLoader />
                    </div>
                ) : (
                    <>
                        {groupList.length > 0 ? (
                            <div className="mt-12 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-800 text-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                                                Members
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                                                Total Expenses
                                            </th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {groupList.map((group) => (
                                            <tr key={group._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {group.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {group.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {group.members?.length}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {group.totalExpenses}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link to={`/group/detail/${group._id}`}>
                                                        <Button
                                                            type="link"
                                                            rightIcon={<ChevronRightIcon className="w-5" />}
                                                        >
                                                            Open
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="mt-10 flex h-52 w-full flex-col items-center justify-center border-2 border-dashed">
                                <UserGroupIcon className="w-10 stroke-1" />
                                <p className="mt-1 w-full text-center text-xl font-semibold sm:text-3xl">
                                    No Groups
                                </p>
                                <p className="text-md mt-2 text-gray-600 sm:text-lg">
                                    Add a group to split the bills
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Groups;