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
    getUserDetails(setCurrentUser).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getGroupDetails(setGroup, currentUser._id).finally(() => setLoading(false));
  }, [currentUser]);

  return (
    <div className="dark:bg-gray-900 md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%] h-full">
      <div className=" dark:bg-gray-900 mt-4 flex flex-1 flex-col justify-end px-4 sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl">
        <div>
          <nav className="dark:bg-gray-900 sm:hidden" aria-label="Back">
            <Link
              to="/"
              className="dark:bg-gray-900 flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ChevronLeftIcon
                className="dark:bg-gray-900 -ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              Back
            </Link>
          </nav>
          <nav
            className="dark:bg-gray-900 hidden sm:flex"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center space-x-4">
              <li>
                <div className="flex">
                  <Link
                    to="/home"
                    className="dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-white  hover:text-gray-700"
                  >
                    Home
                  </Link>
                </div>
              </li>
              <li>
                <div className=" dark:bg-gray-900 flex items-center">
                  <ChevronRightIcon
                    className="dark:bg-gray-900 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <p className="dark:bg-gray-900 ml-4 text-sm font-medium text-gray-500 dark:text-white  hover:text-gray-700">
                    Groups
                  </p>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white  sm:truncate sm:text-3xl">
              Your Groups
            </h2>
          </div>
          <div className="dark:text-white  mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
            <Link to="/addgroup">
              <button
                className="dark:text-white  bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white  bg-brand-600 hover:bg-brand-700"
                width="w-full"
              >
                <PlusCircleIcon className="w-5" />
                <span>ㅤ</span>Add Group
              </button>
            </Link>
          </div>
          <div className="dark:bg-gray-900 flex flex-shrink-0 md:mt-0 md:ml-4 md:hidden">
            <Link to="/addgroup">
              <button
                className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white dark:text-black bg-brand-600 hover:bg-brand-700"
                width="w-full"
              >
                <PlusCircleIcon className="w-5" />
              </button>
            </Link>
          </div>
        </div>
        {loading ? (
          <div className="dark:bg-gray-900 dark:text-white  flex items-center justify-center h-32">
            {/* React-Spinners BeatLoader */}
            {/* <BeatLoader color="#4F46E5" size={10} /> */}
            <BeatLoader />
          </div>
        ) : (
          <>
            {groupList.length > 0 ? (
              <div className="dark:text-blue-500 mt-12 overflow-x-auto">
                <table className=" min-w-full divide-y divide-gray-200 dark:divide-black">
                  <thead className="bg-gray-800 dark:bg-white text-white dark:text-black">
                    <tr>
                      <th className="dark:bg-gray-800 dark:text-white px-6 py-3 text-left text-sm font-semibold uppercase">
                        Name
                      </th>
                      <th className="dark:bg-gray-800 dark:text-white px-6 py-3 text-left text-sm font-semibold uppercase">
                        Description
                      </th>
                      <th className="px-6 py-3 dark:text-white dark:bg-gray-800 text-left text-sm font-semibold uppercase">
                        Members
                      </th>
                      <th className="dark:bg-gray-800 dark:text-white px-6 py-3 text-left text-sm font-semibold uppercase">
                        Total Expenses
                      </th>
                      <th className="dark:bg-gray-800 dark:text-white px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="dark:bg-gray-800 dark:text-white bg-white divide-y divide-gray-200">
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
