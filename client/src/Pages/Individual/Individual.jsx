import { PlusCircleIcon, UserGroupIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import getGroupDetails from "../../GetData/GroupDetails";
import getUserDetails from "../../GetData/UserDetails";
import Button from "../../Components/Button";
import {
  ExclamationIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import AddExpense from "./AddExpense";
import axios from "axios";
import EditExpense from "./EditExpense";
import { CSVLink } from "react-csv";

const Individual = () => {
  const [expenseList, setExpense] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [openAddExpense, setAddExpense] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState();
  const [deleteExpense, setDeleteExpense] = useState(false);
  const [exportdata, setExportData] = useState([]);

  useEffect(() => {
    getUserDetails(setCurrentUser)
  }, []);

  const individualExpense = async () => {
    try {
      const id = currentUser._id;
      if (id) {
        const res = await axios.get(`http://localhost:4000/individual/get-expenses/${id}`);
        if (res.data)
          setExpense(res.data);
        const temp = res.data;
        console.log(temp);
        let data = [];
        temp.forEach((element) => {
          data.push({
            transactionId: element._id,
            category: element.category,
            type: element.type,
            description: element.description,
            paidBy: element.addedBy.name,
            date: element.date,
          })
        })
        setExportData(data);
        // console.log(res.data);
      }
    } catch (err) {
      console.log(err);
      alert("something went wrong")
    }
  }
  const handleExpenseDelete = async (Id) => {
    if (Id) {
      const result = await axios.delete(
        `http://localhost:4000/individual/delete-expense/${Id}`
      );
      if (result) {
        alert("Expense deleted", "success");
        // fetchData(groupId);
        setOpen(false);
        window.location.reload();
      }
      return;
    }
    alert("Something went wrong", "error");
  };

  useEffect(() => {
    setLoading(true);
    individualExpense()
      .finally(() => setLoading(false));
  }, [currentUser]);

  return (
    <div className="md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%] dark:bg-gray-900">
      <div className="mt-4 flex flex-1 flex-col justify-end px-4 sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl dark:bg-gray-900">
        <div>
          <nav className="sm:hidden" aria-label="Back">
            <Link
              to="/"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700  dark:bg-gray-900"
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
                    Your Expense List
                  </p>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl dark:text-white">
              Your Expenses
            </h2>
          </div>
          <div className="mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
            <Link
              to={`/expense/report/${currentUser._id}`}
              className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700" width="w-full"
            >
              Expense Report
            </Link>
          </div>
          <div className="mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
            <CSVLink
              data={exportdata}
              className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700" width="w-full">
              Export
            </CSVLink>
          </div>
          <div className="mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
            <button
              onClick={() => {
                setAddExpense(true);
              }}
              className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700" width="w-full"
            >
              <PlusCircleIcon className="w-5 mr-2" />
              Add Expense
            </button>
          </div>
          <div className="flex flex-shrink-0 md:mt-0 md:ml-4 md:hidden">
            <button
              className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700" width="w-full"
              onClick={() => {
                setAddExpense(true);
              }}>
              <PlusCircleIcon className="w-5" />
            </button>
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
            {expenseList.length > 0 ? (
              <div className="mt-12 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Date Added
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Credit/Debit
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Description
                      </th>
                      <th className="px-6 py-3">

                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200  dark:bg-gray-900 dark:text-white">
                    {expenseList.map((group) => (
                      <tr key={group._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(group.date).toUTCString().slice(0, 17)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <TrashIcon
                            className="w-5 text-red-600"
                            onClick={() => {
                              setOpen(true);
                              setTitle(`Remove this transaction.`);
                              setDeleteExpense(group._id);
                            }}
                          />
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
                  No Expense
                </p>
                <p className="text-md mt-2 text-gray-600 sm:text-lg">
                  Add an Expense
                </p>
              </div>
            )}
          </>
        )}
        <AddExpense
          open={openAddExpense}
          setOpen={setAddExpense}
          currentUser={currentUser}
        />
        <EditExpense
          title={title}
          memberId={deleteExpense}
          icon={<ExclamationIcon className="w-5 text-red-600" />}
          open={open}
          setOpen={setOpen}
          text="Are you sure you want to delete this transaction?"
          buttonText="Delete"
          buttonType="danger"
          handleDelete={handleExpenseDelete}
        />
      </div>
    </div>
  );
};

export default Individual;