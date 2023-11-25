import { CircularProgress } from "@mui/material";
import Tabs from "../../Components/Tabs";
import Breadcrumb from "../../Components/BreadCrumb";
import SearchMember from "../../Components/SearchBox";
import Modal from "./DeleteGroup";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditMembers from "./EditMembers";
import ExpenseList from "./ExpenseList";
import AddgroupExpense from "./AddExpense";
import getUserDeatils from "../../GetData/UserDetails";
import axios from "axios";
import Button from "../../Components/Button";
import {
  ExclamationIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import BeatLoader from "react-spinners/BeatLoader";
import SimplifyDebts from "./Simplify";
import { CSVLink } from "react-csv";
import emailjs from "@emailjs/browser";
import { BellIcon } from "@heroicons/react/solid";
import DropDown from "../../Components/DropDown";
import Receipt from "./ReceiptModel";

const GroupDetail = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [deleteMember, setDeleteMember] = useState("");
  const [openAddExpense, setAddExpense] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { groupId } = useParams();
  const [expenseList, setExpenseList] = useState([]);
  const [approvedExpenseList, setapprovedExpenseList] = useState([]);
  const [settledExpenseList, setSettledExpenseList] = useState([]);
  const [group, setGroup] = useState({});
  const [memberList, setMemberList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [openSimplify, setOpenSimplify] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [exportdata, setExportData] = useState([]);

  useEffect(() => {
    getUserDeatils(setCurrentUser);
  }, []);

  const fetchData = async (groupId) => {
    setLoading(true);
    try {
      const result = await axios.get(`/group/${groupId}`);
      if (result) {
        setGroup(result.data);
        setMemberList(result.data.members);
      } else {
        alert("Group not found", "error");
        navigate("/groups");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchData(groupId);
    }
  }, [groupId]);

  const fetchExpenses = async (groupId) => {
    setLoading(true);
    try {
      if (!groupId) return;
      const result = await axios.get(
        `http://localhost:4000/expense/group/${groupId}/member/${currentUser._id}`
      );
      if (result) {
        const { activeExpenses, settledExpenses, approvedExpenses } =
          result.data;
        if (activeExpenses || settledExpenses || approvedExpenses) {
          setExpenseList(activeExpenses || []);
          setSettledExpenseList(settledExpenses || []);
          setapprovedExpenseList(approvedExpenses || []);
        }
        const temp = activeExpenses;
        let data = [];
        temp.forEach((element) => {
          data.push({
            transactionId: element._id,
            category: element.category,
            description: element.description,
            paidBy: element.paidBy.name,
            date: element.date,
            NumberMembers: element.membersBalance.length,
            NumberSettledMembers: element.settledMembers.length,
            isSettled: element.isSettled,
          });
        });
        setExportData(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // const fetchSimplifyDebts = async (groupId) => {
  //     try {
  //         if (!groupId) return;
  //         const result = await axios.get(
  //             `http://localhost:4000/expense/simplify/${groupId}`
  //         );
  //         let transactions = result.data;
  //         transactions.forEach(transaction => {
  //             let f1;
  //             let f2;
  //             memberList.forEach(member => {
  //                 if (member._id == transaction.from) {
  //                     f1 = member.name;
  //                 }
  //                 if (member._id == transaction.to) {
  //                     f2 = member.name;
  //                 }
  //             })
  //             transaction.from = f1;
  //             transaction.to = f2;
  //         });
  //         setSimplify(transactions);
  //     } catch (err) {
  //         console.log(err);
  //     }
  // }

  useEffect(() => {
    if (groupId) {
      fetchExpenses(groupId);
      // fetchSimplifyDebts(groupId);
    }
  }, [groupId]);

  const groupDeleteTitle = useMemo(() => {
    return `Delete ${group.name}`;
  }, [group]);

  const handleAddMember = async (memberId) => {
    try {
      if (memberId) {
        const result = await axios.post(
          `http://localhost:4000/group/${groupId}/member/${memberId}`
        );
        if (result) {
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleMemberDelete = async (memberId) => {
    if (group.members.length === 1) {
      alert("Cannot delete the last member", "error");
      setOpen(false);
      return;
    }
    if (memberId) {
      const result = await axios.delete(
        `http://localhost:4000/group/${groupId}/member/${memberId}`
      );
      if (result) {
        alert("Member removed", "success");
        fetchData(groupId);
        setOpen(false);
        if (memberId === currentUser._id) {
          window.location.href = "/";
        } else {
          window.location.reload();
        }
        return;
      }
    }
    alert("Something went wrong", "error");
  };

  const handleGroupDelete = async () => {
    if (groupId) {
      const result = await axios.delete(
        `http://localhost:4000/group/${groupId}`
      );

      if (result.data) {
        alert("Group Deleted", "success");
        setOpenDeleteModal(false);
        setTimeout(() => {
          window.location.href = "/groups";
        }, 500);
        return;
      }
    }

    alert("Something went wrong", "error");
  };

  // const Email = (member) => {
  //   emailjs
  //     .sendForm(
  //       "service_l06xrc1",
  //       "template_5uey86x",
  //       "template":{
  //         to: member.email,
  //         to_name: member.name,
  //         from: currentUser.name,
  //         message: "Please settle up the payment",
  //         reply_to: currentUser.email,
  //       },
  //       "yuM3VYdd9UykUv1dn"
  //     )
  //     .then(
  //       (result) => {
  //         console.log(result.text);
  //       },
  //       (error) => {
  //         console.log(error.text);
  //       }
  //     );
  // };

  // if (loading) return <div className="flex justify-center"><BeatLoader /></div>;
  return (
    <div className="dark:bg-gray-900 dark:text-white md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%]">
      <div className="dark:bg-gray-900 dark:text-white flex h-[calc(100vh-64px)] flex-1 flex-col px-4 pt-3  sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl">
        <div>
          <Breadcrumb
            paths={[
              { name: "Groups", to: "/groups" },
              { name: "Group Detail", to: `/group/detail/${group._id}` },
            ]}
          />
          <div className="dark:bg-gray-900 dark:text-white mt-2 flex md:items-center md:justify-between">
            <div className="dark:bg-gray-900 dark:text-white min-w-0 flex-1">
              <h2 className="dark:bg-gray-900 dark:text-white text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                {group.name}
              </h2>
            </div>

            <div className="dark:bg-gray-900 dark:text-white dark:bg-gray-900 dark:text-white dark:bg-gray-900 dark:text-white mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
              <button
                onClick={() => {
                  setReceipt(true);
                }}
                className="  dark:bg-gray-900 dark:text-white bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                width="w-full"
              >
                Receipt
              </button>
            </div>
            <div className="dark:bg-gray-900 dark:text-white mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
              <button
                onClick={() => {
                  setOpenSimplify(true);
                }}
                className=" dark:bg-gray-900 dark:text-white bg-blue-900 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                width="w-full"
              >
                Simplify Debts
              </button>
            </div>
            <div className="dark:bg-gray-900 dark:text-white mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
              <CSVLink
                data={exportdata}
                className=" dark:bg-gray-900 dark:text-white bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                width="w-full"
              >
                Export
              </CSVLink>
            </div>
            <div className="dark:bg-gray-900 dark:text-white mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
              <button
                onClick={() => {
                  setAddExpense(true);
                }}
                className=" dark:bg-gray-900 dark:text-white bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                width="w-full"
              >
                <PlusCircleIcon className="w-5 mr-2" />
                Add Expense
              </button>
            </div>
            <div className="dark:bg-gray-900 dark:text-white flex flex-shrink-0 scale-[80%] md:mt-0 md:ml-4 md:hidden">
              <button
                onClick={() => {
                  setOpenSimplify(true);
                }}
                className=" dark:bg-gray-900 dark:text-white bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                width="w-full"
              >
                Simplify Debts
              </button>
            </div>
            <div className="dark:bg-gray-900 dark:text-white mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
              <Link
                to={`/groupexpense/report/${groupId}`}
                className=" dark:bg-gray-900 dark:text-white bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                width="w-full"
              >
                Expense Report
              </Link>
            </div>
            <div className="dark:bg-gray-900 dark:text-white flex flex-shrink-0 scale-[80%] md:mt-0 md:ml-4 md:hidden">
              <CSVLink
                data={exportdata}
                className=" dark:bg-gray-900 dark:text-white bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                width="w-full"
              >
                Export
              </CSVLink>
            </div>
            <div className="dark:bg-gray-900 dark:text-white flex flex-shrink-0 scale-[80%] md:mt-0 md:ml-4 md:hidden">
              <button
                className=" dark:bg-gray-900 dark:text-white bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
                width="w-full"
                onClick={() => {
                  setAddExpense(true);
                }}
              >
                <PlusCircleIcon className="w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="dark:bg-gray-900 dark:text-white flex flex-col pt-6 sm:grid sm:h-[calc(100vh-180px)] sm:grid-cols-4 sm:space-x-4">
          <div className="dark:bg-gray-900 dark:text-white w-full overflow-y-auto sm:col-span-2">
            <p className="dark:bg-gray-900 dark:text-white mb-2 text-sm font-medium uppercase text-gray-500">
              Expense List
            </p>
            {loading ? (
              <BeatLoader />
            ) : (
              <Tabs
                tabs={[
                  {
                    label : "Active",
                    content: (
                      <>
                        <ExpenseList
                          currentUser={currentUser}
                          expenseList={expenseList}
                        />
                      </>
                    ),
                  },
                  {
                    label: "Approvals",
                    content: (
                      <>
                        <ExpenseList
                          currentUser={currentUser}
                          expenseList={approvedExpenseList}
                          approved
                        />
                      </>
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
          <div className="dark:bg-gray-900 dark:text-white flex flex-col justify-start sm:col-span-2">
            <div className="my-2">
              <p className="text-sm font-medium uppercase text-gray-500">
                Add Member
              </p>
              <SearchMember
                memberList={memberList}
                setMemberList={setMemberList}
                handleAdd={handleAddMember}
              />
            </div>
            <div className="my-2 rounded border shadow-sm ">
              <p className=" rounded-t bg-gray-800 p-2 text-sm font-semibold uppercase text-white">
                Members
              </p>
              {loading ? (
                <BeatLoader />
              ) : (
                <div className="divide-y-2 p-2">
                  {memberList &&
                    memberList.length > 0 &&
                    memberList.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="mt-1 text-sm font-semibold text-gray-700 ">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.email}
                          </p>
                        </div>
                        {/* <div>
                          <Link to={`/email/${member.email}/${member.name}`}>
                            <BellIcon className="w-5 text-green-400" />
                          </Link>
                        </div> */}
                        <div className="flex">
                          <BellIcon
                            className="w-5 text-green-400 mr-2 cursor-pointer"
                            onClick={() => {
                              navigate(`/email/${member.email}/${member.name}`);
                            }}
                          />
                          <TrashIcon
                            className="w-5 text-red-600 cursor-pointer"
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
            <div className="dark:bg-gray-900 dark:text-white my-2 mt-6 rounded border-2 border-dashed border-red-200 p-2 shadow-sm">
              <p className="text-sm font-semibold uppercase text-red-600">
                Danger Zone
              </p>
              <Button
                type="secondaryDanger"
                width="w-full"
                margin="mt-4"
                onClick={() => setOpenDeleteModal(true)}
              >
                Delete Group
              </Button>
            </div>
          </div>
        </div>

        {/* {loading && (
                    <div className="flex justify-center items-center h-full">
                        <CircularProgress />
                    </div>
                )} */}

        <SimplifyDebts
          memberList={memberList}
          open={openSimplify}
          setOpen={setOpenSimplify}
          groupId={groupId}
        />
        <Receipt
          memberList={memberList}
          open={receipt}
          setOpen={setReceipt}
          groupId={groupId}
        />

        <AddgroupExpense
          open={openAddExpense}
          setOpen={setAddExpense}
          currentUser={currentUser}
          groupId={groupId}
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
        <Modal
          title={groupDeleteTitle}
          memberId={groupId}
          icon={<ExclamationIcon className="w-5 text-red-600" />}
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          text="Are you sure you want to delete this group? All expenses related to this group will be deleted."
          buttonText="Delete"
          buttonType="danger"
          handleDelete={handleGroupDelete}
        />
      </div>
    </div>
  );
};

export default GroupDetail;
