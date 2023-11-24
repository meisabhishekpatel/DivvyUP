import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import {
  ExclamationIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import Tabs from "../../Components/Tabs";
import Breadcrumb from "../../Components/BreadCrumb";
import BeatLoader from "react-spinners/BeatLoader";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddExpense from "./AddExpense";
import EditMembers from "./EditFriend";
import ExpenseList from "./ExpenseList";
import getUserDeatils from "../../GetData/UserDetails";
import axios from "axios";
import SearchFriend from "../../Components/SearchFriendBox";
import { CSVLink } from "react-csv";
import { BellIcon } from "@heroicons/react/solid";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Friends = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openAddExpense, setAddExpense] = useState(false);
  const [title, setTitle] = useState("");
  const [deleteMember, setDeleteMember] = useState("");
  const [expenseList, setExpenseList] = useState([]);
  const [settledExpenseList, setSettledExpenseList] = useState([]);
  const [group, setGroup] = useState({});
  const [friendList, setFriendList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [Loading, setLoading] = useState(true);
  const [friend, setFriend] = useState();
  const [exportdata, setExportData] = useState([]);

  useEffect(() => {
    getUserDeatils(setCurrentUser);
  }, []);

  const fetchFriendsById = async (_id) => {
    if (!_id) return;
    setLoading(true);
    try {
      const result = await axios.get(`/friends/${_id}`);
      if (result) {
        setFriendList(result.data.friends);
      } else {
        alert("Friend not found", "error");
        navigate("/groups");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser._id) {
      fetchFriendsById(currentUser._id);
    }
  }, [currentUser]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `http://localhost:4000/expense/user/${currentUser._id}`
      );
      if (result) {
        const { activeExpenses, settledExpenses } = result.data;
        if (activeExpenses || settledExpenses) {
          setExpenseList(activeExpenses || []);
          setSettledExpenseList(settledExpenses || []);
        }
        // console.log(activeExpenses);
        // console.log(settledExpenses);
        let temp = activeExpenses;
        let data = [];
        temp.forEach((element) => {
          data.push({
            transactionId: element._id,
            category: element.category,
            description: element.description,
            paidBy: element.paidBy.name,
            date: element.date,
            Friend: element.membersBalance[1].name,
            SettledMember: element.settledMembers,
            isSettled: element.isSettled,
          });
        });
        temp = settledExpenses;
        temp.forEach((element) => {
          data.push({
            transactionId: element._id,
            category: element.category,
            description: element.description,
            paidBy: element.paidBy.name,
            date: element.date,
            Friend: element.membersBalance[1].name,
            SettledMember: element.settledMembers,
            isSettled: element.isSettled,
          });
        });
        setExportData(data);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentUser]);

  const handleAddMember = async (friendId) => {
    try {
      if (friendId) {
        const result = await axios.post(
          `http://localhost:4000/friends/${currentUser._id}/friend/${friendId}`
        );
        if (result) {
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error adding friend:", err);
    }
  };

  const handleMemberDelete = async (memberId) => {
    if (memberId) {
      try {
        const result = await axios.delete(
          `http://localhost:4000/friends/${currentUser._id}/friend/${memberId}`
        );
        if (result) {
          alert("Friend removed", "success");
          fetchFriendsById(currentUser._id);
          setOpen(false);
          window.location.reload();
          return;
        }
      } catch (error) {
        console.error("Error deleting friend:", error);
      }
    }
    alert("Something went wrong", "error");
  };

        return (
          <div className="md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%] dark:bg-gray-900">
            <div className="flex h-[calc(100vh-64px)] flex-1 flex-col px-4 pt-3  sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl dark:bg-gray-900">
              <Breadcrumb paths={[{ name: "Friends", to: "/friends" }]} />

              <div className="mt-2 flex md:items-center md:justify-between dark:bg-gray-900">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl dark:bg-gray-900">
                    {group.name}
                  </h2>
                </div>
                <div className="mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
                  <Link
                    to={`/friendexpense/report/${currentUser._id}`}
                    className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700 "
                    width="w-full"
                  >
                    Expense Report
                  </Link>
                </div>
                <div className="mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
                  <CSVLink
                    data={exportdata}
                    className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                    width="w-full"
                  >
                    Export
                  </CSVLink>
                </div>
              </div>
              <div className="flex flex-col pt-6 sm:grid sm:h-[calc(100vh-180px)] sm:grid-cols-4 sm:space-x-4">
                <div className="w-full overflow-y-auto sm:col-span-2">
                  <p className="mb-2 text-sm font-medium uppercase text-gray-500 dark:text-white">
                    Expense List
                  </p>
                  {Loading ? (
                    <BeatLoader />
                  ) : (
                    <Tabs
                      tabs={[
                        {
                          label: "Active",
                          content: (
                            <ExpenseList
                              currentUser={currentUser}
                              expenseList={expenseList}
                            />
                          ),
                        },
                        {
                          label: "Settled",
                          content: (
                            <ExpenseList
                              currentUser={currentUser}
                              expenseList={settledExpenseList}
                              settled
                            />
                          ),
                        },
                      ]}
                    />
                  )}
                </div>
                <div className="flex flex-col justify-start sm:col-span-2 dark:bg-gray-900">
                  <div className="my-2">
                    <p className="text-sm font-medium uppercase text-gray-500 dark:bg-gray-900 dark:text-white">
                      Add Friend
                    </p>
                    <SearchFriend
                      memberList={friendList}
                      setMemberList={setFriendList}
                      handleAdd={handleAddMember}
                    />
                  </div>
                  <div className="my-2 rounded border shadow-sm ">
                    <p className=" rounded-t bg-gray-800 p-2 text-sm font-semibold uppercase text-white dark:text-white dark:bg-gray-900">
                      Friends
                    </p>
                    {Loading ? (
                      <BeatLoader />
                    ) : (
                      <div className="divide-y-2 p-2">
                        {friendList &&
                          friendList.length > 0 &&
                          friendList.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="mt-1 text-sm font-semibold text-gray-700  dark:text-blue-500">
                                  {member.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-blue-300">
                                  {member.email}
                                </p>
                              </div>
                              <div></div>
                              <div className="flex">
                                <BellIcon
                                  className="w-5 text-green-400 cursor-pointer mr-8"
                                  onClick={() => {
                                    navigate(`/email/${member.email}/${member.name}`);
                                  }}
                                />
                                <PlusCircleIcon
                                  className="cursor-pointer w-5 text-green mr-8 dark:text-blue-500"
                                  onClick={() => {
                                    setAddExpense(true);
                                    setFriend(member._id);
                                    console.log(friend);
                                  }}
                                />
                                <TrashIcon
                                  className="cursor-pointer w-5 text-red-600"
                                  onClick={() => {
                                    setOpen(true);
                                    setTitle(`Remove ${member.name}`);
                                    setDeleteMember(member._id);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <AddExpense
                open={openAddExpense}
                setOpen={setAddExpense}
                currentUser={currentUser}
                friend={friend}
              />
              <EditMembers
                title={title}
                memberId={deleteMember}
                icon={<ExclamationIcon className="w-5 text-red-600" />}
                open={open}
                setOpen={setOpen}
                text="Are you sure you want to delete this member?"
                buttonText="Delete"
                buttonType="danger"
                handleDelete={handleMemberDelete}
              />
            </div>
          </div>
        );
      };

export default Friends;
