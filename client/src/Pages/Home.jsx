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
            const res = await fetch("/user/details", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const data = await res.json();
            // console.log(data);
            if (!res.status === 200) {
                alert("Error");
            }
        } catch (err) {
            navigate("/")
            console.log(err);
        }
    }

    useEffect(() => {
        callHomePage();
    }, [])


    return (
        <div className="md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%]">
            <div className="my-10 px-0 sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl">
                {/* Group Overview */}
                <div className="my-12">
                    <div className="flex justify-between border-b pb-6">
                        <h1 className="text-2xl font-bold">Your Groups</h1>
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
                        <div className="mt-6 grid w-full space-y-3 sm:place-content-center sm:place-items-center sm:space-y-0 md:grid-cols-2 lg:grid-cols-3">
                            {groupList.slice(0, 3).map((group) => (
                                <div
                                    key={group._id}
                                    className="flex h-56 w-3/4 min-w-full flex-col justify-between rounded border-2 shadow-sm sm:min-w-0"
                                >
                                    <div className="p-2 py-3 px-6">
                                        <div className="mb-3 flex flex-col  justify-between border-b pb-2">
                                            <p className=" truncate text-2xl font-bold text-gray-800 ">
                                                {group.name}
                                            </p>
                                            <p className="mt-2 truncate text-sm text-gray-500">
                                                {group.description}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="flex items-center text-sm font-semibold uppercase text-gray-500">
                                                <span className="mr-2">
                                                    <MoneyBag className="h-6 w-6" />
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
                        <h1>Loading</h1>
                    )}
                </div>
                {/* Expense Overview */}
                <div className="mt-12">
                    <div className="border-b pb-6">
                        <h1 className="text-2xl font-bold">Expense Overview</h1>
                    </div>

                    <div className="grid-col-1 mt-6 grid space-y-3 sm:place-content-center sm:place-items-center sm:space-y-0 md:grid-cols-2">
                        <div className="min-w-full  md:pl-8">
                            <PieGraph />
                        </div>
                        <div className="min-w-full  md:pl-8">
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
