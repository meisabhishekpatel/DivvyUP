import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import FormInput from "../../Components/FormInput";
import { useContext, useState, useEffect } from "react";
import getUserDeatils from "../../GetData/UserDetails";
import axios from "axios";

const Addexpense = ({
    friend,
    open = false,
    setOpen,
}) => {
    const [expenseList, setExpenseList] = useState([]);
    const [settledExpenseList, setSettledExpenseList] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    useEffect(() => {
        getUserDeatils(setCurrentUser);
    }, [])
    const [data, setData] = useState({});

    useEffect(() => {
        setData({
            description: "",
            amount: "",
            friendId: friend,
            paidBy: currentUser._id,
        })
    }, [currentUser])

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };



    const handleAddExpense = async (e) => {
        e.preventDefault();
        doSubmit();
    };

    const doSubmit = async () => {
        try {
            console.log(data);
            const result = await axios.post("http://localhost:4000/expense/addFriendExpense", data);
            if (result.data) {
                alert("Expense Added");
                setData({
                    description: "",
                    amount: "",
                    friendId: friend,
                    paidBy: currentUser._id,
                })
            }
        } catch (err) {
            alert(err);
        }
    };

    return (
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
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="max-w-lg mt-6">
                                        <FormInput
                                            label="Description"
                                            name="description"
                                            placeholder="Enter description"
                                            value={data.description}
                                            onChange={handleChange}
                                        />
                                        <FormInput
                                            label="Amount"
                                            name="amount"
                                            placeholder="0.00"
                                            type="number"
                                            showLeadingIcon
                                            value={data.amount}
                                            onChange={handleChange}
                                        />

                                        <p className="mt-3 max-w-fit border border-green-600 px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full text-sm">
                                            Split Equally
                                        </p>

                                        <button onClick={handleAddExpense} className="mt-6 w-full px-4 py-2 text-decoration-none tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-600">
                                            Add Expense
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default Addexpense;