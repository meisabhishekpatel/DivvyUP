import { Dialog, Transition } from "@headlessui/react";
import { XIcon, ReplyIcon, CheckCircleIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";

const ExpenseDetailModal = ({
  children,
  open = false,
  setOpen,
  expense,
  settled,
  approved,
  currentUser,
}) => {
  const handleApproveExpense = async () => {
    const response = await axios.post(
      `http://localhost:4000/expense/${expense._id}/approve/${currentUser._id}`
    );
    if (response) {
      alert("Expense settled", "success");
      setOpen(false);
      window.location.reload();
    }
  };
  const handleSettleExpense = async () => {
    const response = await axios.post(
      `http://localhost:4000/expense/${expense._id}/settle/${currentUser._id}`
    );
    if (response) {
      alert("Expense Approved", "success");
      setOpen(false);
      window.location.reload();
    }
  };
  const handleRevertExpense = async () => {
    const response = await axios.post(
      `http://localhost:4000/expense/${expense._id}/revert/${currentUser._id}`
    );

    if (response) {
      alert("Expense reverted", "success");
      setOpen(false);
      window.location.reload();
    }
  };

  const [settledMembers, setSettledMembers] = useState([]);

  async function fetchUser() {
    const result = await axios.get(
      "http://localhost:4000/user/settledMembers",
      {
        params: {
          userIds: JSON.stringify(expense.settledMembers),
        },
      }
    );
    setSettledMembers(result.data);
  }

  useEffect(() => {
    if (expense && expense.settledMembers.length > 0) {
      fetchUser();
    }
  }, [expense]);

  return (
    <>
      {expense ? (
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="w-80 bg-white px-4 pt-2 pb-4 sm:w-auto sm:px-6 sm:pt-3 sm:pb-4">
                      <div className="flex w-full justify-end">
                        <button type="icon" onClick={() => setOpen(false)}>
                          <XIcon className="w-5 text-gray-600" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold leading-5 text-gray-700">
                            {expense.description}
                          </p>
                          <p className="mt-2 leading-5 text-gray-500">
                            Paid by{" "}
                            <span className="font-medium text-gray-600">
                              {expense.paidBy.name}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="mt-2 text-xl font-semibold leading-5 text-gray-700 sm:text-3xl">
                            ₹ {Number(expense.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        {expense.paidBy._id === currentUser._id ? (
                          <div className="justify-self-center text-lg font-semibold text-green-600">
                            <p>
                              You Lent{" "}
                              <span>
                                ₹{" "}
                                {
                                  expense?.membersBalance?.find(
                                    (member) =>
                                      member?.memberId?.toString() ===
                                      currentUser._id
                                  ).balance
                                }
                              </span>
                            </p>
                          </div>
                        ) : (
                          <div
                            className={`${
                              settled || approved
                                ? "text-green-600"
                                : "text-red-500"
                            } justify-self-center text-lg font-semibold`}
                          >
                            <p>
                              {settled || approved ? "Settled" : "You Owe"}{" "}
                              <span>
                                ₹{" "}
                                {
                                  expense?.membersBalance
                                    ?.find(
                                      (member) =>
                                        member?.memberId?.toString() ===
                                        currentUser._id
                                    )
                                    .balance.split("-")[1]
                                }
                              </span>
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        {settledMembers.length > 0 ? (
                          <div>
                            <p className="my-2 border-b pb-1 font-semibold uppercase text-gray-700">
                              Settled By{" "}
                            </p>

                            {settledMembers.map((member) => {
                              return (
                                <p
                                  className="flex items-center"
                                  key={member._id}
                                >
                                  <span className="mr-1 rounded-full bg-emerald-500">
                                    <CheckCircleIcon className="w-5 text-white" />
                                  </span>
                                  <span>{member.name}</span>
                                </p>
                              );
                            })}
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-semibold uppercase text-gray-700">
                              No one settled yet
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {expense.paidBy._id !== currentUser._id && !approved && (
                      <div className="mt-3 flex justify-end border-t bg-gray-100 p-3">
                        <button type="success" onClick={handleApproveExpense}>
                          Settle Up
                        </button>
                      </div>
                    )}
                    {expense.paidBy._id === currentUser._id && approved && (
                      <div className="mt-3 flex justify-end border-t bg-gray-100 p-3">
                        <button type="success" onClick={handleSettleExpense}>
                          Approve
                        </button>
                      </div>
                    )}

                    {/* {approved && (
                      <div className="mt-3 flex justify-end border-t bg-gray-100 p-3">
                        <button
                          type="danger"
                          onClick={handleRevertExpense}
                          leftIcon={<ReplyIcon className="mr-1 w-5" />}
                        >
                          Revert
                        </button>
                      </div>
                    )} */}
                    {/* {settled && (
                      <div className="mt-3 flex justify-end border-t bg-gray-100 p-3">
                        <button
                          type="danger"
                          onClick={handleRevertExpense}
                          leftIcon={<ReplyIcon className="mr-1 w-5" />}
                        >
                          Revert
                        </button>
                      </div>
                    )} */}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : null}
    </>
  );
};

export default ExpenseDetailModal;
