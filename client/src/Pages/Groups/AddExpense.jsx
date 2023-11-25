import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import FormInput from "../../Components/FormInput";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import InputCategory from "../../Components/InputCategory";
import DateInput from "../../Components/InputDate";
import InputBox from "../../Components/InputBox";
import useCurrencyInfo from "../../context/useContext";

const Addexpense = ({ currentUser, groupId, open = false, setOpen }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState({
    description: "",
    amount: "",
    category: "Other",
    groupId: groupId,
    paidBy: currentUser._id,
  });
  useEffect(() => {
    setData({
      description: "",
      amount: "",
      category: "Other",
      groupId: groupId,
      paidBy: currentUser._id,
    });
  }, [groupId, currentUser]);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    doSubmit(e);
  };

  const handleCategoryChange = (value) => {
    data.category = value;
  };
  const handleDateChange = (value) => {
    setSelectedDate(value);
    data.date = value;
    // console.log(data.date);
  };

  const categories = [
    "Other",
    "Food",
    "Entertainment",
    "Tax",
    "Travel",
    "Loans",
  ];
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("group", groupId);
    const result = await axios.post(
      "http://localhost:4000/upload-files",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (result.data) {
      alert("Uploaded Successfully!!!");
    }
  };

  const currencyInfo = useCurrencyInfo("inr");

  const options = Object.keys(currencyInfo);

  let newamount;
  const handleCurrencyChange = (e) => {
    newamount = data.amount / currencyInfo[e];
    data.amount = newamount.toFixed(2);
  };

  const doSubmit = async (e) => {
    try {
      const result = await axios.post(
        "http://localhost:4000/expense/addExpense",
        data
      );
      if (result.data) {
        alert("Expense Added");
        setData({
          description: "",
          amount: "",
          category: "Other",
          groupId: groupId,
          paidBy: currentUser._id,
        });
        window.location.reload();
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
          <div className="dark:bg-black fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="max-w-lg mt-6">
                    <InputCategory
                      type="Category"
                      label="Category"
                      values={categories}
                      onValueChange={handleCategoryChange}
                    />
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
                      value={data.amount}
                      onChange={handleChange}
                    />

                    <InputBox
                      type="Currency"
                      label="Currency"
                      values={options}
                      onValueChange={handleCurrencyChange}
                    />
                    <DateInput
                      selectedDate={selectedDate}
                      onValueChange={handleDateChange}
                    />

                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      for="file_input"
                    >
                      Upload Receipt
                    </label>
                    <div className="flex">
                      <input
                        class="text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file_input"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFile}
                      />
                      <button
                        onClick={handleAddFile}
                        className="ml-4 px-4 py-2 text-decoration-none tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-600"
                      >
                        Upload
                      </button>
                    </div>

                    <p className="mt-3 max-w-fit border border-green-600 px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full text-sm">
                      Split Equally
                    </p>

                    <button
                      onClick={handleAddExpense}
                      className="mt-6 w-full px-4 py-2 text-decoration-none tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-600"
                    >
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
};

export default Addexpense;
