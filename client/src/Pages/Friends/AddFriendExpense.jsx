import Breadcrumb from "../../Components/BreadCrumb";
import FormInput from "../../Components/FormInput";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getUserDeatils from "../../GetData/UserDetails";
import axios from "axios";
import Tabs from "../../Components/Tabs";
import ExpenseList from "./ExpenseList";

const AddFriendExpense = ({ group }) => {
    const [expenseList, setExpenseList] = useState([]);
    const [settledExpenseList, setSettledExpenseList] = useState([]);
    const { friendId } = useParams();
    const [currentUser, setCurrentUser] = useState({});
    const [friend,setFriend]=useState({});
    useEffect(() => {
        getUserDeatils(setCurrentUser);
    }, [])
    const [data, setData] = useState({});
    useEffect(() => {
        // console.log(currentUser);
        setData({
            description: "",
            amount: "",
            friendId: friendId,
            paidBy: currentUser._id,
        })
    }, [currentUser])

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const fetchExpenses = async () => {
        if (!friendId) return;
        console.log(currentUser);
        const result = await axios.get(`http://localhost:4000/expense/user/${currentUser._id}`);
        if (result) {
            const { activeExpenses, settledExpenses } = result.data;
            if (activeExpenses || settledExpenses) {
                setExpenseList(activeExpenses || []);
                setSettledExpenseList(settledExpenses || []);
            }
        }
    };


    const handleAddExpense = async (e) => {
        e.preventDefault();
        doSubmit();
    };

    const doSubmit = async () => {
        try {
            const result = await axios.post("http://localhost:4000/expense/addFriendExpense", data);
            if (result.data) {
                alert("Expense Added");
                setData({
                    description: "",
                    amount: "",
                    friendId: friendId,
                    paidBy: currentUser._id,
                })
            }
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%]">
        <div className="mt-4 h-full flex-1 px-4 flex flex-col  sm:px-6 xl:max-w-6xl lg:mx-auto lg:px-8">
            <Breadcrumb
                paths={[
                    { name: "Friends", to: `/friends` },
                    { name: "Friend Detail", to: `/addfriendExpense/${friendId}` },
                ]}
            />
            <div className="mt-2 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Add Expense
                    </h2>
                </div>
            </div>
            <div className="flex flex-col pt-6 sm:grid sm:h-[calc(100vh-180px)] sm:grid-cols-4 sm:space-x-4">
                    {/* <div className="w-full overflow-y-auto sm:col-span-2">
                        <p className="mb-2 text-sm font-medium uppercase text-gray-500">
                            Expense List
                        </p>
                        <Tabs
                            tabs={[
                                {
                                    label: "Active",
                                    content: (
                                            <ExpenseList currentUser={currentUser} expenseList={expenseList} />
                                    ),
                                },
                                {
                                    label: "Settled",
                                    content: (
                                        <ExpenseList currentUser={currentUser} expenseList={settledExpenseList} settled />
                                    ),
                                },
                            ]}
                        />
                    </div> */}
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

            
        </div>
        </div>
    );
};

export default AddFriendExpense;
