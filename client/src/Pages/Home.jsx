import { ExternalLinkIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { ReactComponent as Group } from "../images/group.svg";
import { ReactComponent as MoneyBag } from "../images/MoneyBag.svg";
import { Link, useNavigate } from "react-router-dom";
import BarGraph from "../Components/Graph/BarChart";
import PieGraph from "../Components/Graph/PieChart";
import { useState, useEffect } from "react";
import getGroupDetails from "../GetData/GroupDetails";
import getUserDeatils from "../GetData/UserDetails";
import Button from "../Components/Button";
import axios from 'axios';
import { BeatLoader } from "react-spinners";
import NavBar from "../Components/NavBar";

const Home = () => {
    const navigate = useNavigate();
    const [groupList, setGroup] = useState([]);
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        getUserDeatils(setCurrentUser);
    }, [])
    useEffect(() => {
        getGroupDetails(setGroup, currentUser._id);
    }, [currentUser])

    const callHomePage = async () => {
        try {
            const response = await axios.get("/user/details", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            const data = response.data;

            if (response.status !== 200) {
                alert("Error");
            }
        } catch (error) {
            navigate("/");
            console.error(error);
        }
    };

    useEffect(() => {
        callHomePage();
    }, [])


    return (
        <div className="dark:bg-gray-900 dark-text-white md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%]">
            <div className="dark:bg-gray-900 dark-text-white my-10 px-0 sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl dark:bg-gray-900">
                {/* Group Overview */}
                <div className="dark:bg-gray-900 dark:text-white my-12">
                    <div className="dark:bg-gray-900 dark:bgflex justify-between border-b pb-6">
                        <h1 className="dark:bg-gray-900 dark:text-white text-2xl font-bold dark:text-white">Your Groups</h1>
                        {groupList.length > 3 && (
                            <Link to="/groups">
                                <Button
                                    type="link"
                                    rightIcon={<ExternalLinkIcon className="w-5" />}
                                >
                                    View All{" "}
                                </Button>
                            </Link>
                        )}
                    </div>
                    {groupList ? (
                        <div className="dark:bg-gray-900 dark:text-white mt-6 grid w-full space-y-3 sm:place-content-center sm:place-items-center sm:space-y-0 md:grid-cols-2 lg:grid-cols-3">
                            {groupList.slice(0, 3).map((group) => (
                                <div
                                    key={group._id}
                                    className="dark:bg-gray-900 dark:text-white flex h-56 w-3/4 min-w-full flex-col justify-between rounded border-2 shadow-sm sm:min-w-0"
                                >
                                    <div className="dark:bg-gray-900 dark:text-white p-2 py-3 px-6">
                                        <div className="dark:bg-gray-900 dark:text-white mb-3 flex flex-col  justify-between border-b pb-2">
                                            <p className=" dark:bg-gray-900 dark:text-white truncate text-2xl font-bold text-gray-800 dark:text-white">
                                                {group.name}
                                            </p>
                                            <p className="dark:bg-gray-900 dark:text-white mt-2 truncate text-sm text-gray-500 dark:text-white">
                                                {group.description}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="dark:bg-gray-900 dark:text-white flex items-center text-sm font-semibold uppercase text-gray-500 dark:text-white">
                                                <span className="dark:bg-gray-900 dark:text-white mr-2">
                                                    <MoneyBag className="dark:bg-gray-900 dark:text-white h-6 w-6" />
                                                </span>
                                                Total Expenses :
                                                <span className="ml-1 text-2xl font-semibold text-gray-800">
                                                    {group.totalExpenses}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="mt-3 flex flex-col items-start">
                                            <p className="flex items-center text-sm font-semibold uppercase text-gray-500">
                                                <span className="mr-2">
                                                    <Group className="h-6 w-6" />
                                                </span>
                                                Members :
                                                <span className="ml-1 text-2xl font-semibold text-gray-800">
                                                    {group.members.length}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end bg-gray-100 p-2">
                                        <Link to={`/group/detail/${group._id}`}>
                                            <Button
                                                type="link"
                                                rightIcon={<ExternalLinkIcon className="w-5" />}
                                            >
                                                Open
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {groupList.length < 3 && (
                                <div>
                                    <Link to="/addgroup" className="h-56 shadow-sm sm:w-3/4">
                                        <div className="flex h-56 min-w-full cursor-pointer flex-col items-center  justify-center rounded border-2 border-dashed hover:bg-gray-50 sm:min-w-0">
                                            <Button type="link">
                                                <p className="flex justify-center">
                                                    <PlusCircleIcon className="mb-4 w-10 stroke-1 text-gray-600" />{" "}
                                                </p>
                                                <p className="text-2xl font-medium text-gray-600 dark:text-white">
                                                    Add Group
                                                </p>
                                            </Button>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <BeatLoader />
                    )}
                </div>
                {/* Expense Overview */}
                <div className="dark:bg-gray-900 dark:text-white mt-12">
                    <div className="dark:bg-gray-900 dark:text-white border-b pb-6">
                        <h1 className="dark:bg-gray-900 dark:text-white text-2xl font-bold dark:text-white">Expense Overview</h1>
                    </div>

                    <div className="dark:bg-gray-900 dark:text-white grid-col-1 mt-6 grid space-y-3 sm:place-content-center sm:place-items-center sm:space-y-0 md:grid-cols-2">
                        <div className="dark:bg-gray-900 dark:text-white min-w-full  md:pl-8">
                            <PieGraph currentUser={currentUser} />
                        </div>
                        <div className="dark:bg-gray-900 dark:text-white min-w-full  md:pl-8">
                            <BarGraph />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // </div >
    );
};

export default Home;
