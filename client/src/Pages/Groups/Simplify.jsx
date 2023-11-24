import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import FormInput from "../../Components/FormInput";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import InputCategory from "../../Components/InputCategory";
import BeatLoader from "react-spinners/BeatLoader";
import { XIcon } from "@heroicons/react/solid";

const SimplifyDebts = ({ memberList, groupId, open = false, setOpen }) => {
  const [simplify, setSimplify] = useState([]);
  const [Loading, setLoading] = useState(true);

  const fetchSimplifyDebts = async (groupId) => {
    try {
      setLoading(true);
      if (!groupId) return;
      const result = await axios.get(
        `http://localhost:4000/expense/simplify/${groupId}`
      );
      let transactions = result.data;
      transactions.forEach((transaction) => {
        let f1;
        let f2;
        memberList.forEach((member) => {
          if (member._id == transaction.from) {
            f1 = member.name;
          }
          if (member._id == transaction.to) {
            f2 = member.name;
          }
        });
        transaction.from = f1;
        transaction.to = f2;
      });
      setSimplify(transactions);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchSimplifyDebts(groupId);
    }
  }, [memberList, groupId]);

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
                <div className="w-80 bg-white px-4 pt-2 pb-4 sm:w-auto sm:px-6 sm:pt-3 sm:pb-4">
                  <div className="flex w-full justify-end">
                    {/* <div className="justify-center">Simplified Bills</div> */}
                    <button type="icon" onClick={() => setOpen(false)}>
                      <XIcon className="w-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex justify-center md-4">
                    Simplified Bills
                  </div>

                  {Loading ? (
                    <BeatLoader />
                  ) : simplify.length == 0 ? (
                    <h1>You are already Settled</h1>
                  ) : (
                    <table className="mt-4 min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-700 text-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                            From
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                            To
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {simplify.map((group) => (
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {group.from}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {group.to}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {group.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SimplifyDebts;
