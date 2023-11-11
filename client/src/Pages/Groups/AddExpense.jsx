import Breadcrumb from "../../Components/BreadCrumb";
import FormInput from "../../Components/FormInput";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";

const AddExpense = ({ group }) => {
    const { groupId } = useParams();
    const currentUser = {
        name: "Abhishek",
        email: "abhishek.20214053@gmail.com",
        id: "dnfajndvaokonoafnvaof",
    };

    const [data, setData] = useState({
        description: "",
        amount: "",
        groupId: groupId,
        paidBy: currentUser.id,
    });


    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        doSubmit();
    };

    const doSubmit = async () => {

    };

    return (
        <div className="mt-4 h-full flex-1 px-4 flex flex-col  sm:px-6 xl:max-w-6xl lg:mx-auto lg:px-8">
            <Breadcrumb
                paths={[
                    { name: "Groups", to: "/groups" },
                    { name: "Group Detail", to: `/group/detail/${groupId}` },
                    { name: "Add Expense", to: `/group/${groupId}/addexpense` },
                ]}
            />
            <div className="mt-2 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Add Expense
                    </h2>
                </div>
            </div>

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
    );
};

export default AddExpense;
